from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

from .util import MongoConnector
from .handler import OutputHandler

app = Flask(__name__)

corsConfig = {
    "origins": ["http://localhost:3000"]
}
CORS(app, resources={"/output/*": corsConfig})

mongo = MongoConnector(app)
db = mongo.connect()


@app.route("/output/get", methods=['GET'])
@cross_origin()
def GetParams():
    params = request.args
    print(params)

    # FIXME: wrong naming conditions
    userMail = params.get('id')
    modelName = params.get('name')
    data = {
        'userMail': userMail,
        'modelName': modelName
    }
    return data


@app.route("/output/trainingcomplete", methods=['POST'])
@cross_origin()
def trainingCompleteMessage():
    message = request.get_json()
    userMail, modelName = message['userMail'], message['modelName']
    # print("The processing for user: " + userMail + " was saved!")
    output = OutputHandler(userMail, modelName, db)
    output.processServer()
    return "success"


@app.route("/output/graphs", methods=['GET'])
@cross_origin()
def getTrainingOutput():
    # message = request.get_json()
    message = request.args.to_dict()
    print(message)
    userMail, modelName = message['userMail'], message['modelName']
    output = OutputHandler(userMail, modelName, db)
    jsonData = output.processClient()
    return jsonData

@app.route("/health", methods=['GET'])
@cross_origin()
def health_check():
    return make_response("Service is running", 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)