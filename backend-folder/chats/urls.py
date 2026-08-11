from django.urls import path
from .views import SendChatRequestView, ContactListView

urlpatterns = [
    path(
        "requests/",
        SendChatRequestView.as_view(),
        name="send-chat-request"
    ),
    path("contacts/", ContactListView.as_view(), name="contacts"),
]