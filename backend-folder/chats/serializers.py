from rest_framework import serializers
from .models import ChatRequest
from users.models import User


class ChatRequestSerializer(serializers.ModelSerializer):
    receiver_username = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = ChatRequest
        fields = [
            "id",
            "receiver_username",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

    def validate_receiver_username(self, value):
        try:
            receiver = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User not found."
            )

        request = self.context["request"]

        if receiver == request.user:
            raise serializers.ValidationError(
                "You cannot send a request to yourself."
            )

        if ChatRequest.objects.filter(
            sender=request.user,
            receiver=receiver,
            status="pending"
        ).exists():
            raise serializers.ValidationError(
                "Chat request already sent."
            )

        return value

    def create(self, validated_data):
        username = validated_data.pop("receiver_username")

        receiver = User.objects.get(
            username=username
        )

        return ChatRequest.objects.create(
            sender=self.context["request"].user,
            receiver=receiver,
            **validated_data
        )