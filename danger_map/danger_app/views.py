from django.shortcuts import render
from rest_framework.generics import get_object_or_404, ListAPIView

from .models import Post
from .serializers import PostSerializer

class PostListAPIView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    