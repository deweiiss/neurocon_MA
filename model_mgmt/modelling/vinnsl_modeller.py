import json

from bson import json_util


class VinnslModeller:
    def __init__(self, userMail, modelName, layerNodeDict, noOfLayers, db, **kwargs):
        self.userMail = userMail
        self.modelName = modelName
        self.layerNodeDict = layerNodeDict
        self.noOfLayers = noOfLayers
        self.db = db

        acceptedKeys = [
            "class_name_general", "class_name_layer", "trainable",
            "batch_input_shape", "activation", "activation_output", "sparse", "ragged", "dtype", "dtype_output",
            "use_bias", "use_bias_output", "kernel_initializer", "kernel_regularizer", "bias_initializer",
            "bias_regularizer", "activity_regularizer", "kernel_constraint", "bias_constraint"
        ]

        for key in kwargs.keys():
            if key in acceptedKeys:
                self.__setattr__(key, kwargs.get(key))

        for attribute, value in self.__dict__.items():
            print(attribute, '=', value)

    def getUserName(self):
        userRaw = json_util.dumps(self.db.user_db.find_one({'userMail': self.userMail}))
        user = json.loads(userRaw)
        userName = user["userFullName"]
        return userName

    # TODO: update this with real values and append missing ones
    def createVinnslJSONDescription(self):
        userName = self.getUserName()
        vinnslDict = {
            "metadata": {
                "bsonType": "object",
                "properties": {
                    "paradigm": "test",
                    "name": self.modelName,
                    "description": "test",
                    "version": {
                        "properties": {
                            "major": 1,
                            "minor": 0
                        }
                    }
                }
            },
            "creator": {
                "properties": {
                    "name": userName,
                    "contact": self.userMail
                }
            },
            "problemDomain": {
                "properties": {
                    "propagrationType": {
                        # TODO: leave this as default for now
                        "type": "feedforward",
                        "learningType": "supervised"
                    },
                    "applicationField": "Classification",
                    "networkType": "Backpropagation",
                    "problemType": "Classifiers"
                },
            },
            "endpoints": {
                "train": self.__getattribute__('trainable'),
                "retrain": True,
                "evaluate": True
            },
            "structure": [
            ],
            "resultSchema": None,
            "parameters": None,
            "kerasSpecification": {
                "inputShape": self.__getattribute__('batch_input_shape'),
                "classNameGeneral": self.__getattribute__('class_name_general'),
                "classNameLayer": self.__getattribute__('class_name_layer'),
                "config": {
                    "kernel_initializer": self.__getattribute__("kernel_initializer"),
                    "bias_initializer": self.__getattribute__("bias_initializer"),
                    "kernel_regularizer": self.__getattribute__("kernel_regularizer"),
                    "bias_regularizer": self.__getattribute__("bias_regularizer"),
                    "activity_regularizer": self.__getattribute__("activity_regularizer"),
                    "kernel_constraint": self.__getattribute__("kernel_constraint"),
                    "bias_constraint": self.__getattribute__("bias_constraint"),
                }
            },
            "data": {
                "description": "iris data set with 4 input vars",
                "tabledescription": "no table input possible",
                "filedescription": "CSV file"
            }
        }
        vinnslDict = self.createLayerStructure(None, vinnslDict)
        with open('json_data.json', 'w') as file:
            json.dump(vinnslDict, file)
        vinnslJson = json.dumps(vinnslDict)
        return vinnslJson

    # TODO: update this with real values
    def createLayerStructure(self, structure, vinnslDict):
        for i in self.layerNodeDict:
            layer = int(i)
            units = self.layerNodeDict[i]
            jsonStrucure = {}
            if layer == 0:
                inputLayer = {
                    "input": {
                        "ID": "Input",
                        "size": {
                            "min": units,
                            "max": units
                        },
                        "kerasSpecification": {
                            "activation": self.__getattribute__('activation'),
                            "dtype": self.__getattribute__('dtype'),
                            "use_bias": self.__getattribute__("use_bias"),
                            "sparse": self.__getattribute__('sparse'),
                            "ragged": self.__getattribute__('ragged'),
                        }
                    }
                }
                jsonStrucure.update(inputLayer)
            elif 0 < layer < self.noOfLayers - 1:
                hiddenLayer = {
                    "hidden": {
                        "ID": "Hidden" + str(layer),
                        "size": {
                            "min": units,
                            "max": units
                        },
                        "kerasSpecification": {
                            "activation": self.__getattribute__('activation'),
                            "dtype": self.__getattribute__('dtype'),
                            "use_bias": self.__getattribute__("use_bias"),
                        }
                    }
                }
                jsonStrucure.update(hiddenLayer)
            elif layer == self.noOfLayers - 1:
                outputLayer = {
                    "output": {
                        "ID": "Output",
                        "size": {
                            "min": units,
                            "max": units
                        },
                        "kerasSpecification": {
                            "activation": self.__getattribute__('activation_output'),
                            "dtype": self.__getattribute__('dtype_output'),
                            "use_bias": self.__getattribute__("use_bias_output"),
                        }
                    }
                }
                jsonStrucure.update(outputLayer)
            vinnslDict["structure"].append(jsonStrucure)
        return vinnslDict