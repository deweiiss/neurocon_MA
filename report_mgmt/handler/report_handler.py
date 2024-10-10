import glob
import json
import os

import pandas as pd
from matplotlib import pyplot as plt
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Image, Paragraph


class ReportHandler:
    def __init__(self, userMail, modelName, metrics, db):
        self.userMail = userMail
        self.modelName = modelName
        self.metrics = metrics
        self.db = db
        self.elementDict = {}

    def createReportElements(self):
        iterations = ReportHandler.getIterations(self)
        # get iterations
        for k, v in self.metrics.items():
            dictTmp = {
                k: v,
                'epoch': iterations,
            }
            plotter = plt
            # prepare dataframe
            dataFrame = pd.DataFrame(dictTmp, iterations)
            dataFrame[k] = dataFrame[k].astype('float')
            # create plot form df
            plot = dataFrame.plot(y=k, x='epoch', kind='line')
            plt.savefig('tmp/' + k + '_plot.png')
            # elements to pass for report
            elements = {
                'name': k,
                'table': dataFrame,
                'plot': plot
            }
            self.elementDict[k] = elements
        return

    def createNewReportPDF(self):
        pdf = SimpleDocTemplate(self.modelName + ".pdf", pagesize=letter,
                                rightMargin=72, leftMargin=72,
                                topMargin=50, bottomMargin=30)
        # report content
        content = []
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

        for i in self.elementDict:
            plotName = self.elementDict[i]['name']
            imgPath = 'tmp/' + plotName + '_plot.png'
            img = Image(imgPath, 4 * inch, 3 * inch)
            # TODO: create descriptions according to each graph type
            description = self.getDescription(plotName, False)
            content.append(img)
            content.append(Paragraph(description, styles["Normal"]))

        # close json
        self.getDescription(None, True)
        # create pdf
        pdf.build(content)

        # deleting all files from tmp directory
        pathTmp = 'tmp/*'
        imageFiles = glob.glob(pathTmp)
        for f in imageFiles:
            os.remove(f)
        return

    def getIterations(self):
        data = self.db.output_db.find_one({
            'userMail': self.userMail,
            'modelName': self.modelName
        })
        loss = data['processing']['loss']
        iterations = []
        counter = 0
        for i in loss:
            counter += 1
            iterations.append(counter)
        return iterations

    def getDescription(self, plotName, closing):

        path = 'graphDescriptions/descriptions.json'
        file = open(path)
        data = json.load(file)
        if plotName is not None:
            description = data[plotName]
            return description
        elif plotName and closing is False:
            file.close()