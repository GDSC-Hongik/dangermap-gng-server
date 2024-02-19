from django.urls import path
from .views import get_user_list, get_user, get_user_post_list, get_post_list, delete_post, get_post_by_coord, get_marker, get_post, get_post_by_email, add_like, add_dislike, add_comment, get_comment

urlpatterns = [
    # user 컬렉션 기반
    path('users', get_user_list),
    path('users/<str:pk>', get_user), # user_email을 pk로 받음
    path('users/<str:pk>/posts', get_user_post_list),

    # post 컬렉션 기반
    path('posts', get_post_list),
    path('posts/', delete_post),
    path('posts/<str:type>', get_post), # danger_type을 type으로 받음
    path('posts/email/', get_post_by_email),

    # 지도
    path('markers', get_marker),
    path('posts/location/', get_post_by_coord),

    # 좋아요, 싫어요 조회 및 추가
    path('posts/like/', add_like),
    # path('posts/dislike/', add_dislike),

    # 댓글 조회 및 추가
    path('posts/comment/', add_comment),
    path('posts/comment/get/', get_comment),
]