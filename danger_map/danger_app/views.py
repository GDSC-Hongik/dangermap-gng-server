from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase_client import FirebaseClient
from .storage_bucket import StorageBucket
from .serializers import PostSerializer, LikeAndDislikeSerializer, CommentSerializer
from datetime import datetime

client = FirebaseClient()
bucket = StorageBucket()

# user
@api_view(['GET'])
def get_user_list(request):
    users = client.get_all_users()
    return Response(users, status=status.HTTP_200_OK)


@api_view(['GET', 'DELETE'])
def get_user(request, pk):
    doc = client.get_user(email=pk)
    if request.method == 'GET':
        if doc:
            return Response(doc, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.method == 'DELETE':
        if doc:
            client.delete_user(pk)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_user_post_list(request, pk):
    posts = client.get_all_user_posts(pk)
    return Response(posts, status=status.HTTP_200_OK)
    

# post
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
    

@api_view(['GET', 'DELETE'])
def delete_post(request):
    date_str = request.GET.get('date')
    date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    if request.method == 'GET':
        post = client.get_post_by_date(date)
        return Response(post, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        client.delete_post(date)
        return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def get_post(request, type):
    posts = client.get_post_by_dangertype(danger_type=type)
    if posts:
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
    

@api_view(['GET'])
def get_post_by_coord(request):
    lat = float(request.GET.get('latitude'))
    lng = float(request.GET.get('longitude'))
    posts = client.get_post_by_coord(lat, lng)
    if posts:
        return Response(posts, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_marker(request):
    if request.method == 'GET':
        posts = client.get_all_markers()
        if posts:
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
    

@api_view(['GET'])
def get_comment(request):
    postdate_str = request.GET.get('postdate')
    commentdate_str = request.GET.get('commentdate')
    postdate = datetime.strptime(postdate_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    commentdate = datetime.strptime(commentdate_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    comment = client.get_comment(postdate, commentdate)
    return Response(comment, status=status.HTTP_200_OK)