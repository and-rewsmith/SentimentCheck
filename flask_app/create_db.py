import sqlite3

conn = sqlite3.connect('db/sentiments.db')

c = conn.cursor()

try:
    c.execute("""DROP TABLE sentiments""")
except sqlite3.OperationalError:
    print("WARNING: NO TABLE TO DROP")


c.execute("""
          CREATE TABLE sentiments (
              name text NOT NULL,
              polarity REAL NOT NULL,
              subjectivity REAL NOT NULL
          );"""
         )

conn.close()
