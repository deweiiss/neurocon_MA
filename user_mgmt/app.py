import logging

logging.basicConfig(level=logging.DEBUG)

logging.debug("Starting imports...")

import bcrypt

logging.debug("Imported bcrypt")

from flask import Flask, request, session, make_response, jsonify

logging.debug("Imported Flask and related modules")

from flask_cors import CORS, cross_origin

logging.debug("Imported CORS")

# from user_mgmt.user import UserDBHandler
from user.user_handler import UserDBHandler

logging.debug("Imported UserDBHandler")

from util.session import Session
from util.db import MongoConnector

logging.debug("Imported Session and MongoConnector")

app = Flask(__name__)
# generate session key
app.config['SESSION_TYPE'] = 'memcached'
s = Session()
app.config['SECRET_KEY'] = s.generateToken()
# app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}

corsConfig = {
    "origins": ["http://localhost:3000"]
}
CORS(app, resources={"/*": corsConfig})

mongo = MongoConnector(app)
db = mongo.connect()


@app.route("/user/signup", methods=['POST'])
@cross_origin()
def userRegistration():
    message = request.get_json()
    userFullName, userMail, userPassword, userPasswordConfirm, userRole = message['userFullName'], \
        message['userMail'], \
        message['password'], \
        message['passwordConfirm'], \
        message['userRole']
    return createUserHelper(userPassword, userPasswordConfirm, userFullName, userMail, userRole)


@app.route("/user/signupadmin", methods=['POST'])
@cross_origin()
def adminRegistration():
    message = request.get_json()
    # adminId should be the normal user id
    userFullName, userMail, userPassword, userPasswordConfirm, userRole, adminId = message['userFullName'], \
        message['userMail'], \
        message['password'], \
        message['passwordConfirm'], \
        message['userRole'], \
        message['adminId']
    # initialize userDb
    #  checking if adminId is present, if no, check if there is already an admin user in the DB, if not continue,
    #  if yes, deny access.
    #  If admin id present then continue
    if adminId is None:
        userDB = UserDBHandler(None, None, None, userRole, db)
        # search for admin user
        adminPresent = userDB.findAdmins()
        if adminPresent is True:
            # check for admin id of requesting user in db
            adminDB = UserDBHandler(None, adminId, None, userRole, db)
            adminUser = adminDB.find()
            if adminUser is False:
                return make_response("You do not have the rights to perform this action!", 403)
            elif adminUser['userRole'] == "ADMIN":
                return createUserHelper(userPassword, userPasswordConfirm, userFullName, userMail, userRole)
        if adminPresent is False:
            return createUserHelper(userPassword, userPasswordConfirm, userFullName, userMail, userRole)
    if adminId is not None:
        return createUserHelper(userPassword, userPasswordConfirm, userFullName, userMail, userRole)


@app.route("/user/login", methods=['POST'])
@cross_origin()
def userLogin():
    message = request.get_json()
    userMail, userPassword = message['userMail'], message['password']
    # passing an empty password by default and then comparing with db
    userDB = UserDBHandler(None, userMail, userPassword, None, db)
    user = userDB.find()
    if user:
        if bcrypt.hashpw(userPassword.encode('utf-8'), user['userPassword']) == user['userPassword']:
            session['userMail'] = userMail
            session['token'] = app.config['SECRET_KEY']
            return make_response(jsonify(
                {
                    "token": app.config['SECRET_KEY'],
                    "role": user["role"],
                    "code": 200,
                    "message": "logged_in"
                }
            ))
    return make_response("No existing user found!", 501)


@app.route("/user/delete", methods=['POST'])
@cross_origin()
def deleteUser():
    message = request.get_json()
    userRole = message['userRole']
    if userRole == 'ADMIN':
        userMail = message['userMail']
        userDb = UserDBHandler(None, userMail, None, None, db)
        userDb.delete()
        return make_response("User was deleted", 200)
    else:
        return make_response("You are not authorised to complete this action", 403)


@app.route("/user/deleteall", methods=['POST'])
@cross_origin()
def deleteAllUsers():
    message = request.get_json()
    userRole = message['userRole']
    if userRole == 'ADMIN':
        userDb = UserDBHandler(None, None, None, userRole, db)
        userDb.deleteAll()
        return make_response("users were deleted", 200)
    else:
        return make_response("You are not authorised to complete this action", 403)


def createUserHelper(userPassword, userPasswordConfirm, userFullName, userMail, userRole):
    if userPassword != userPasswordConfirm:
        return make_response("Passwords are not identical", 501)
    userDB = UserDBHandler(userFullName, userMail, userPassword, None, db)
    userExists = userDB.find()
    if not userExists:
        hashPw = bcrypt.hashpw(userPassword.encode('utf-8'), bcrypt.gensalt())
        newUser = UserDBHandler(userFullName, userMail, hashPw, userRole, db)
        newUser.create()
        session['userMail'] = userMail
        session['token'] = app.config['SECRET_KEY']
        return make_response(jsonify(
            {
                "token": app.config['SECRET_KEY'],
                "code": 200,
                "message": "user created"
            }
        ))
    return make_response("User already exists", 501)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
