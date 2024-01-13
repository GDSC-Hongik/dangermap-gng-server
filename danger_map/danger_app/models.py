from django.db import models

class User(models.Model):
    pass


class Comment(models.Model):
    pass


class Post(models.Model):
    head = models.CharField(max_length=20)
    
    content = models.TextField(blank=True)

    content_pic = models.ImageField(upload_to='post_pics', blank=True)

    DEGREE_CHOICES = [
        (1, '10%'),
        (2, '20%'),
        (3, '30%'),
        (4, '40%'),
        (5, '50%'),
        (6, '60%'),
        (7, '70%'),
        (8, '80%'),
        (9, '90%'),
        (10, '100%'),
    ]
    degree = models.IntegerField(choices=DEGREE_CHOICES, default=None)
    
    hash = models.CharField(max_length=10, blank=True)

    dt_created = models.DateTimeField(auto_now_add=True)

    dt_updated = models.DateTimeField(auto_now=True)


class Like(models.Model):
    pass


class Dislike(models.Model):
    pass