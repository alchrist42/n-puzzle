import json
import concurrent.futures

from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from webapp.logic.generator import make_puzzle, make_goal
from webapp.logic.solvers import Chebyshev, Euclidean, Manhattan


MAX_CALCULATE_SOLUTION_TIME = 5.0


def index(request):
    return render(request, "index.html")


def new_puzzle(request, size, iter=10000):
    if size < 3 or size > 6:
        return JsonResponse(
            {"error": "incorrect puzzle size, must be in [3,6]"}, status=404
        )
    pzl = make_puzzle(size, solvable=True, iterations=iter, sharp=1)
    goal = make_goal(size, sharp=1)
    return JsonResponse({"puzzle": pzl, "goal": goal}, json_dumps_params={"indent": 2})


@require_POST
@csrf_exempt
def solver(request):
    body = json.loads(request.body)
    pzl = body.get("puzzle")
    if not pzl:
        return JsonResponse({"error": "No puzzle"}, status=400)
    # convert to 2 dimensional
    if pzl and not isinstance(pzl[0], list):
        square = len(pzl)
        if abs(square**0.5 - int(square**0.5)) > 0.01:
            return JsonResponse({"error": "Incorrect puzzle lenght"}, status=400)
        lenght = int(square**0.5)
        pzl = [pzl[lenght * i : lenght * (i + 1)] for i in range(lenght)]

    opt = len(pzl) / 3
    sol = Manhattan(pzl, k_heuristic=opt)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(sol.run)
        try:
            future.result(timeout=MAX_CALCULATE_SOLUTION_TIME)
        except concurrent.futures.TimeoutError:
            sol.raise_timeout = True
            return JsonResponse({"error": "Solution calculation timeout"}, status=400)

    if not sol.pzl_is_solvable:
        return JsonResponse({"error": "Not any solution for puzzle"}, status=400)
    return JsonResponse(
        {
            "evristic_name": sol.name,
            "moves": sol.moves,
            "checks": sol.iteration,
            "k_heuristic": round(sol.k_heuristic, 2),
            "cache_len": sol.len_cache,
            "queue_len": sol.max_steps,
            "spend_time": sol.spend_time,
            "start_distance": round(sol.start_heuristic_dist, 2)
        },
        json_dumps_params={"indent": 2},
    )
