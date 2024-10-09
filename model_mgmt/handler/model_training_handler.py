# those two are used for training


# gather input processing functions
# TODO: put these into http request


# loss='sparse_categorical_crossentropy'
# metrics=['accuracy']
# TODO: change to csv processing and sql processing!!!
class ModelTrainingHandler:
    def __init__(self, applicationType, model, learningRate, batchSize, epochs, verbosity,
                 samples, labels):
        self.applicationType = applicationType
        self.model = model
        self.learningRate = learningRate
        self.batchSize = batchSize
        self.epochs = int(epochs)
        self.verbosity = verbosity
        self.samples = samples
        self.labels = labels

    def train(self):
        """createdSamples, createdLabels = DataCreator()
        createdSamples = np.array(createdSamples)
        createdLabels = np.array(createdLabels)
        scaledSamples = DataProcessor(createdSamples, createdLabels)
        print(scaledSamples)"""

        if self.applicationType == 'train':
            # create the new model and the necessary meta information
            # prepare for training
            # batch size = how many samples processed at once
            # epochs = iterations
            # shuffle = default true and shuffles the processing so no learning about order of processing set
            # verbose = option to allow output 0,1,2 with 2 as max output information
            results = self.model.fit(
                x=self.samples, y=self.labels, batch_size=self.batchSize, epochs=self.epochs, shuffle=True,
                verbose=self.verbosity
            )
            return self.model, results.history
        elif self.applicationType == 'evaluate':
            # verbosity can only be 0 and 1 here!
            results = self.model.evaluate(x=self.samples, y=self.labels, batch_size=self.batchSize,
                                          verbose=self.verbosity)
            return self.model, results
        elif self.applicationType == 'predict':
            # verbosity can only be 0 and 1 here!
            results = self.model.predict(x=self.samples, batch_size=self.batchSize, verbose=self.verbosity)
            return self.model, results