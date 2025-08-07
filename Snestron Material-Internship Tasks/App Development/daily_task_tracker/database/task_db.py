import sqlite3

class TaskDatabase:
    def __init__(self, db_name):
        self.conn = sqlite3.connect(db_name)
        self.create_table()

    def create_table(self):
        query = """CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    description TEXT,
                    due_date TEXT,
                    completed INTEGER DEFAULT 0)"""
        self.conn.execute(query)
        self.conn.commit()

    def add_task(self, title, desc, due_date):
        self.conn.execute("INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)",
                          (title, desc, due_date))
        self.conn.commit()

    def get_all_tasks(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM tasks")
        return cursor.fetchall()

    def mark_complete(self, task_id):
        self.conn.execute("UPDATE tasks SET completed = 1 WHERE id = ?", (task_id,))
        self.conn.commit()

    def delete_task(self, task_id):
        self.conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        self.conn.commit()
