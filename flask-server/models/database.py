import pymongo
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)
from constants import Constants

#Singleton Class
class Database(object):
    _instance = None
    client = None

    def __init__(self):
        raise RuntimeError('This is a Singleton Class, call instance() instead')

    @classmethod
    def instance(cls):
        if cls._instance is None:
            print('Creating new Singleton Database instance')
            #Initialization
            cls._instance = cls.__new__(cls)
            cls.client = cls.connect() 
        return cls._instance
    
    def connect():
        client = pymongo.MongoClient(Constants.DB_CONNECTION_STRING)
        #print(client.list_database_names())
        return client
        
    
    @classmethod
    def test(cls):
        print('hello')



def main():
    db1 = Database.instance()
    db2 = Database.instance()

    print(db1.client)
    db1.test()


#TESTING ONLY
if __name__ == "__main__":
    main()
    