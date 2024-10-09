class CSVProcessor:
    def __init__(self, csvData, cols):
        self.csvData = csvData
        self.cols = cols

    def processData(self):
        headers = self.csvData[0]
        # create lists depending on number of columns
        data = [[] for _ in enumerate(range(len(headers)))]
        # print(data)
        rawSet = self.csvData[1:]
        # iterate though raw dataset and append data to each list according to header column
        for i in range(len(rawSet)):
            for j in range(len(rawSet[i])):
                data[j].append(rawSet[i][j])
        # print(data)
        return headers, data