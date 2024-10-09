import pickle
from datetime import datetime


class ModelUpdater:
    def __init__(self, userMail, modelName, db, model, status):
        self.userMail = userMail
        self.modelName = modelName
        self.db = db
        self.model = model
        self.status = status

    def load(self):
        data = self.db.keras_model_db.find_one({'userMail': self.userMail,
                                                'modelName': self.modelName})
        modelBinary = data['model']
        pickledModel = modelBinary
        unpickledModel = pickle.loads(pickledModel)
        jsonModel = unpickledModel.to_json()
        # jsonModel = json.dumps(unpickledModel)
        return jsonModel

    def save(self):
        # pickling the model (pickle converts objects to bytes)
        pickledModel = pickle.dumps(self.model)
        # first check if the processing is already present in the db
        modelInformation = self.db.keras_model_db.find_one({"userMail": self.userMail,
                                                            "modelName": self.modelName})
        if modelInformation is None:
            data = self.db.keras_model_db.insert_one({
                "userMail": self.userMail,
                "modelName": self.modelName,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now(),
                "status": self.status,
                "model": pickledModel
            })
            return print(data.inserted_id, 'saved with this id!')
        else:
            criteria = {
                'userMail': self.userMail,
                'modelName': self.modelName
            }
            newVals = {
                "$set": {
                    "updatedAt": datetime.now(),
                    "status": self.status,
                    "model": pickledModel
                }
            }
            self.db.keras_model_db.update_one(criteria, newVals)
            return print("element from user " + self.userMail + " updated!")

    def delete(self):
        self.db.keras_model_db.delete_one({"modelName": self.modelName})
        self.db.output_db.delete_one({"modelName": self.modelName})
        return "model and its related output were deleted"