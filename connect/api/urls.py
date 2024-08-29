from django.urls import path, URLPattern
from . import views

urlpatterns: URLPattern = [
    path('mods', views.ModView.as_view()),
]