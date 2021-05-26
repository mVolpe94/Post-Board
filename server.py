from flask import Flask, render_template, request, jsonify, make_response
import database
import time
import random as rand

# ToDo: remove client-side time from database, add function to get time on server-side and input that to the database,
# deal with time and timezones on client side when posting and loading.
# Also, disable python extensions, add Code-Runner and Syntax Highlighter by Peshkov and tabnine

# DataBase Configuration
database_name = 'message_database.db'
database_columns = {'message_id': 'INTEGER PRIMARY KEY', 'user_id': 'TEXT', 'message': 'TEXT', 'time': 'TEXT'}
message_table_name = 'message_table'


app = Flask(__name__)
# app.secret_key = "]e${\xdc\x11\x8f"
app.debug = True


@app.route('/', methods=["GET"])
def post_page():
  if request.method == 'GET':
    return render_template('home.html')


@app.route('/read-db', methods=["GET"])
def read_database():
    if request.method == 'GET':
      data_json = {}
      message_count = 0
      inputs = database.read_table(database_name, message_table_name)

      if inputs != None:
        for messages in inputs:
          data_json.update({str(message_count):[messages[2], messages[3]]})
          message_count += 1
        # print(data_json)
        return jsonify(data_json)
      else:
        return "Error: Table does not exist"


@app.route('/index', methods=["POST"])
def write_data():
  if request.method == 'POST':
    # message = request.form['userInput']
    data = request.get_json()
    res = make_response(data['message'])
    cookie = request.cookies
    user_id = cookie.get('user_id')
    print(user_id)
    if user_id == None:
      user_id_list = database.read_table(database_name, message_table_name, "user_id")
      
      for ids in user_id_list:
        new_id = rand.randint(1000001,9999999)
        if not user_id_list.count(new_id):
          user_id = new_id
          break
      res.set_cookie('user_id', f'{user_id}',
        expires='never')
    # Determine time of input here instead of taking from client-side js##############################
    epoch = round(time.time())
    epoch = epoch * 100
    database.add_to_database(database_name, database_columns, message_table_name, user_id, data['message'], epoch)
    print(data)
  return res


if __name__ == "__main__":
  app.run(debug=True) 

