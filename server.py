from flask import Flask, render_template, request, jsonify, make_response
import database
import time
import random as rand


# DataBase Configuration
database_name = 'message_database.db'
database_columns = {'message_id':'INTEGER PRIMARY KEY', 'user_id':'TEXT', 'message':'TEXT'}
message_table_name = 'message_table'
user_id = None


app = Flask(__name__)
# app.secret_key = "]e${\xdc\x11\x8f"
app.debug = True

@app.route('/', methods=["GET"])
def post_page():
  if request.method == 'GET':
    
    res = make_response(render_template('home.html'))
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
      res.set_cookie('user_id', f'{user_id}', max_age=10)
    return res


@app.route('/read-db', methods=["GET"])
def read_database():
    if request.method == 'GET':
      data_json = {}
      message_count = 0
      inputs = database.read_table(database_name, message_table_name, "message")
      for messages in inputs:
        data_json.update({str(message_count):messages})
        message_count += 1
      # print(data_json)
      return jsonify(data_json)


@app.route('/index', methods=["POST"])
def write_data():
  if request.method == 'POST':
    message = request.form['userInput']
    database.add_to_database(database_name, database_columns, message_table_name, user_id, message)
    print(message)
  return message



# Finish detecting cookie on client system, 
# if cookie doesnt exist, create one, use that uuid for user_id in db


if __name__ == "__main__":
  app.run(debug=True) 