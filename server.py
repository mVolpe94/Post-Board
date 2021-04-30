from flask import Flask, render_template, request
import sqlite3
import database


# DataBase Configuration
database_name = 'message_database.db'
database_columns = {'message_id':'INTEGER PRIMARY KEY', 'user_id':'TEXT', 'message':'TEXT'}
message_table_name = 'message_table'


app = Flask(__name__)
# app.secret_key = "]e${\xdc\x11\x8f"
app.debug = True

@app.route('/', methods=["GET"])
def post_page():
  if request.method == 'GET':
    # read_from_database()
    return render_template('home.html')


@app.route('/read-db', methods=["GET"])
def read_database():
  if request.method == 'GET':
    return database.read_table(database_name, message_table_name, "messages")


@app.route('/index', methods=["POST"])
def write_data():
  if request.method == 'POST':
    message = request.form['userInput']
    
    database.add_to_database(database_name, database_columns, message_table_name, user_id, message)
    print(message)
  return message



# #Finish detecting cookie on client system, 
# # if cookie doesnt exist, create one, use that uuid for user_id in db


if __name__ == "__main__":
  app.run(debug=True) 