import sqlite3

# Creates an SQLite3 CREATE command using user inputted columns and data types
# Takes in a dictionary of key column names and value data types

def create(table_name, columns=dict()):
  columns = columns.items()
  column_str = ''
  
  for kv_pair in columns:
    column_str += kv_pair[0] + ' '
    column_str += kv_pair[1] + ', '
  column_str = column_str.rstrip(', ')
  return f"CREATE TABLE IF NOT EXISTS {table_name}({column_str})"


# Creates an SQLite3 INSERT command based using user inputted columns and values
# Can take list or string of column labels and strings for *args

def insert(table_name, column_labels, *args):
  column_str = ''
  value_str = ''
  if type(column_labels) == list:
    for label in column_labels:
      column_str += label + ', '
    column_str = column_str.rstrip(', ')
  elif type(column_labels) == str:
    column_str = column_labels
  
  for arg in args:
    arg = str(arg)
    if arg == "NULL":
      value_str += arg + ', '
    else:
      value_str += "'" + arg + "'" + ', '
  value_str = value_str.rstrip(', ')
  
  return f"INSERT INTO {table_name}({column_str}) VALUES ({value_str})"


# Adds data to a selected database (proprietary)

def add_to_database(database_name, database_columns, table_name, user_id, message, time):
  print(f"Adding message ('{message}') to the database...")
  print(f"Under User_ID: {user_id}")
  print(f"At {time}")

  conn = sqlite3.connect(database_name)
  cur = conn.cursor()

  database_columns_keys = database_columns.keys()
  column_labels = []
  for key in database_columns_keys:
    column_labels.append(key)

  message = message.replace("'", "&#39;")

  open_table = create(table_name, database_columns)
  input_data = insert(table_name, column_labels, "NULL", user_id, message, time)

  cur.execute(open_table)
  cur.execute(input_data)
  conn.commit()

  conn.close()

  return print("Done.")


# Returns either a list of data in a specified column in the table given, 
# or returns a list of tuples for each row in table given

def read_table(database_name, table_name, column=None):
  table_data = []
  conn = sqlite3.connect(database_name)
  cur = conn.cursor()
  try:
    if column:
      cur.execute(f"""SELECT {column} FROM {table_name}""")
      for row in cur:
        table_data.append(row[0])
      conn.close()
      return table_data
    else:
      cur.execute(f"""SELECT * FROM {table_name}""")
      for row in cur:
        table_data.append(row)
      conn.close()
      return table_data
  except:
    return print("Error: Table does not exist")


if __name__ == '__main__':
  import random as rand

  database_name = "messages2.db"
  table1 = "message_table"
  database_columns = {"message_id":"INTEGER PRIMARY KEY", "user_id":"TEXT", "messages":"TEXT"}
  data = ["af","bf","cf","df","ef","ff","gf","hf","if","jf","kf"]


  for index in range(len(data)):
    user_id = str(rand.randint(10001, 99999))
    add_to_database(database_name, database_columns, table1, user_id, data[index])

  print(read_table(database_name, table1, 'message_id'))

