from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from database.task_db import TaskDatabase
from kivy.properties import ObjectProperty, StringProperty
from kivy.lang import Builder
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.metrics import dp
from kivy.uix.behaviors import ButtonBehavior
from kivy.clock import Clock
from datetime import datetime
import os

# Load KV file
Builder.load_file("task.kv")

db = TaskDatabase("tasks.db")

class ImageButton(ButtonBehavior, Image):
    pass

class TaskItem(BoxLayout):
    task_id = ObjectProperty(None)
    title = StringProperty("")
    due_date = StringProperty("")
    status = StringProperty("pending")  # pending, in_progress, completed
    
    def __init__(self, task_id, title, due_date, status="pending", **kwargs):
        super().__init__(**kwargs)
        self.task_id = task_id
        self.title = title
        self.due_date = due_date
        self.status = str(status)  # Ensure status is always a string
        
    def is_overdue(self):
        if not self.due_date:
            return False
        try:
            due_date = datetime.strptime(self.due_date, '%Y-%m-%d').date()
            return due_date < datetime.now().date()
        except ValueError:
            return False
            
    def update_status(self, new_status):
        self.status = str(new_status)  # Ensure status is always a string
        db.update_task_status(self.task_id, new_status)
        home_screen = App.get_running_app().root.get_screen('home')
        home_screen.on_pre_enter()
        
    def delete_task(self):
        db.delete_task(self.task_id)
        home_screen = App.get_running_app().root.get_screen('home')
        home_screen.on_pre_enter()

class HomeScreen(Screen):
    task_list = ObjectProperty(None)
    
    def on_pre_enter(self, *args):
        self.refresh_tasks()
        
    def refresh_tasks(self):
        self.task_list.clear_widgets()
        tasks = db.get_all_tasks()
        
        if not tasks:
            empty_label = Label(text="No tasks found. Add a new task!", 
                               font_size=dp(18),
                               color=(0.5, 0.5, 0.5, 1))
            self.task_list.add_widget(empty_label)
            return
            
        for task in tasks:
            task_widget = TaskItem(
                task_id=task[0], 
                title=task[1], 
                due_date=task[3], 
                status=str(task[4]) if len(task) > 4 else "pending"
            )
            self.task_list.add_widget(task_widget)

class AddTaskScreen(Screen):
    title_input = ObjectProperty(None)
    desc_input = ObjectProperty(None)
    date_input = ObjectProperty(None)

    def add_task(self):
        title = self.title_input.text.strip()
        desc = self.desc_input.text.strip()
        date = self.date_input.text.strip()
        
        if title and date:
            try:
                datetime.strptime(date, '%Y-%m-%d')
                db.add_task(title, desc, date)
                self.reset_form()
                self.manager.current = 'home'
            except ValueError:
                self.show_error("Invalid date format. Use YYYY-MM-DD")
        else:
            self.show_error("Title and date are required!")
    
    def reset_form(self):
        self.title_input.text = ""
        self.desc_input.text = ""
        self.date_input.text = ""
        
    def show_error(self, message):
        error_label = Label(text=message, 
                           color=(1, 0, 0, 1),
                           size_hint_y=None,
                           height=dp(30))
        
        if hasattr(self, 'error_display'):
            self.remove_widget(self.error_display)
            
        self.error_display = error_label
        self.add_widget(error_label)
        
        Clock.schedule_once(lambda dt: self.remove_widget(error_label), 3)

class TaskTrackerApp(App):
    def build(self):
        # Create assets directory if it doesn't exist
        if not os.path.exists('assets/icons'):
            os.makedirs('assets/icons')
            
        sm = ScreenManager()
        sm.add_widget(HomeScreen(name='home'))
        sm.add_widget(AddTaskScreen(name='add'))
        return sm

if __name__ == "__main__":
    TaskTrackerApp().run()