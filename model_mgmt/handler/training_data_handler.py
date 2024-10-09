import pickle


class TrainingDataHandler:
    def __init__(self, userMail, modelName, db):
        self.userMail = userMail
        self.modelName = modelName
        self.db = db

    def loadSamplesAndLabels(self):
        trainingData = self.db.training_data_db.find_one({
            "userMail": self.userMail,
            "modelName": self.modelName
        })
        labels = pickle.loads(trainingData["trainingLabels"])
        samples = pickle.loads(trainingData["trainingSamples"])
        return labels, samples