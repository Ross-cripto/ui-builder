from django.contrib import admin
from .models import Session, Message


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "created_at", "updated_at"]
    ordering = ["-updated_at"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["id", "session", "role", "created_at"]
    list_filter = ["role"]
    ordering = ["created_at"]
