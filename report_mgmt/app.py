from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

from report_mgmt.util import MongoConnector
from report_mgmt.handler import ReportHandler

app = Flask(__name__)

corsConfig = {
    "origins": ["http://localhost:3000"]
}
CORS(app, resources={"/report/*": corsConfig})

mongo = MongoConnector(app)
db = mongo.connect()


@app.route("/report/create", methods=['POST'])
@cross_origin()
def create():
    message = request.get_json()
    # print(message)
    userMail, modelName, metrics = message['userMail'], message['modelName'], message['metrics']
    newReport = ReportHandler(userMail, modelName, metrics, db)
    # sort data and return dict with dataframes and plot elements
    newReport.createReportElements()
    newReport.createNewReportPDF()
    return "success"


@app.route("/report/load", methods=['GET'])
@cross_origin()
def load():
    return "success"

@app.route("/health", methods=['GET'])
@cross_origin()
def health_check():
    return make_response("Report Service is running", 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)