from django.shortcuts import render

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