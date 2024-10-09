from datetime import datetime


class NetworkOutputHandler:
    def __init__(self, history, userMail, modelName, db):
        self.history = history
        self.userMail = userMail
        self.modelName = modelName
        self.db = db

    def save(self):
        # self.db.output_db.delete_many({})
        modelInformation = self.db.output_db.find_one({
            "userMail": self.userMail,
            "modelName": self.modelName
        })
        if modelInformation is None:
            data = self.db.output_db.insert_one({
                "userMail": self.userMail,
                "modelName": self.modelName,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now(),
                "processing": self.history
            })
            return print(data.inserted_id, 'saved with this id!')
        else:
            criteria = {
                "userMail": self.userMail,
                "modelName": self.modelName
            }
            newVals = {
                "$set": {
                    "updatedAt": datetime.now(),
                    "processing": self.history
                }
            }
            self.db.output_db.update_one(criteria, newVals)
            return print("output processing from user " + self.userMail + " updated!")