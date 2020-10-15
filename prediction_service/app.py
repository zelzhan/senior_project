from flask import Flask
import os
import pickle
from csv import reader

app = Flask(__name__)


@app.route('/')
def hello_world():
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
        model = pickle.load(file)
    print(model)


    with open(os.path.join(__location__, 'final.csv'), 'r') as read_obj:
        # pass the file object to reader() to get the reader object
        csv_reader = reader(read_obj)
        # Pass reader object to list() to get a list of lists
        list_of_rows = list(csv_reader)

    print(model.predict(list_of_rows))

    return "OK"
