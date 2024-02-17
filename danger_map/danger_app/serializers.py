from rest_framework import serializers

# 해당 프로젝트엔 파이썬 객체 모델이 따로 존재하지 않지만
# 유효성 검사를 위한 시리얼라이저를 추가

# 시리얼라이저는 딕셔너리를 반환

class UserSerializer(serializers.Serializer):
    email = serializers.CharField()
    nickname = serializers.CharField()
    profile_pic = serializers.URLField()


# storage연동 후 content_pic URLField로 바꿔야 함
# user_email에 관한 유효성 검사 추가?
class PostSerializer(serializers.Serializer):
    content = serializers.CharField()
    content_pics = serializers.ListField(child=serializers.CharField(), min_length=1, max_length=3, allow_empty=True)
    danger_rate = serializers.IntegerField(max_value=100, min_value=0)
    danger_type = serializers.CharField()
    date = serializers.DateTimeField()
    user_nickname = serializers.CharField()
    user_email = serializers.CharField()
    # 위치 정보
    location = serializers.CharField()
    lat = serializers.FloatField()
    lng = serializers.FloatField()


# like, dislike 문서 추가를 위한 시리얼라이저
class LikeAndDislikeSerializer(serializers.Serializer):
    user_email = serializers.CharField()


# comment 시리얼라이저
class CommentSerializer(serializers.Serializer):
    user_email = serializers.CharField()
    comment = serializers.CharField()
    date = serializers.DateTimeField()