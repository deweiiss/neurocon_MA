from flask_pymongo import PyMongo


class MongoConnector:
    def __init__(self, app):
        self.app = app

    def connect(self):
        # mongodb connection string
        self.app.config['MONGO_URI'] = "mongodb://localhost:27017/NEUROCON"
        mongo_client = PyMongo(self.app)
        db = mongo_client.db
        # on first startup insert document
        if 'sampleCollection' not in db.list_collection_names():
            db.sampleCollection.insert_one({"name": "Initial Document"})

        # TODO: enable scheme check once they are updated
        # self.checkSchemes(db)
        return db
