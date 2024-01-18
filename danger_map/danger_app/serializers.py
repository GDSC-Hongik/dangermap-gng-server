from rest_framework import serializers

# 해당 프로젝트엔 파이썬 객체 모델이 따로 존재하지 않지만
# 유효성 검사를 위한 시리얼라이저를 추가

# 시리얼라이저는 딕셔너리를 반환

class UserSerializer(serializers.Serializer):
    email = serializers.CharField()
    nickname = serializers.CharField()
    profile_pic = serializers.URLField()


# storage등록 후 content_pic URLField로 바꿔야 함
class PostSerializer(serializers.Serializer):
    content = serializers.CharField()
    content_pic = serializers.CharField()
    danger_rate = serializers.IntegerField(max_value=100, min_value=0)
    title = serializers.CharField()
    date = serializers.DateTimeField()
    user_nickname = serializers.CharField()
    user_email = serializers.CharField()


# like, dislike 문서 추가를 위한 임시 시리얼라이저
class LikeAndDislikeSerializer(serializers.Serializer):
    user_email = serializers.CharField()