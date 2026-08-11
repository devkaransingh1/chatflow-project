from django.urls import path
from .views import SendChatRequestView

urlpatterns = [
    path(
        "requests/",
        SendChatRequestView.as_view(),
        name="send-chat-request"
    ),
]