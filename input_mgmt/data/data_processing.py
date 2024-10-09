import numpy as np


class DataProcessor:
    def __init__(self, header, dataSet, labelColumn):
        self.header = header
        self.dataSet = dataSet
        self.labelColumn = int(labelColumn)

    def createSampleAndLabelTensors(self):
        data = np.array(self.dataSet)
        # following section is to shuffle the dataset and then bring it back into original shape
        data = np.transpose(data)
        np.random.shuffle(data)
        data = np.transpose(data)

        # training samples
        trainingSamples = np.array(data[:self.labelColumn])
        trainingSamples = np.transpose(trainingSamples)
        trainingSamples = trainingSamples.astype(np.float64)
        # print(trainingSamples)

        # training labels
        trainingLabels = np.array(data[self.labelColumn])
        trainingLabels = np.unique(trainingLabels, return_inverse=True)[1]
        # print(trainingLabels)

        return trainingSamples, trainingLabels