import firebase_admin
from firebase_admin import storage

class StorageBucket:

    def __init__(self):
        self._bucket = storage.bucket()
        

    # 파일 삭제
    def delete_file(self, remote_file_name):
        blob = self._bucket.blob(remote_file_name)
        blob.delete()


    # 파일 URL 가져오기
    def get_file_url(self, remote_file_name):
        blob = self._bucket.blob(remote_file_name)
        return blob.public_url