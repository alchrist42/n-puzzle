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


def new_pazzle(request, size):
    if size < 3 or size > 6:
        return JsonResponse(
            {"error": "incorrect puzzle size, must be in [3,6]"},
        )
    pzl = make_puzzle(size, solvable=True, sharp=2)
    goal = make_goal(size, sharp=2)
    return JsonResponse(
        {"pazzle": pzl, "goal": goal},
    )

@require_POST
@csrf_exempt
def solver(request):
    body = json.loads(request.body)
    pzl = body.get("pazzle")
    if not pzl:
        return JsonResponse(
            {"error": "no pazzle"},
        )
    # todo add not solvable check
    goal = make_goal(len(pzl), sharp=2)
    sol = Chebyshev(pzl, optimizator=2)
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
        }
    )


# def login_view(request):
#     # if request.user.is_authenticated:
#     #     return redirect("account:account")
#     if request.method == "POST":
#         # print("view way  ^_^")
#         form = AuthenticationForm(data=request.POST)
#         if form.is_valid():
#             # Attempt to sign user in
#             username = form.cleaned_data["username"]
#             password = form.cleaned_data["password"]
#             user = authenticate(request, username=username, password=password)

#             # Check if authentication successful
#             if user is not None:
#                 login(request, user)
#                 print("logged")
#                 return JsonResponse({"logged": True})
#                 return redirect("account:account")
#             else:
#                 form = AuthenticationForm()
#                 return JsonResponse({"logged": False, "msg": "huynya kakaya-to"},)

#                 return render(
#                     request,
#                     "account/account.html",
#                     {"message": "Invalid username and/or password.", "form": form},
#                 )
#     else:
#         form = AuthenticationForm()
#     return render(request, "account/login.html", {"form": form})


# class Logout(LogoutView):
#     next_page = 'account:account'

# @csrf_exempt
# def logout_ajax(request):
#     logout(request)
#     return JsonResponse({"msg": "You are log out!", 'form': AuthenticationForm().as_p()})

# def login_ajax(request):
#     if request.method == 'POST':
#         # username, password = request.POST.get('username'), request.POST.get('username')
#         # print(username, password)
#         form = AuthenticationForm(data=request.POST)
#         if form.is_valid():
#             # Attempt to sign user in
#             username = form.cleaned_data["username"]
#             password = form.cleaned_data["password"]
#             user = authenticate(request, username=username, password=password)

#             # Check if authentication successful
#             if user is not None:
#                 login(request, user)
#                 return JsonResponse({"logged": True})
#             else:
#                 return JsonResponse({"logged": False, "msg": "wrong user/pass"}, )
#         else:
#             return JsonResponse({"logged": False, "msg": "wrong user/pass"},)
