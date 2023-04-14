from django.urls import path
from django.views.generic import TemplateView

from .views import index, new_puzzle, solver

urlpatterns = [
    path("", index, name="front"),
    path("new_puzzle/<int:size>", new_puzzle, name="new_puzzle"),
    path("new_puzzle/<int:size>/<int:iter>", new_puzzle, name="new_puzzle"),
    path("solver/", solver, name="solver"),
]
