import json

import requests


class OutputHandler:
    def __init__(self, userMail, modelName, db):
        self.userMail = userMail
        self.modelName = modelName
        self.db = db

    # TODO: CHECK IF WE EVEN NEED THIS!=?!?!? IS PROCESSED VIA FRONTEND ALREADY DUE TO GRAPH CREATION
    def processServer(self):
        data = self.getData()
        processingOutput = data['processing']
        loss = data['processing']['loss']
        iterations = []
        counter = 0
        for i in loss:
            counter += 1
            iterations.append(counter)
        metricsData = {
            "iterations": iterations,
            "metrics": processingOutput
        }
        jsonData = json.dumps(metricsData)
        # TODO: check if we even need this
        processor = OutputHandler(self.userMail, self.modelName, self.db)
        processor.messageReportCreator(jsonData)
        return "success"

    def processClient(self):
        data = self.getData()
        loss = data['processing']['loss']
        processingOutput = data['processing']
        iterations = []
        counter = 0
        # TODO: maybe this should be more efficient
        for i in loss:
            counter += 1
            iterations.append(counter)
        metricsData = {
            "iterations": iterations,
            "metrics": processingOutput
        }
        for k, v in data['processing'].items():
            metricsData["metrics"][k] = v
        jsonData = json.dumps(metricsData)
        return jsonData

    def getData(self):
        data = self.db.output_db.find_one({
            'userMail': self.userMail,
            'modelName': self.modelName
        })
        return data

    def messageReportCreator(self, outputData):
        data = {
            "userMail": self.userMail,
            "modelName": self.modelName,
            "outputData": outputData
        }
        req = requests.post('http://localhost:5004/report/visualisationcomplete', json=data)
        res = req.json()
        return print(res)