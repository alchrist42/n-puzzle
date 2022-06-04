import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.views import LogoutView
from django.http import JsonResponse

from django.views.decorators.http import require_POST
from .logic.generator import make_puzzle, make_goal
from .logic.solvers import Chebyshev, Euclidean
from .logic.checker import check_puzzle


def new_puzzle(request, size):
    if size < 3 or size > 6:
        return JsonResponse(
            {"error": "incorrect puzzle size, must be in [3,6]"},
            status=404
        )
    pzl = make_puzzle(size, solvable=True, sharp=2)
    goal = make_goal(size, sharp=2)
    return JsonResponse(
        {"puzzle": pzl, "goal": goal},
        json_dumps_params={"indent":2}
    )


@require_POST
@csrf_exempt
def solver(request):
    body = json.loads(request.body)
    pzl = body.get("puzzle")
    if not pzl:
        return JsonResponse(
            {"error": "no puzzle"},
            status=400
        )
    if not check_puzzle(pzl):
        return JsonResponse(
            {"error": "Not any solution for puzzle"},
            status=400
        )
    # todo add not solvable check
    goal = make_goal(len(pzl), sharp=2)
    if len(pzl) == 5:
        opt = 2
    else:
        opt = 4
    sol = Euclidean(pzl, optimizator=opt)
    sol.run()
    moves = sol.moves
    return JsonResponse(
        {
            "evristic_name": sol.name,
            "moves": sol.moves,
            "checks": sol.iteration,
            "koof": sol.optimizator,
            "cache_len": sol.len_cache,
            "queue_len": sol.max_steps,
            "spend_time": sol.spend_time,
        },
        json_dumps_params={"indent":2}
    )
