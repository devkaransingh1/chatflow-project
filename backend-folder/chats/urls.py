from django.urls import path
from .views import SendChatRequestView, ContactListView, UserSearchView, IncomingRequestView, AcceptChatRequestView, RejectChatRequestView

urlpatterns = [
    path(
        "requests/",
        SendChatRequestView.as_view(),
        name="send-chat-request"
    ),
    path("contacts/", ContactListView.as_view(), name="contacts"),
    path(
        "users/search/",
        UserSearchView.as_view(),
        name="user-search"
    ),
    path("requests/incoming/",IncomingRequestView.as_view(),name="incoming-requests"),
    path(
    "requests/<int:pk>/accept/",
    AcceptChatRequestView.as_view(),
    name="accept-chat-request"
),
path(
    "requests/<int:pk>/reject/",
    RejectChatRequestView.as_view(),
    name="reject-chat-request"
),
]

