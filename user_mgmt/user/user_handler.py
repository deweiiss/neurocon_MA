class UserDBHandler:
    def __init__(self, userFullName, userMail, userPassword, userRole, db):
        self.userFullName = userFullName
        self.userMail = userMail
        self.userPassword = userPassword
        self.userRole = userRole
        self.db = db

    def find(self):
        user = self.db.user_db.find_one({"userMail": self.userMail})
        print(user)
        if user:
            return user
        elif not user:
            return False

    def findAdmins(self):
        admins = self.db.user_db.find({"userRole": "ADMIN"})
        if admins:
            return True
        elif not admins:
            return False

    def create(self):
        user = self.db.user_db.insert_one({
            "userFullName": self.userFullName,
            "userMail": self.userMail,
            "userPassword": self.userPassword,
            "role": self.userRole
        })
        return print("User with ID: ", user.inserted_id, " was created!")

    def update(self):
        return

    def delete(self):
        self.db.user_db.delete_one({
            "userMail": self.userMail
        })
        self.db.training_data_db.delete_many({
            "userMail": self.userMail
        })
        self.db.keras_model_db.delete_many({
            "userMail": self.userMail
        })
        return print("User with mail " + self.userMail + " was deleted, including their models and training data!")

    def deleteAll(self):
        if self.userRole == 'ADMIN':
            self.db.user_db.delete_many({})
            self.db.training_data_db.delete_many({})
            self.db.keras_model_db.delete_many({})
            return print("All users and their data where removed from the database!")
        else:
            return print("You are not autorised!")
