# fashion_api/urls.py

from django.urls import path
from api.views import analyze_image

urlpatterns = [
    path('analyze/', analyze_image, name='analyze_image'),
]
