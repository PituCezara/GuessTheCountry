from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

# Încarcă țările
with open('countries.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    countries = data['countries']

# Variabilă pentru țara curentă și scor
current_country = random.choice(countries)
score = 0


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get-country')
def get_country():
    global current_country
    current_country = random.choice(countries)
    return jsonify({'country': current_country})


@app.route('/check-answer', methods=['POST'])
def check_answer():
    global score
    user_answer = request.json.get('answer', '').strip()

    if user_answer.lower() == current_country.lower():
        score += 1
        return jsonify({'correct': True, 'score': score})
    else:
        return jsonify({'correct': False, 'score': score, 'correct_answer': current_country})


@app.route('/get-score')
def get_score():
    return jsonify({'score': score})


if __name__ == '__main__':
    app.run(debug=True)