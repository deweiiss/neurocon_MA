from flask_pymongo import PyMongo


class MongoConnector:
    def __init__(self, app):
        self.app = app

    def connect(self):
        # mongodb connection string
        self.app.config['MONGO_URI'] = "mongodb://localhost:27017/NEUROCON"
        mongo_client = PyMongo(self.app)
        db = mongo_client.db
        # TODO: enable scheme check once they are updated
        # self.checkSchemes(db)
        return db
