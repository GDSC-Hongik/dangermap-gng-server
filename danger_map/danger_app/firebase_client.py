import firebase_admin
from firebase_admin import firestore, auth
from django.utils import timezone
from datetime import datetime
# import pytz

# korea_timezone = pytz.timezone('Asia/Seoul')

class FirebaseClient:

    def __init__(self):
        self._db = firestore.client()
        self._user_collection = self._db.collection("user")
        self._post_collection = self._db.collection("post")
        self._marker_collection = self._db.collection("marker")

    # post컬렉션 문서의 하위 컬렉션 like에 속한 문서의 개수를 리턴
    # = 해당 post의 좋아요 개수
    def count_like(self, doc):
        doc_ref = doc.reference
        like_docs = doc_ref.collection("like").stream()
        count = sum(1 for _ in like_docs)
        return count
    
    # post컬렉션 문서의 하위 컬렉션 dislike에 속한 문서의 개수를 리턴
    # = 해당 post의 싫어요 개수
    def count_dislike(self, doc):
        doc_ref = doc.reference
        dislike_docs = doc_ref.collection("dislike").stream()
        count = sum(1 for _ in dislike_docs)
        return count

    # user컬렉션의 모든 문서를 리턴
    def get_all_users(self):
        docs = self._user_collection.stream()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        return (doc.to_dict() for doc in docs)

    # user의 email을 통해 특정 유저의 문서를 리턴
    def get_user(self, email):
        doc = self._user_collection.where("email", "==", email).get()
        if not doc:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        return doc
    
    # post컬렉션의 모든 문서를 리턴
    def get_all_posts(self):
        docs = self._post_collection.stream()

        posts = []
        for doc in docs:
            post_data = doc.to_dict()
            post_data["display_date"] = post_data["date"].strftime("%Y-%m-%d %H:%M")
            post_data["like"] = self.count_like(doc)
            post_data["dislike"] = self.count_dislike(doc)
            posts.append(post_data)

        if not posts:
            return None

        return posts
    
    # post컬렉션에 새로운 문서 추가
    def create_post(self, data):
        new_doc_ref = self._post_collection.add(data)
        # date필드에 데이터 생성 시각을 대입
        doc_id = new_doc_ref[1].id
        update_data = {'date': timezone.now()}
        self._post_collection.document(doc_id).update(update_data)


    def get_post(self, danger_type):
        docs = self._post_collection.where("danger_type", "==", danger_type).stream()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        return [
            {
                **doc.to_dict(), 
                "like":self.count_like(doc), 
                "dislike":self.count_dislike(doc)
            } for doc in docs]
    
    
    def get_post_dates_by_email(self, user_email):
        docs = self._post_collection.where("user_email", "==", user_email).stream()
        if not docs:
            return []
        
        post_dates = []
        for doc in docs:
            post_data = doc.to_dict()
            if 'date' in post_data:
                post_dates.append(post_data['date'])
        
        return {'date': post_dates}
    

    def get_post_by_email(self, user_email):
        docs = self._post_collection.where("user_email", "==", user_email).stream()
        if not docs:
            return []
        
        return [
            {
                **doc.to_dict(), 
                "like":self.count_like(doc), 
                "dislike":self.count_dislike(doc)
            } for doc in docs]
    

    def get_post_by_coord(self, lat, lng):
        docs = self._post_collection.where("lat", "==", lat).where("lng", "==", lng).stream()
        
        if not docs:
            return None
        
        return [doc.to_dict() for doc in docs]
    

    def get_all_markers(self):
        markers = self._marker_collection.stream()

        return [marker.to_dict() for marker in markers]
    

    def create_marker(self, data): # 게시글을 생성 한 후 마커를 생성해야 함
        new_marker = self._marker_collection.add(data)
        marker_ref = {'marker_id': new_marker[1].id}
        docs = self._post_collection.where("lat", "==", data["lat"]).where("lng", "==", data["lng"]).stream()

        for doc in docs:
            doc_ref = doc.reference
            doc_ref.collection("marker").add(marker_ref)


    # 유저 프로필 처리
    def get_profile_pic(self, user_email):
        docs = self._user_collection.where("email", "==", user_email).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return None
        
        doc_id = None
        for doc in docs:
            return doc.get("profile_pic")


    def patch_profile_pic(self, user_email, pic_url):
        docs = self._user_collection.where("email", "==", user_email).limit(1).get()

        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return None
        
        doc_id = None
        for doc in docs:
            doc_id = doc.id

            new_doc_ref = self._user_collection.add({
                'email': doc.get('email'),
                'nickname': doc.get('nickname'),
                'profile_pic': pic_url
            })
        new_doc_id = new_doc_ref.id
        
        if doc_id:
            self._user_collection.document(doc_id).delete()


    def update_user_profile_pic(uid, new_pic):
        try:
            # 사용자 정보 가져오기
            user = auth.get_user(uid)
            
            # 새 이메일로 사용자 업데이트
            updated_user = auth.update_user(
                user.uid,
                profile_pic=new_pic
            )
            
            print('User email updated successfully:', updated_user.email)
        except auth.AuthError as e:
            print('Error updating user email:', e)

        
    def delete_user_profile(self, user_email):
        docs = self._user_collection.where("email", "==", user_email).limit(1).get()

        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return None
        
        doc_id = None
        for doc in docs:
            doc_id = doc.id

        if doc_id:
            self._user_collection.document(doc_id).delete()


# 좋아요, 싫어요 기능
    def get_all_likes(self, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        doc_reference = docs[0].reference
        like_docs = doc_reference.collection("like").stream()
        return [doc.to_dict() for doc in like_docs]


    def get_all_dislikes(self, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        doc_reference = docs[0].reference
        dislike_docs = doc_reference.collection("dislike").stream()
        return [doc.to_dict() for doc in dislike_docs]
    

    def add_like(self, data, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        doc_reference = docs[0].reference
        doc_reference.collection("like").add(data)
    

    def add_dislike(self, data, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []

        doc_reference = docs[0].reference
        doc_reference.collection("dislike").add(data)


# 댓글 기능
    def get_all_comments(self, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        doc_reference = docs[0].reference
        comment_docs = doc_reference.collection("comment").stream()
        return [doc.to_dict() for doc in comment_docs]
    

    def add_comment(self, data, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []

        doc_reference = docs[0].reference
        new_doc_ref = doc_reference.collection("comment").add(data)
        doc_id = new_doc_ref[1].id
        update_data = {'date': timezone.now()}
        doc_reference.collection("comment").document(doc_id).update(update_data)