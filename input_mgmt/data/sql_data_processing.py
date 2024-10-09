import json


class SQLQueryProcessor:
    def __init__(self, result):
        self.result = result

    def postgresProcessor(self):
        data = [dict(record) for record in self.result]
        dataList = json.loads(json.dumps(data).replace("</", "<\\/"))
        # transforming the unordered records into a dict of lists where header is the key
        dictTmp = {key: [i[key] for i in dataList] for key in dataList[0]}
        # create lists depending on number of columns in dataset
        columnsTmp = [[] for _ in enumerate(dictTmp.keys())]
        counter = 0
        headers = list(dictTmp)
        for i in dictTmp:
            columnsTmp[counter].append(dictTmp[i])
            counter += 1
        # clean up
        finalColumns = [item for sublist in columnsTmp for item in sublist]
        return headers, finalColumns