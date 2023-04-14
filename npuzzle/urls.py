from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include(('webapp.urls', "webapp"), namespace='webapp')),
    # path('', include('frontend.urls')),
]
