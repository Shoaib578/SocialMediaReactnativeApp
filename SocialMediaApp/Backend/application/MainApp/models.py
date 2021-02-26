from application import db
from marshmallow_sqlalchemy import ModelSchema
class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100),nullable=False)
    email = db.Column(db.String(100),nullable=False)
    password = db.Column(db.String(300),nullable=False)
    profile_pic = db.Column(db.String(200),nullable=False)
class UsersSchema(ModelSchema):
    class Meta:
        fields = ('user_id','user_name','email','password','profile_pic','notification_for','actioned_by','notifications_count','notification_msg')


class Messages(db.Model):
    message_id = db.Column(db.Integer,primary_key=True)
    msg_text = db.Column(db.String(400))
    wrote_by = db.Column(db.Integer,db.ForeignKey('users.user_id'))
    msg_for = db.Column(db.Integer,db.ForeignKey('users.user_id'))
    posted_date = db.Column(db.Text(100),nullable=False)
class MessagesSchema(ModelSchema):
    class Meta:
        fields = ('message_id','msg_text','wrote_by','msg_for','user_name','profile_pic','user_id','posted_date')


class Notifications(db.Model):
    notfication_id = db.Column(db.Integer, primary_key=True)
    notification_for = db.Column(db.Integer,db.ForeignKey('users.user_id'))
    actioned_by = db.Column(db.Integer,db.ForeignKey('users.user_id'))
    notification_msg = db.Column(db.String(400))
class NotificationsSchema(ModelSchema):
    class Meta:
        fields = ('notfication_id','notification_for','actioned_by','user_id')