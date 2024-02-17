from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase_client import FirebaseClient
from .storage_bucket import StorageBucket
from .serializers import UserSerializer, PostSerializer, LikeAndDislikeSerializer, CommentSerializer
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
    

@api_view(['GET'])
def get_post_by_email(request):
    user_email = request.GET.get('user_email')
    posts = client.get_post_by_email(user_email)
    if posts:
        # serializer=PostSerializer(posts, many=True)
        return Response(posts, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    
# like and dislike
@api_view(['GET', 'POST'])
def add_like(request):
    date_str = request.GET.get('date')
    date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    if request.method == 'GET':
        likes = client.get_all_likes(date=date)
        return Response(likes, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = LikeAndDislikeSerializer(data=request.data)
        if serializer.is_valid():
            client.add_like(request.data, date)
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def add_dislike(request):
    date_str = request.GET.get('date')
    date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    if request.method == 'GET':
        dislikes = client.get_all_dislikes(date=date)
        return Response(dislikes, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = LikeAndDislikeSerializer(data=request.data)
        if serializer.is_valid():
            client.add_dislike(request.data, date)
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

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
    

# comment
@api_view(['GET', 'POST'])
def add_comment(request):
    date_str = request.GET.get('date')
    date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    if request.method == 'GET':
        comments = client.get_all_comments(date=date)
        return Response(comments, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            client.add_comment(request.data, date)
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)