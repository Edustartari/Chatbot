from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get-conversations/<slug:user_id>", views.get_conversations, name="get_conversations"),
    path("chat/", views.chat, name="chat"),
]