from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')  # Start Page

@app.route('/game')
def game():
    return render_template('index.html')  # Maze Game

import os

port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port)


