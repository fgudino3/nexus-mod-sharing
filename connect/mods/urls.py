from django.urls import path, URLPattern
from .views import ModView

urlpatterns: URLPattern = [
    path('', ModView.as_view()),
]