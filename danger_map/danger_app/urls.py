from django.urls import path
from .views import get_user_list, get_user, get_post_list, get_post, add_like, user_profile, add_dislike

urlpatterns = [
    # user 컬렉션 기반
    path('users', get_user_list),
    path('users/<str:pk>', get_user), # user_email을 pk로 받음
    path('users/profile/<str:pk>/<str:url>', user_profile), # user_email을 pk로 받고 profile_pic url을 url로 받음

    # post 컬렉션 기반
    path('posts', get_post_list),
    path('posts/<str:pk>', get_post), # post_title을 pk로 받음

    # 좋아요, 싫어요 개수 추가. 아무 데이터도 입력할 필요 없이 POST요청만 보내면 됨
    path('posts/<str:pk>/like', add_like),
    path('posts/<str:pk>/dislike', add_dislike),
]