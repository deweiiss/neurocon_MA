from flask_pymongo import PyMongo


class MongoConnector:
    def __init__(self, app):
        self.app = app

    def connect(self):
        # mongo connection string
        self.app.config['MONGO_URI'] = "mongodb://NEUROCON:27017/"
        mongo_client = PyMongo(self.app)
        db = mongo_client.db
        return db