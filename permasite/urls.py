from django.urls import path

from . import views

urlpatterns = [
    path("search/", views.search, name="search"),
    path("", views.home, name="home"),
    path("draw/", views.draw, name="draw"),
    path("compose/", views.compose_plan, name="compose_plan"),
]