import json


class KerasMapper:
    def __init__(self, userMail, modelName, jsonVinnsl, db):
        self.userMail = userMail
        self.modelName = modelName
        self.jsonVinnsl = jsonVinnsl
        self.db = db

    def mapVinnslToKeras(self):
        kerasDict = self.createKerasDict()

        # TODO: append the layer structure to the base model
        # do it in a new function and then simply add them to the list of dicts called "layers"

        # creating the layers
        # vinnslDict = json.loads(self.jsonVinnsl)
        vinnslStructure = self.jsonVinnsl["structure"]
        counter = 0
        for i in vinnslStructure:
            struct = vinnslStructure[counter]
            print(struct)
            if 'input' not in struct:
                units = 0
                dataType = ''
                useBias = False
                activation = ''
                if 'hidden' in struct:
                    units = struct['hidden']['size']['max']
                    dataType = struct['hidden']['kerasSpecification']['dtype']
                    useBias = struct['hidden']['kerasSpecification']['use_bias']
                    activation = struct['hidden']['kerasSpecification']['activation']
                elif 'output' in struct:
                    units = struct['output']['size']['max']
                    dataType = struct['output']['kerasSpecification']['dtype']
                    useBias = struct['output']['kerasSpecification']['use_bias']
                    activation = struct['output']['kerasSpecification']['activation']
                layerDict = {
                    "class_name": self.jsonVinnsl['kerasSpecification']['classNameLayer'],
                    "config": {
                        "name": "dense_" + str(counter),
                        "trainable": self.jsonVinnsl['endpoints']['train'],
                        "batch_input_shape": self.jsonVinnsl['kerasSpecification']['inputShape'],
                        "dtype": dataType,
                        "units": units,
                        # "activation": vinnslActivation if 'output' not in struct else vinnslActivationOutput,
                        "activation": activation,
                        "use_bias": useBias,
                        # TODO: we should enable this at least for disticttive input, hidden and output selection
                        "kernel_initializer": self.jsonVinnsl['kerasSpecification']['config']['kernel_initializer'],
                        "bias_initializer": self.jsonVinnsl['kerasSpecification']['config']['bias_initializer'],
                        "kernel_regularizer": self.jsonVinnsl['kerasSpecification']['config']['kernel_regularizer'],
                        "bias_regularizer": self.jsonVinnsl['kerasSpecification']['config']['bias_regularizer'],
                        "activity_regularizer": self.jsonVinnsl['kerasSpecification']['config']['activity_regularizer'],
                        "kernel_constraint": self.jsonVinnsl['kerasSpecification']['config']['kernel_constraint'],
                        "bias_constraint": self.jsonVinnsl['kerasSpecification']['config']['bias_constraint'],

                    }
                }
                kerasDict["config"]["layers"].append(layerDict)
            else:
                kerasDict["config"]["name"] = self.modelName
                kerasDict["config"]["layers"][0]["class_name"] = "InputLayer"
            counter += 1

        # TODO: remove later
        with open('keras_model.json', 'w') as file:
            json.dump(kerasDict, file)
        return kerasDict

    def createKerasDict(self):
        # default dict which only contains default information and input layer
        kerasDict = {
            "class_name": self.jsonVinnsl['kerasSpecification']['classNameGeneral'],
            "config": {
                "name": self.modelName,
                "layers": [
                    {
                        "class_name": "",
                        "config": {
                            "batch_input_shape": self.jsonVinnsl['kerasSpecification']['inputShape'],
                            "dtype": self.jsonVinnsl['structure'][0]['input']['kerasSpecification']['dtype'],
                            "sparse": self.jsonVinnsl['structure'][0]['input']['kerasSpecification']['sparse'],
                            "ragged": self.jsonVinnsl['structure'][0]['input']['kerasSpecification']['ragged'],
                            "name": "input"
                        }
                    }
                ]
            },
            "keras_version": "2.7.0",
            "backend": "tensorflow"
        }
        return kerasDict