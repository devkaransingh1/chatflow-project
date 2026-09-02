from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRequest
# Create your views here.
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ChatRequest
from .serializers import ChatRequestSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


class SendChatRequestView(generics.CreateAPIView):
    serializer_class = ChatRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatRequest.objects.filter(
            sender=self.request.user
        )



class ContactListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        sent_contacts = ChatRequest.objects.filter(
            sender=user,
            status="accepted"
        ).values(
            "receiver__username",
            "receiver__email",
            "receiver__is_online"
        )

        received_contacts = ChatRequest.objects.filter(
            receiver=user,
            status="accepted"
        ).values(
            "sender__username",
            "sender__email",
            "sender__is_online"
        )

        contacts = []

        for contact in sent_contacts:
            contacts.append({
                "username": contact["receiver__username"],
                "email": contact["receiver__email"],
                "is_online": contact["receiver__is_online"],
            })

        for contact in received_contacts:
            contacts.append({
                "username": contact["sender__username"],
                "email": contact["sender__email"],
                "is_online": contact["sender__is_online"],
            })

        return Response(contacts)


class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.query_params.get("username", "").strip()

        if not username:
            return Response([])

        users = User.objects.filter(
            username__icontains=username
        ).exclude(
            id=request.user.id
        )[:10]

        data = [
    {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_online": user.is_online,
    }
    for user in users
]

        return Response(data)

class IncomingRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        requests = ChatRequest.objects.filter(
            receiver=request.user,
            status='pending'
        ).select_related("sender")

        data = []

        for chat_request in requests:
            data.append({
                "id":chat_request.id,
                "sender_username":chat_request.sender.username,
                "sender_email":chat_request.sender.email,
                "created_at": chat_request.created_at
            })

        return Response(data)


class AcceptChatRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            chat_request = ChatRequest.objects.get(
                id=pk,
                receiver=request.user,
                status="pending"
            )
        except ChatRequest.DoesNotExist:
            return Response(
                {"detail": "Pending chat request not found."},
                status=404
            )

        chat_request.status = "accepted"
        chat_request.save()

        return Response({
            "id": chat_request.id,
            "status": chat_request.status,
            "message": "Chat request accepted."
        })


class RejectChatRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            chat_request = ChatRequest.objects.get(
                id=pk,
                receiver=request.user,
                status="pending"
            )
        except ChatRequest.DoesNotExist:
            return Response(
                {"detail": "Pending chat request not found."},
                status=404
            )

        chat_request.status = "rejected"
        chat_request.save()

        return Response({
            "id": chat_request.id,
            "status": chat_request.status,
            "message": "Chat request rejected."
        })

