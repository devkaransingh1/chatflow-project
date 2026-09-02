from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response
from .models import ChatRequest
# Create your views here.
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from .models import ChatRequest, Messages
from .serializers import ChatRequestSerializer,ChatSerializer
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

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):

        receiver = request.data["receiver"]
        content = request.data["content"]

        message = Messages.objects.create(
            sender=request.user,
            receiver_id=receiver,
            content=content
        )

        return Response(ChatSerializer(message).data)



class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        receiver_id = request.data.get("receiver")
        content = request.data.get("content")

        # Check required fields
        if not receiver_id:
            return Response(
                {"receiver": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not content:
            return Response(
                {"content": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # User cannot message themselves
        if str(receiver_id) == str(request.user.id):
            return Response(
                {"receiver": "You cannot message yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether an accepted friendship exists
        are_friends = ChatRequest.objects.filter(
            Q(
                sender=request.user,
                receiver_id=receiver_id
            ) |
            Q(
                sender_id=receiver_id,
                receiver=request.user
            ),
            status="accepted"
        ).exists()

        if not are_friends:
            return Response(
                {"detail": "You can only message accepted contacts."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create message
        message = Messages.objects.create(
            sender=request.user,
            receiver_id=receiver_id,
            content=content
        )

        return Response(
            ChatSerializer(message).data,
            status=status.HTTP_201_CREATED
        )


class FetchMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,username):

        try:
            other_user = User.object.get(username=username)
        except User.DoesNotExist:
            return Response(
                {
                    "detail":"user not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        messages = Messages.objects.filter(
            Q(sender=request.user , receiver=other_user) |
            Q(sender=other_user, reveiver=request.user)
        ).order_by("created_at")

        serializer= ChatSerializer(messages,many=True)
        return Response(serializer.data)