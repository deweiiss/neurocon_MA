import json

import keras.models
import requests
import tensorflow as tf
from bson import ObjectId, json_util
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

from model_mgmt.util import MongoConnector
from model_mgmt.handler import ModelTrainingHandler, ModelDataHandler, TrainingDataHandler, NetworkOutputHandler
from model_mgmt.modelling import VinnslModeller, KerasMapper
from model_mgmt.training import ModelUpdater

app = Flask(__name__)

corsConfig = {
    "origins": ["http://localhost:3000"]
}
CORS(app, resources={"/training/*": corsConfig})

mongo = MongoConnector(app)
db = mongo.connect()


# creating and compiling the model
@app.route("/training/createmodel", methods=['POST'])
@cross_origin()
def CreateModel():
    message = request.get_json()
    print(message)
    userMail, modelName, layerNodeInformationRaw, noOfLayers, metricsRaw, optimizer, lossFunction, class_name_general, class_name_layer, \
    trainable, batch_input_shape, sparse, ragged, dtype_input, activation, use_bias, activation_output, \
    use_bias_output, dtype_output, kernel_initializer, bias_initializer, kernel_regularizer, bias_regularizer, \
    activity_regularizer, kernel_constraint, bias_constraint = \
        message['userMail'], message['modelName'], \
        message['layerNodeInformation'], message['layers'], \
        message['metrics'], message['optimizer'], message['lossFunction'], \
        message['class_name_general'], message['class_name_layer'], \
        message['trainable'], message['batch_input_shape'], \
        message['sparse'], message['ragged'], \
        message['dtype_input'], message['activation'], \
        message['use_bias'], message['activation_output'], \
        message['use_bias_output'], message['dtype_output'], \
        message['kernel_initializer'], message['bias_initializer'], \
        message['kernel_regularizer'], message['bias_regularizer'], \
        message['activity_regularizer'], message['kernel_constraint'], \
        message['bias_constraint']

    # prepare frontend data
    preparator = ModelDataHandler(batch_input_shape, layerNodeInformationRaw, metricsRaw)
    batch_input_shape = preparator.prepareBatchInputShape()
    layerNodeInformation = preparator.prepareLayerNodeInformation()
    metrics = preparator.prepareMetrics()

    # after db its all part of kwargs
    modeller = VinnslModeller(userMail, modelName, layerNodeInformation, noOfLayers, db,
                              class_name_general=class_name_general, class_name_layer=class_name_layer,
                              trainable=trainable, batch_input_shape=batch_input_shape, sparse=sparse, ragged=ragged,
                              dtype_input=dtype_input, activation=activation, use_bias=use_bias,
                              activation_output=activation_output, use_bias_output=use_bias_output, dtype=dtype_input,
                              dtype_output=dtype_output, kernel_initializer=kernel_initializer,
                              bias_initializer=bias_initializer, kernel_regularizer=kernel_regularizer,
                              bias_regularizer=bias_regularizer, activity_regularizer=activity_regularizer,
                              kernel_constraint=kernel_constraint, bias_constraint=bias_constraint)
    # create json vinnsl
    vinnslJson = modeller.createVinnslJSONDescription()
    vinnslJson = json.loads(vinnslJson)
    print(type(vinnslJson))
    kerasMapper = KerasMapper(userMail, modelName, vinnslJson, db)
    # map vinnsl to keras
    model = kerasMapper.mapVinnslToKeras()
    # load keras model
    model = tf.keras.models.model_from_json(json.dumps(model))
    model.compile(optimizer=optimizer, loss=lossFunction, metrics=[metrics])
    # TODO: check if there is a better solution than saving it locally. I mean noone wants this!!
    # TODO: OOOOOR we let the user define a path to save the model!!!
    model.save(modelName)
    # save model to mongo
    # ,odelUpdater = ModelUpdater(userMail, modelName, db, model, status="not_trained")
    # modelUpdater.save()
    return "success"


# fitting the model
@app.route("/training/train", methods=['POST'])
@cross_origin()
def RunTraining():
    message = request.get_json()
    # applicationType can either be train, evaluate or predict
    userMail, modelName, applicationType, learningRate, epochs, verbosity, batchSize = message['userMail'], \
                                                                                       message['modelName'], \
                                                                                       message['applicationType'], \
                                                                                       message['learningRate'], \
                                                                                       message['epochs'], \
                                                                                       message['verbosity'], \
                                                                                       message['batchSize']
    # modelLoader = ModelUpdater(userMail, modelName, db, model=None, status="not_trained")
    # model = tf.keras.models.model_from_json(modelLoader.load())

    strategy = tf.distribute.OneDeviceStrategy(device="/gpu:0")
    with strategy.scope():
        model = keras.models.load_model(modelName)
    trainingData = TrainingDataHandler(userMail, modelName, db)
    trainingLabels, trainingSamples = trainingData.loadSamplesAndLabels()
    trainer = ModelTrainingHandler(applicationType, model, learningRate, int(batchSize), epochs,
                                   verbosity, trainingSamples, trainingLabels)
    trainedModel, history = trainer.train()
    print(history)
    modelSaver = ModelUpdater(userMail, modelName, db, trainedModel, status="training_complete")
    modelSaver.save()
    # NOTE: validation was removed for now
    trainingOutput = NetworkOutputHandler(history, userMail, modelName, db)
    trainingOutput.save()
    return messageOutputMgmtService(userMail, modelName)


def messageOutputMgmtService(userMail, modelName):
    data = {
        "userMail": userMail,
        "modelName": modelName
    }
    req = requests.post('http://localhost:5003/output/trainingcomplete', json=data)
    res = req.json()
    return print(res)


@app.route("/training/models/", methods=['GET'])
@cross_origin()
def GetModels():
    userMail = request.args.get('userMail')
    if userMail:
        modelsRaw = db.keras_model_db.find({'userMail': userMail})
        models = json_util.dumps(modelsRaw)
        models = json.loads(models)
        for model in models:
            # print(model['createdAt']['$date'])
            createdAtNew = model['createdAt']['$date']
            updatedAtNew = model['updatedAt']['$date']
            model['createdAt_new'] = createdAtNew
            model['updatedAt_new'] = updatedAtNew
        models = json_util.dumps(models)
        return models
    else:
        return "no user found"


@app.route("/training/model/", methods=['GET'])
@cross_origin()
def GetModelMetaData():
    modelId = request.args.get('modelId')
    userMail = request.args.get('userMail')
    if userMail:
        modelRaw = db.keras_model_db.find_one({'_id': ObjectId(modelId), 'userMail': userMail})
        # TODO: check if we even need this
        '''metaData = {
            "modelId": modelId,
            "userMail": modelRaw['userMail'],
            "modelName": modelRaw['modelName'],
            "createdAt": modelRaw['createdAt'],
            "updatedAt": modelRaw['updatedAt'],
            "status": modelRaw['status']
        }'''
        modelData = json_util.dumps(modelRaw)
        return modelData
    else:
        return "no user found"


@app.route("/training/model/delete", methods=['POST'])
@cross_origin()
def DeleteModel():
    message = request.get_json()
    modelName = message['modelName']
    modelDb = ModelUpdater(None, modelName, db, None, None)
    result = (modelDb.delete())
    return result

@app.route("/health", methods=['GET'])
@cross_origin()
def health_check():
    return make_response("Model Service is running ", 200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)