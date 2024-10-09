import asyncpg
from bson.json_util import dumps
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

from .util import MongoConnector
from .data import SQLQueryProcessor, DataProcessor, TrainingDBHandler
from .data.csv_data_processing import CSVProcessor

app = Flask(__name__)

corsConfig = {
    "origins": ["http://localhost:3000"]
}
CORS(app, resources={"/input/*": corsConfig})

# database management handles the mongo connection
mongo = MongoConnector(app)
db = mongo.connect()


@app.route("/input/all", methods=['GET'])
@cross_origin()
def getAll():
    with app.app_context():
        allInputs = dumps(db.input_data_db.find())
        return allInputs


@app.route("/input/parameters", methods=['GET'])
@cross_origin()
def getParams():
    with app.app_context():
        allInputs = dumps(db.input_data_db.find())
        print(allInputs)


@app.route("/input/querydb", methods=['POST'])
async def queryDB():
    message = request.get_json()
    # db.training_data_db.delete_many({})
    userMail, modelName, dbType, host, database, user, password, port, query = message['userMail'], \
                                                                               message['modelName'], \
                                                                               message['dbType'], message['host'], \
                                                                               message['database'], message['user'], \
                                                                               message['password'], message['port'], \
                                                                               message['query']
    if dbType == "postgres":
        print("POSTGRES")
        try:
            connection = await asyncpg.connect(
                host=host,
                user=user,
                password=password,
                database=database,
                port=port
            )
            res = await connection.fetch(query)
            sqlProcessor = SQLQueryProcessor(res)
            headers, dataSet = sqlProcessor.postgresProcessor()
            await connection.close()

            # TODO: datapreparator needs additional post request for the label column within the dataset
            # TODO: move all this to different function!!!!
            dataPreparator = DataProcessor(headers, dataSet, 4)
            trainingSamples, trainingLabels = dataPreparator.createSampleAndLabelTensors()
            trainingData = TrainingDBHandler(trainingSamples, trainingLabels, userMail, modelName, db)
            trainingData.save()
            return trainingSamples, trainingLabels
        except asyncpg.CannotConnectNowError as error:
            print(error)
    elif dbType == "mysql":
        print("MYSQL")
    elif dbType == "mariadb":
        print("MARIA")
    elif dbType == "oracle":
        print("ORACLE")
    return "could not connect to a database"


# TODO: we need the label column for data preparation!!!
@app.route("/input/csv", methods=['POST'])
def uploadCsv():
    message = request.get_json()
    print(message)
    modelName, rawData, labelColumn, userMail = message['modelName'], message['data'], message['labelColumn'], message[
        'userMail']
    if modelName and rawData:
        csvProcessor = CSVProcessor(rawData, None)
        headers, data = csvProcessor.processData()
        dataPreparator = DataProcessor(headers, data, labelColumn)
        trainingSamples, trainingLabels = dataPreparator.createSampleAndLabelTensors()
        trainingData = TrainingDBHandler(trainingSamples, trainingLabels, userMail, modelName, db)
        trainingData.save()
        return "training data was saved"
    return "file could not be uploaded"


@app.route("/health", methods=['GET'])
@cross_origin()
def health_check():
    return make_response("Service is running", 200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)