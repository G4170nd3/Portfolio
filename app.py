from flask import Flask, request, render_template, session, render_template_string, redirect, url_for, abort
from jinja2 import TemplateNotFound
from dotenv import load_dotenv
from datetime import datetime
from hashlib import sha256
from random import randint
import json
from os import getenv

load_dotenv()
app = Flask(__name__, static_url_path='/static')
app.secret_key = getenv('SECRET_KEY')

page404textarr = ["Oops! Looks like we took a wrong turn.","Sorry, this page seems to be on vacation.","Not all who wander are lost... but you might be.","Uh-oh! This page seems to have vanished.","Looks like this path leads to nowhere.","Oops! This page is playing hide and seek.","404 Error: This is not the page you're looking for.","Hmmm... this page seems to be MIA.","Looks like you've stumbled into uncharted territory.","This page has gone off the grid.","Lost signal! Page not found.","The page seems to have taken a rain check.","Oops! Looks like we're off the beaten path.","This page seems to have ghosted us.","404 Error: Nothing to see here, move along!","Looks like this page is on an extended coffee break.","Lost in the bits and bytes. Please navigate back.""Lost in the depths of the internet.","Looks like this page took a spontaneous day off.","Oops! The page seems to have slipped through the cracks.","Looks like we've hit a digital dead-end.","404 Error: This page is feeling a bit camera-shy.","Sorry, we seem to have stumbled into a black hole.","Hiccup! The page seems to be on a coffee break.","404 Error: Page not found. Lost in the digital abyss.","Oops! The page got lost in the matrix.","Sorry, this page is experiencing technical jet lag.","404 Error: Page not found. Blame it on the gremlins!","Looks like this page is moonwalking away from us.","404 Error: This page took a shortcut and got lost.","Hmmm... this page seems to have vanished into thin air.","404 Error: The page seems to have gone incognito.","Looks like this page needs a GPS to find its way back.","404 Error: Sorry, the page seems to be on a mystery tour."]

def valid_login(username,password):
    if username == getenv('LOGIN_USERNAME') and password == getenv('LOGIN_PASSWORD'):
        return True
    return False

@app.errorhandler(404)
def page_404(error):
    try:
        return render_template('404.html',text=page404textarr[randint(0,len(page404textarr)-1)]), 404
    except TemplateNotFound:
        return render_template_string('<h1>404 - Not Found (Default - No template found)</h1>'), 404

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/anonfeedback', methods=['POST'])
def feedback():
    data = str(request.get_json()['userInput']).strip()
    now = datetime.now()
    if len(data) > 5000:
        return {"success": False,
                "Error": "message too long!"}
                
    if len(data) == 0:
        return {"success": False,
                "Error": "Empty Message!"}
    newMsg = {
        "Timestamp": str(now),
        "message": data
    }
    with open('data/feedback.json', 'r') as feedbackjson:
        prevMsg = json.load(feedbackjson)
    
    if len(prevMsg)>1000:
        return {"success": False,
                "Error": "Try again after a day or two!"}

    prevMsg.append(newMsg)

    with open('data/feedback.json', 'w') as feedbackjson:
        json.dump(prevMsg, feedbackjson, indent=2)

    return {"success": True,
            "message": "Feedback received! :)"}

@app.route('/fetch/writeup-list')
def fetchWriteupList():
    with open('data/writeup-data.json', 'r') as json_file:
        writeup_list = json_file.read()

    return writeup_list

@app.route("/writeup/<string:ctf>/<string:cat>/<int:index>")
def view_writeup(ctf,cat,index):
    with open('data/writeup-data.json', 'r') as json_file:
        writeup_list = json.load(json_file)
    
    main_data = None
    for listele in writeup_list:
        if listele["Event-name"] == ctf:
            if cat in listele["Event-sections"]:
                if  index < len(listele["Event-sections"][cat]):
                    main_data = listele["Event-sections"][cat][index]
                else:
                    abort(404)
            else:
                abort(404)

    if main_data == None:
        abort(404)
    return render_template("writeupDisplayBase.html", writeup_data=main_data, ctf_data=ctf)

@app.route('/managefeedback',methods=['GET'])
def feedbacks():
    if not session.get('authenticated'):
        return redirect(url_for('adminLogin'))

    else:
        with open('data/feedback.json','r') as json_file:
            feedback_list = json.load(json_file)

        return render_template('feedback.html',feedback_data=feedback_list)

@app.route('/adminlogin',methods=['GET','POST'])
def adminLogin():
    if session.get('authenticated'):
        return redirect(url_for('feedbacks'))

    if request.method == 'POST':
        loginData = request.get_json()
        username = sha256(str(loginData.get('user','fakeuser')).encode()).hexdigest()
        password = sha256(str(loginData.get('pass','fakepass')).encode()).hexdigest()

        if valid_login(username,password):
            session['authenticated'] = True
            return redirect(url_for('feedbacks'))
        else:
            return "Incorrect credentials!"

    else:
        return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('adminLogin'))

@app.route('/clearfeedbacklist')
def clearList():
    if session.get('authenticated'):
        defaultJson = [{"Timestamp": "0000-00-00 00:00:00.000000","message": "Dummy hardcoded data"}]
        with open('data/feedback.json', 'w') as feedbackjson:
            json.dump(defaultJson, feedbackjson, indent=2)
        return "Done"
    else:
        return redirect(url_for('adminLogin'))

if __name__ == '__main__':
    app.run(debug=True)