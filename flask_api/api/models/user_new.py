from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField
import datetime

class User(Document):
    public_id = StringField(max_length=100)
    username = StringField(max_length=60)
    password_hash = StringField(max_length=100)
    created = DateTimeField(default=datetime.utcnow)
