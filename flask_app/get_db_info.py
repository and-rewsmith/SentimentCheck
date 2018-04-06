import sqlite3

conn = sqlite3.connect('db/sentiments.db')

cursor = conn.cursor()

cursor.execute("SELECT * FROM sentiments")

out = cursor.fetchall()
conn.commit()


print(out)


conn.close()
