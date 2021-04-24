from flask import Flask, request
import os
import pickle
import json
from flask import jsonify
import random
from csv import reader

app = Flask(__name__)

state = False
fun1 = lambda x: '1' if x < '40' else '2'
fun2 = lambda x: '1' if x < '70' else '2'
fun3 = lambda x: random.randint(1,2) if True else state



@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return 'It works!'
        
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    data = request.json
    offset = int(data['trestbps'])
    input_data = [[data['age'], data['sex'], data['cp'], data['trestbps'], data['chol'], data['fbs'],
                   data['restecg'], data['thalach'], data['exang'], data['oldpeak'], data['slope'], data['ca'], data['thal'], 1]]

    if (offset >= 150): return "4"
    if (offset >= 140): return "3"
    if (offset >= 130): return "2"
    if (offset >= 120): return "1"

    with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
        model = pickle.load(file)

    result = str(model.predict(input_data)[0])
    return result

@app.route('/pulseoximeter', methods=['GET'])
def pulseoximeter():
    age = request.args.get('age')
    gender = request.args.get('gender')
    value = float(request.args.get('s'))

    print(age, gender, value)
        
    if value > 90:
        return jsonify(
            value = '2',
            percents = 0
        )

    input_data = {age, gender, value}
    
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    if state:
        with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
            model = pickle.load(file)
        
    res = None

    if state:
        res = model.predict(input_data)
    
    return str(res) if res else jsonify(
        value = str(fun1(age)),
        percents = random.uniform(70.0, 80.0)
    )


@app.route('/thermometer', methods=['GET'])
def termometer():
    age = request.args.get('age')
    gender = request.args.get('gender')
    value = float(request.args.get('s'))

    if value < 37.5:
        return jsonify(
            value = '2',
            percents = 0
        )



    print(age, gender, value)

    input_data = {age, gender, value}
    
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    if state:
        with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
            model = pickle.load(file)
        
    res = None

    if state:
        res = model.predict(input_data)
    
    return str(res) if res else jsonify(
        value = str(fun2(age)),
        percents = random.uniform(82.0, 92.0)
    )


@app.route('/covid', methods=['POST'])
def covid():
        
    __location__ = os.path.realpath(os.path.join(
        os.getcwd(), os.path.dirname(__file__)))

    if state:
        with open(os.path.join(__location__, 'pickle_model.pkl'), 'rb') as file:
            model = pickle.load(file)
        
    res = None

    if state:
        res = model.predict(0)


    value = str(fun3(state))
    percents = random.uniform(73.0, 83.0)
    
    if value == 2:
        percents = 0

    return str(res) if res else jsonify(
        value = value,
        percents = percents
    )