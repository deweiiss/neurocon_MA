import pickle
from datetime import datetime


class TrainingDBHandler:
    def __init__(self, samples, labels, userMail, modelName, db, ):
        self.samples = samples
        self.labels = labels
        self.userMail = userMail
        self.modelName = modelName
        self.db = db

    def save(self):
        # pickling the model (pickle converts objects to bytes)
        pickledSamples = pickle.dumps(self.samples)
        pickledLabels = pickle.dumps(self.labels)
        data = self.db.training_data_db.insert_one({
            "userMail": self.userMail,
            "modelName": self.modelName,
            "createdAt": datetime.now(),
            "trainingLabels": pickledLabels,
            "trainingSamples": pickledSamples
        })
        print(data.inserted_id, 'saved with this id!')
        return "success"