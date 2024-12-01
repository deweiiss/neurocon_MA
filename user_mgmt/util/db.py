from flask_pymongo import PyMongo
import os

# Global MongoClient instance
mongo_client = None


class MongoConnector:
    def __init__(self, app):
        global mongo_client
        self.app = app

        # Dynamically determine the mongo connection details
        mongo_host = os.getenv("MONGO_HOST", "localhost")
        mongo_port = os.getenv("MONGO_PORT", "27017")
        mongo_db_name = os.getenv("MONGO_DB_NAME", "NEUROCON")

        # Construct mongo URI
        mongo_uri = f"mongodb://{mongo_host}:{mongo_port}/{mongo_db_name}"
        print(f"Connecting to MongoDB at {mongo_uri}")  # Debugging log

        # Initialize mongo client if not init already
        if mongo_client is None:
            self.app.config['MONGO_URI'] = mongo_uri
            mongo_client = PyMongo(self.app)

        # Store the database reference for further use
        self.db = mongo_client.db

        # Insert initial document if needed (only on the first start)
        if 'sampleCollection' not in self.db.list_collection_names():
            print("Inserting initial document into sampleCollection.")  # Debugging log
            self.db.sampleCollection.insert_one({"name": "Initial Document"})

    def connect(self):
        return self.db