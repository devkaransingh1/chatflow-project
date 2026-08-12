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