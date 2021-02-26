from flask import Blueprint,jsonify,request
from application.MainApp.models import Users,UsersSchema,Messages,MessagesSchema,Notifications,NotificationsSchema
from application import db,app
from application import bcrypt
from werkzeug.utils import secure_filename
import os
from sqlalchemy import text
from datetime import datetime
main = Blueprint('main', __name__)





def save_file(file, type):
    file_name = secure_filename(file.filename)
    file_ext = file_name.split(".")[1]
    folder = os.path.join(app.root_path, "static/" + type + "/")
    file_path = os.path.join(folder, file_name)
    try:
        file.save(file_path)
        return True, file_name
    except:
        return False, file_name

def remove_file(file, type):
    file_name = file
    folder = os.path.join(app.root_path, "static/" + type + "/"+file_name)
    os.remove(folder)
    return 'File Has Been Removed'




@main.route('/register_user',methods=['POST'])
def RegisterUser():
    username = request.form.get('username')
    email = request.form.get('email')
    profile_pic = request.files.get('profile_pic')
    
    password = request.form.get('password')
    hash_password = bcrypt.generate_password_hash(password)
    check_user_email_exist = Users.query.filter_by(email=email).first()
    check_user_username_exist = Users.query.filter_by(user_name=username).first()
    if check_user_email_exist:
        return 'Email Already Exist.Try Another One'
    elif check_user_username_exist:
        return 'Username Already Exist.Try Another One'
    else:
        user = Users(user_name=username, email=email,password=hash_password,profile_pic=profile_pic.filename)
        db.session.add(user)
        db.session.commit()
        save_file(profile_pic,'profile_pic')
        return 'You are Registered Successfully'






@main.route('/login_user',methods=['POST'])
def LoginUser():
    username = request.form.get('username')
    password = request.form.get('password')
    print(password,' ',username)
    user = Users.query.filter_by(user_name=username).first()
    if user and bcrypt.check_password_hash(user.password,password):
        users_Schema = UsersSchema()
        user_info = users_Schema.dump(user)
        return jsonify({'msg':'Logged In','user_info':user_info})
    else:
        return jsonify({'msg':'Coudnt Found User'})






@main.route('/edit_account',methods=['POST'])
def EditAccount():
    user_id = request.form.get('user_id')
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')
    profile_pic = request.files.get('profile_pic')
    old_profile_pic = request.form.get('old_profile_pic')
    
    user = Users.query.filter_by(user_id=user_id).first()

    check_exist_username = Users.query.filter_by(user_name=username).first()
    check_exist_email = Users.query.filter_by(email=email).first()

    if email:
        if not check_exist_email:
            user.email = email
        else:
            return 'Email Already Exist.Try Another One'
    else:
        pass
    

    if username:
        if not check_exist_username:
            user.user_name = username
        else:
            return 'Username Already Exist.Try Another One'
    else:
        pass
    


    if password:
        hash_password = bcrypt.generate_password_hash(password)
        user.password = hash_password
    else:
        pass
    

    if profile_pic:
        remove_file(old_profile_pic,'profile_pic')
        save_file(profile_pic,'profile_pic')
        user.profile_pic = profile_pic.filename

    
    db.session.commit()
    users_Schema = UsersSchema()
    user_info = users_Schema.dump(user)
    return jsonify({'msg':'Your Account Has Been Updated Succesfully','user_info':user_info})

    

@main.route('/all_users',methods=['GET'])
def AllUsers():
    my_id = request.args.get('my_id')
    want_to_search_user = request.args.get('want_to_search_user')

    if want_to_search_user == 'false':
        get_all_users_sql = text("SELECT * ,(select count(*) from notifications where notifications.notification_for ="+str(my_id)+" and notifications.actioned_by=users.user_id )  as notifications_count FROM users  WHERE user_id !="+str(my_id))
        get_all_users_query = db.engine.execute(get_all_users_sql)
     

        
        users_Schema = UsersSchema(many=True)
        users = users_Schema.dump(get_all_users_query)
        return jsonify({'users':users})
    elif want_to_search_user == 'true':
        user_name= request.args.get('user_name')
        get_search_user_sql = text("SELECT *,(select count(*) from notifications where notifications.notification_for ="+str(my_id)+" and notifications.actioned_by=users.user_id ) as notifications_count FROM users WHERE user_name LIKE '%"+str(user_name)+"%' AND user_id !="+str(my_id))
        get_search_user_query = db.engine.execute(get_search_user_sql)
        users_Schema = UsersSchema(many=True)
        users = users_Schema.dump(get_search_user_query)
        if get_search_user_query.rowcount>0:
            return jsonify({'users':users})
        else:
            return "Could'nt Found User"
       


@main.route('/remove_notifications')
def RemoveNotifications():
    my_id = request.args.get('my_id')
    user_id = request.args.get('user_id')

    delete_notificaions_sql = text("DELETE FROM notifications WHERE notification_for ="+str(my_id)+" AND actioned_by="+str(user_id)+"") 
    delete_notificaions_query = db.engine.execute(delete_notificaions_sql)
    db.session.commit()
    return 'DELETED Notifications'
   

@main.route('/insert_msg',methods=['POST'])
def InsertMessage():
    wrote_by = request.form.get('wrote_by')
    msg_for = request.form.get('msg_for')
    text_msg = request.form.get('text_msg')
    today_datetime = datetime.now()

    full_date_and_time = today_datetime.strftime('%c')
    msg = Messages(msg_text=text_msg,wrote_by=wrote_by,msg_for=msg_for,posted_date=full_date_and_time)
    db.session.add(msg)
    db.session.commit()
    return 'Sent'


@main.route('/get_msg')
def get_msg():
    my_id = request.args.get('my_id')
    user_id = request.args.get('user_id')
    get_msg_sql = text("SELECT * FROM messages LEFT JOIN users on user_id=messages.msg_for WHERE  msg_for="+str(user_id)+" OR wrote_by="+str(user_id))
    get_msg_query = db.engine.execute(get_msg_sql)
    msgSchema = MessagesSchema(many=True)
    msgs = msgSchema.dump(get_msg_query)

    select_user_info_on_msg_page_sql = text("SELECT * FROM users WHERE user_id="+str(user_id))
    select_user_info_on_msg_page_query = db.engine.execute(select_user_info_on_msg_page_sql)
    users_Schema = UsersSchema(many=True)
    user = users_Schema.dump(select_user_info_on_msg_page_query)
    return jsonify({'msgs': msgs,'user_info':user})


@main.route('/insert_notification',methods=['POST'])
def InsertNotification():
    actioned_by = request.form.get('actioned_by')
    notification_for = request.form.get('notification_for')
    notification_message = request.form.get('notification_msg')
    print(notification_message)
    notication = Notifications(actioned_by=actioned_by, notification_for=notification_for,notification_msg=notification_message)
    db.session.add(notication)
    db.session.commit()
    return 'Notifyed'