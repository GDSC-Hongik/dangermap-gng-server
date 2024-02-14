from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase_client import FirebaseClient
from .storage_bucket import StorageBucket
from .serializers import UserSerializer, PostSerializer, LikeAndDislikeSerializer
from datetime import datetime

client = FirebaseClient()
bucket = StorageBucket()

# root = user collection
@api_view(['GET'])
def get_user_list(request):
    users = client.get_all_users()
    return Response(users, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user(request, pk):
    doc = client.get_user(email=pk)
    if doc:
        user=doc[0].to_dict()
        return Response(user, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

# root = post collection
@api_view(['GET', 'POST'])
def get_post_list(request):
    if request.method == 'GET':
        posts = client.get_all_posts()
        return Response(posts, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            client.create_post(request.data)
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_post(request, type):
    posts = client.get_post(danger_type=type)
    if posts:
        # serializer=PostSerializer(posts, many=True)
        return Response(posts, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

# like and dislike
@api_view(['GET', 'POST'])
def add_like(request, date):
    if request.method == 'GET':
        likes = client.get_all_likes(post_title=date)
        return Response(likes, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = LikeAndDislikeSerializer(request.data)
        if serializer.is_valid():
            client.add_like(request.data, date)
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def add_dislike(request, pk):
    if request.method == 'GET':
        dislikes = client.get_all_dislikes(post_title=pk)
        return Response(dislikes, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        client.add_dislike(post_title=pk)
        return Response(status=status.HTTP_201_CREATED)
    

# user profile
@api_view(['PATCH', 'DELETE'])
def user_profile_pic(request, pk, pic_url):
    if request.method == 'PATCH':
        old_pic = client.get_profile_pic(pk)
        client.update_user_profile_pic(pk, pic_url)
        # client.patch_profile_pic(pk, pic_url)
        bucket.delete_file(old_pic)
        return Response(status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        old_pic = client.get_profile_pic(pk)
        bucket.delete_file(old_pic)
        client.delete_user_profile(pk)
        return Response(status=status.HTTP_200_OK)