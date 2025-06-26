import React, { useState } from 'react';

const StudyPlanner = ({ darkMode }) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete math assignment', subject: 'Math', priority: 'high', completed: false },
    { id: 2, text: 'Read science chapter 5', subject: 'Science', priority: 'medium', completed: false },
    { id: 3, text: 'Review history notes', subject: 'History', priority: 'low', completed: true },
  ]);
  const [newTask, setNewTask] = useState({ text: '', subject: '', priority: 'medium' });

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.text && newTask.subject) {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setNewTask({ text: '', subject: '', priority: 'medium' });
    }
  };

  const priorityColors = {
    high: darkMode ? 'bg-red-700' : 'bg-red-100',
    medium: darkMode ? 'bg-yellow-700' : 'bg-yellow-100',
    low: darkMode ? 'bg-green-700' : 'bg-green-100'
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Personalized Study Planner</h2>
      
      <div className="mb-8">
        <h3 className="font-semibold mb-3">Your Tasks</h3>
        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`p-3 rounded flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mr-3 h-5 w-5"
              />
              <div className="flex-1">
                <p className={`${task.completed ? 'line-through opacity-70' : ''}`}>{task.text}</p>
                <div className="flex items-center mt-1 space-x-2 text-sm">
                  <span className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span>{task.subject}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className="font-semibold mb-3">Add New Task</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newTask.text}
            onChange={(e) => setNewTask({...newTask, text: e.target.value})}
            placeholder="Task description"
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
          />
          <input
            type="text"
            value={newTask.subject}
            onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
            placeholder="Subject"
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button
            onClick={addTask}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;