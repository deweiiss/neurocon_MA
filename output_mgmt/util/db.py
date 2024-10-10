from flask_pymongo import PyMongo

# Global MongoClient instance
mongo_client = None


class MongoConnector:
    def __init__(self, app):
        global mongo_client
        self.app = app

        # Check if the MongoClient is already initialized
        if mongo_client is None:
            # Create and store the global MongoClient instance
            self.app.config['MONGO_URI'] = "mongodb://mongodb:27017/NEUROCON"
            mongo_client = PyMongo(self.app)

        # Store the database reference for further use
        self.db = mongo_client.db

        # Insert initial document if needed (only on the first start)
        if 'sampleCollection' not in self.db.list_collection_names():
            self.db.sampleCollection.insert_one({"name": "Initial Document"})

    def connect(self):
        return self.db