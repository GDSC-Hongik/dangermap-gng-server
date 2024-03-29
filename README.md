# 개발환경
### python
- python==3.7.13
### pip list
- django==3.2.23
- djangorestframework==3.13.1
- --upgrade firebase-admin

# 커밋
- 커밋은 파일 단위로
- 모든 파일 커밋 완료 시\
루트 파일 git add 한 다음 git commit -m "Edit 날짜"로 제출

# URL
- 모든 URL의 출처는 `http://127.0.0.1:8000/`임

|URL|HTTP Method|기능|비고|
|---|-----------|----|----|
|`users`|GET|모든 유저 리스트를 가져온다|
|`users/<user_email>`|GET, DELETE|해당 이메일을 가진 유저를 가져온다|user는 이메일이 pk로 쓰임|
|`users/<user_email>/posts`|GET|해당 유저가 작성한 게시글들을 가져온다|user는 이메일이 pk로 쓰임|
|`posts`|GET, POST|모든 게시물 리스트를 가져온다|
|`posts/<str:type>`|GET|위험 종류에 따른 게시물을 가져온다
|`posts/?date={date}`|GET, DELETE|DELETE요청 시 게시글 삭제|
|`posts/email/?user_email={user_email}`|GET|해당 이메일로 작성된 모든 게시글을 가져온다.
|`markers`|GET|모든 마커 정보를 가져온다|게시글을 등록할 때 자동으로 추가된다.|
|`posts/location/?latitude={latitude}&longitude={longitude}`|GET|위도, 경도값과 일치하는 게시물 리스트를 가져온다|
|`posts/like/?date={date}`|GET, POST|작성날짜를 기준으로 게시글을 가져와 좋아요를 누른 사람을 조회하고, 좋아요를 추가할 수 있다.
|`posts/dislike/?date={date}`|GET, POST|작성날짜를 기준으로 싫어요를 누른 사람을 조회하고, 싫어요를 추가할 수 있다.|비활성화
|`posts/comment/?date={date}`|GET, POST|작성날짜를 기준으로 댓글들을 조회하고, 댓글을 추가할 수 있다.|
|`posts/comment/get/?postdate={postdate}&commentdate={commentdate}`|GET|게시글 내 특정 댓글을 가져온다. 둘 다 date를 사용하여 구분한다.|


# 추가 및 수정해야 할 기능들
- firestore 보안 규칙 재설정

# 수정 사항
1. 24.01.13 : 기본 세팅 및 serializer 생성
2. 24.01.19 : firebase연동, 데이터 모델 생성, post와 user 간단한 GET, POST 기능 추가
3. 24.01.24 : django-allauth 관련 코드 삭제, cors에러 처리

# 데이터 모델
![alt text](image.png)
date, like, dislike필드는 자동으로 설정되나, date필드는 형식에 맞춰 입력은 해야 함.

# 초기 설정
```shell
pyenv install 3.7.13 # 파이썬 설치
pyenv virtualenv 3.7.13 danger-map # danger-map 이름의 가상환경 생성

# danger_map 프로젝트 루트 폴더로 이동한 후 가상환경 적용
pyenv local danger-map
pip install django==3.2.23 djangorestframework==3.13.1
pip install --upgrade firebase-admin
pip install django-cors-headers
pip install pytz    # 설치 보류
```
### 1. `adminsdk.json` 파일을 루트 디렉토리에 넣는다.(manage.py가 있는 디렉토리)
### 2. `python manage.py runserver` 를 통해 서버를 연 후, 필요에 따라 위의 url들을 이용한다.

# POST요청에 따른 JSON 포맷
모든 값은 하드코딩된 값이며, 실제론 프론트에서 값을 가져온다.
1. `posts`
    ```json
        // POST요청 시 포맷
        {
            "user_email": "ffff@gmail.com",
            "content": "ffff",
            "user_nickname": "ffff",
            "content_pics": [
                "fff/fff"
            ],
            "lat": 33.111,
            "danger_type": "ffff",
            "lng": -44.222,
            "danger_rate": "5"
        }

        { // 실제 저장되는 값
            "marker_id": "yFcwtBIwBlcM4izfQqBr",
            "user_email": "ffff@gmail.com",
            "date": "2024-02-18T21:13:10.543069Z",
            "content": "ffff",
            "user_nickname": "ffff",
            "content_pics": [
                "fff/fff"
            ],
            "lat": 33.111,
            "danger_type": "ffff",
            "lng": -44.222,
            "danger_rate": "5",
            "display_date": "2024-02-19 06:13",
            "like": 0,
            "dislike": 0
        }
    ```
- marker_id 필드 : 위도, 경도값을 추출해 marker컬렉션에 새로운 문서를 만든 후 아이디값을 저장한다.
- date 필드 : 데이터 등록 시점으로 채워진다.
- like, dislike 필드 : GET요청을 통해 정보를 가져올 때마다 각각의 컬렉션에 들어있는 문서 개수를 카운트 해서 업데이트 된다.
- danger_rate 필드 : integer필드로 큰따옴표 없이 0~100 사이의 숫자만 넣을 수 있도록 한다.
- display_date 필드 : 타임스탬프의 포맷값을 보기 편하게 변경한 값이 자동 생성된다.
- lat 필드 : -90 ~ 90 사이의 값
- lng 필드 : -180 ~ 180 사이의 값

2. `posts/like/?date={date}`
    ```json
        // POST요청 시 포맷, 실제 저장되는 값
        { 
            "user_email": "ff@gmail.com"
        }
    ```
3. `posts/comment/?date={date}`
    ```json
        // POST요청 시 포맷
        { 
            "user_email": "ff@gmail.com",
            "comment": "댓글"
        }

        { //실제 저장되는 값
            "user_email": "ff@gmail.com",
            "comment": "댓글",
            "date": "date"
        }
    ```