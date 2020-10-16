from flask import Flask, request
import os
import pickle
import json
from csv import reader

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return 'It works!'
        
    print(request.data)
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    data = request.json
    print(data)
    input_data = [[data['age'], data['sex'], data['cp'], data['trestbps'], data['chol'], data['fbs'], data['restecg'], data['thalach'], data['exang'], data['oldpeak'], data['slope'], data['ca'], data['thal'], 0]]

    with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
        model = pickle.load(file)
    print(model)


#    with open(os.path.join(__location__, 'final.csv'), 'r') as read_obj:
        # pass the file object to reader() to get the reader object
 #       csv_reader = reader(read_obj)
        # Pass reader object to list() to get a list of lists
  #      list_of_rows = list(csv_reader)
    result = str(model.predict(input_data)[0])
    # print(result)
    print(result)
    return result

    
