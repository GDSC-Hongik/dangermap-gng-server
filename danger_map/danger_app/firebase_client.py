import firebase_admin
from firebase_admin import firestore, auth
from django.utils import timezone
from datetime import timedelta

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
            return None
        return (doc.to_dict() for doc in docs)


    # user의 email을 통해 특정 유저의 문서를 리턴
    def get_user(self, email):
        docs = self._user_collection.where("email", "==", email).get()
        if not docs:
            return None   

        user_docs = [doc.to_dict() for doc in docs]
        return user_docs
    

    # 특정 유저가 작성한 게시글 리턴
    def get_all_user_posts(self, email):
        docs = self._user_collection.where("email", "==", email).get()

        user_posts = []
        for doc in docs:
            doc_ref = doc.reference
            posts = doc_ref.collection("post").get()
            for post in posts:
                post_data = post.to_dict()
                post_data["display_date"] = (post_data["date"] + timedelta(hours=9)).strftime("%Y-%m-%d %H:%M")
                post_data["like"] = self.count_like(doc)
                post_data["dislike"] = self.count_dislike(doc)
                user_posts.append(post_data)

        if not user_posts:
            return None

        return user_posts
    

    # post컬렉션의 모든 문서를 리턴
    def get_all_posts(self):
        docs = self._post_collection.stream()

        posts = []
        for doc in docs:
            post_data = doc.to_dict()
            post_data["display_date"] = (post_data["date"] + timedelta(hours=9)).strftime("%Y-%m-%d %H:%M")
            post_data["like"] = self.count_like(doc)
            post_data["dislike"] = self.count_dislike(doc)
            posts.append(post_data)

        if not posts:
            return None

        return posts
    

    # post컬렉션에 새로운 문서 추가
    def create_post(self, data):
        # 마커 추가
        marker_data = {
            "lat": data["lat"],
            "lng": data["lng"]
        }
        new_marker = self._marker_collection.add(marker_data)

        data["date"] = timezone.now()
        data["marker_id"] = new_marker[1].id
        new_post = self._post_collection.document((timezone.now()+timedelta(hours=9)).isoformat()).set(data)
        
        # 유저 내 post컬렉션에 추가
        docs = self._user_collection.where("email", "==", data["user_email"]).get()
        for doc in docs:
            doc_ref = doc.reference
            doc_ref.collection("post").add(data)


    def delete_post(self, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            return None
        
        doc = docs[0]
        doc_ref = doc.reference

        # comment 삭제
        comments = doc_ref.collection("comment").stream()
        for comment in comments:
            comment_ref = comment.reference
            comment_ref.delete()

        # like 삭제
        likes = doc_ref.collection("like").stream()
        for like in likes:
            like_ref = like.reference
            like_ref.delete()

        # marker 삭제
        marker_id = doc.get("marker_id")
        self._marker_collection.document(marker_id).delete()

        # post 삭제
        doc_ref.delete()


    def get_post_by_dangertype(self, danger_type):
        docs = self._post_collection.where("danger_type", "==", danger_type).stream()
        if not docs:
            return None
        
        return [
            {
                **doc.to_dict(), 
                "like":self.count_like(doc), 
                "dislike":self.count_dislike(doc)
            } for doc in docs]
    
    
    # def get_post_dates_by_email(self, user_email):
    #     docs = self._post_collection.where("user_email", "==", user_email).stream()
    #     if not docs:
    #         return []
        
    #     post_dates = []
    #     for doc in docs:
    #         post_data = doc.to_dict()
    #         if 'date' in post_data:
    #             post_dates.append(post_data['date'])
        
    #     return {'date': post_dates}
    
    def get_post_by_date(self, date):
        docs = self._post_collection.where("date", "==", date).limit(1).get()
        if not docs:
            return None
        
        return [docs[0].to_dict()]


    def get_post_by_email(self, user_email):
        docs = self._post_collection.where("user_email", "==", user_email).stream()
        if not docs:
            return None
        
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


    # 유저 프로필 처리  
    def delete_user(self, user_email):
        # 해당 유저가 작성한 모든 게시글 삭제
        posts = self._post_collection.where("user_email", "==", user_email).get()

        if not posts:
            return None
        
        for post in posts:
            marker_id = post.get("marker_id")
            self._marker_collection.document(marker_id).delete()

            comments = self._post_collection.document(post.id).collection("comment").get()
            for comment in comments:
                comment.reference.delete()

            likes = self._post_collection.document(post.id).collection("like").get()
            for like in likes:
                like.reference.delete()

            self._post_collection.document(post.id).delete()

        # 유저 정보 삭제
        docs = self._user_collection.where("email", "==", user_email).limit(1).get()
        
        if not docs:
            return None
        
        for doc in docs:
            doc_id = doc.id

        if doc_id:
            posts = doc.reference.collection("post").get()
            for post in posts:
                post.reference.delete()
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
            return None
        
        doc_reference = docs[0].reference
        user_email = data["user_email"]
        like = doc_reference.collection("like").where("user_email", "==", user_email).stream()
        like_list=list(like)
        if like_list:
            doc_reference.collection("like").document(like_list[0].id).delete()
        else:
            doc_reference.collection("like").document(user_email).set(data)
    

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
        data["date"] = timezone.now()
        doc_reference.collection("comment").add(data)


    def get_comment(self, postdate, commentdate):
        docs = self._post_collection.where("date", "==", postdate).limit(1).get()
        if not docs:
            # 해당하는 문서가 없을 경우 처리
            return []
        
        doc_reference = docs[0].reference
        comment_docs = doc_reference.collection("comment").where("date", "==", commentdate).limit(1).get()
        if not comment_docs:
            return []
        
        return [comment_docs[0].to_dict()]