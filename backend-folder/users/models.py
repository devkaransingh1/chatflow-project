from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.





class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username