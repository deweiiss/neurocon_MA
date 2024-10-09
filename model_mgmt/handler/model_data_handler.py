import tensorflow as tf


class ModelDataHandler:
    def __init__(self, batchInputShape, layerNodeInformation, metrics):
        self.batchInputShape = batchInputShape
        self.layerNodeInformation = layerNodeInformation
        self.metrics = metrics

    def prepareBatchInputShape(self):
        batchInputShape = [int(i) for i in self.batchInputShape]
        return batchInputShape

    def prepareLayerNodeInformation(self):
        layerNodeDict = {}
        for key in self.layerNodeInformation:
            layerNodeDict[key['layer']] = key['nodes']
        return layerNodeDict

    def prepareMetrics(self):
        metrics = []
        for metric in self.metrics:
            for val in metric.values():
                if "accuracy" == val:
                    metrics.append(tf.keras.metrics.Accuracy())
                if "precision" == val:
                    metrics.append(tf.keras.metrics.Precision())
                if "binary_accuracy" == val:
                    metrics.append(tf.keras.metrics.BinaryAccuracy())
                if "categorical_accuracy" == val:
                    metrics.append(tf.keras.metrics.CategoricalAccuracy())
                if "sparse_categorical_accuracy" == val:
                    metrics.append(tf.keras.metrics.SparseCategoricalAcccuracy())
                if "top_k_categorical_accuracy" == val:
                    metrics.append(tf.keras.metrics.TopKCategoricalAccuracy())
                if "sparse_top_k_categorical_accuracy" == val:
                    metrics.append(tf.keras.metrics.SparseTopKCategoricalAccuracy())
                if "binary_crossentropy" == val:
                    metrics.append(tf.keras.metrics.BinaryCrossentropy())
                if "categorical_crossentropy" == val:
                    metrics.append(tf.keras.metrics.CategoricalCrossentropy())
                if "sparse_categorical_crossentropy" == val:
                    metrics.append(tf.keras.metrics.SparseCategoricalCrossentropy())
                if "kullback_leibler_divergence" == val:
                    metrics.append(tf.keras.metrics.KLDivergence())
                if "poisson" == val:
                    metrics.append(tf.keras.metrics.Poisson())
                if "mean_squared_error" == val:
                    metrics.append(tf.keras.metrics.MeanSquaredError())
                if "root_mean_squared_error" == val:
                    metrics.append(tf.keras.metrics.RootMeanSquaredError())
                if "mean_absolute_error" == val:
                    metrics.append(tf.keras.metrics.MeanAbsoluteError())
                if "mean_absolute_percentage_error" == val:
                    metrics.append(tf.keras.metrics.MeanAbsolutePercentageError())
                if "mean_squared_error" == val:
                    metrics.append(tf.keras.metrics.MeanSquaredError())
                if "mean_squared_logarithmic_error" == val:
                    metrics.append(tf.keras.metrics.MeanSquaredLogarithmicError())
                if "cosine_similarity" == val:
                    metrics.append(tf.keras.metrics.CosineSimilarity())
                if "logcosh" == val:
                    metrics.append(tf.keras.metrics.LogCoshError())
                if "recall" == val:
                    metrics.append(tf.keras.metrics.Recall())
                if "true_positives" == val:
                    metrics.append(tf.keras.metrics.TruePositives())
                if "false_positives" == val:
                    metrics.append(tf.keras.metrics.FalsePositives())
                if "false_negatives" == val:
                    metrics.append(tf.keras.metrics.FalseNegatives())
                if "precision_at_recall" == val:
                    # TODO: needs params!!!!
                    metrics.append(tf.keras.metrics.PrecisionAtRecall())
                if "sensitivity_at_specificity" == val:
                    metrics.append(tf.keras.metrics.SensitivityAtSpecificity())
                if "specificity_at_sensitivity" == val:
                    metrics.append(tf.keras.metrics.SpecificityAtSensitivity())
        return metrics