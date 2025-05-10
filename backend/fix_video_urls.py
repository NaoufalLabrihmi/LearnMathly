import sqlite3

DB_PATH = "app.db"

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.execute("UPDATE videos SET video_url = REPLACE(video_url, '/videos/', '/video-files/');")
conn.commit()

print("Video URLs updated successfully.")

conn.close() 