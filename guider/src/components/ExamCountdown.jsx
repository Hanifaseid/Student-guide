import React, { useState } from 'react';

const ExamCountdown = ({ darkMode }) => {
  const [exams, setExams] = useState([
    { 
      id: 1, 
      name: 'Final Math Exam', 
      date: '2023-06-15', 
      tasks: [
        { id: 1, text: 'Review chapters 1-5', completed: true },
        { id: 2, text: 'Practice problem sets', completed: false },
        { id: 3, text: 'Meet with study group', completed: false }
      ]
    },
    { 
      id: 2, 
      name: 'Science Midterm', 
      date: '2023-05-20', 
      tasks: [
        { id: 4, text: 'Read lab reports', completed: false },
        { id: 5, text: 'Memorize key terms', completed: false }
      ]
    }
  ]);
  
  const [newExam, setNewExam] = useState({ 
    name: '', 
    date: '' 
  });
  
  const [newTask, setNewTask] = useState({ 
    text: '', 
    examId: null 
  });
  
  const [activeExam, setActiveExam] = useState(null);

  const addExam = () => {
    if (newExam.name && newExam.date) {
      const exam = { 
        ...newExam, 
        id: Date.now(), 
        tasks: [] 
      };
      setExams([...exams, exam]);
      setNewExam({ name: '', date: '' });
    }
  };

  const addTask = () => {
    if (newTask.text && newTask.examId) {
      const task = { 
        id: Date.now(), 
        text: newTask.text, 
        completed: false 
      };
      
      setExams(exams.map(exam => 
        exam.id === newTask.examId ? 
          { ...exam, tasks: [...exam.tasks, task] } : 
          exam
      ));
      
      setNewTask({ text: '', examId: null });
    }
  };

  const toggleTask = (examId, taskId) => {
    setExams(exams.map(exam => 
      exam.id === examId ? 
        { 
          ...exam, 
          tasks: exam.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ) 
        } : 
        exam
    ));
  };

  const calculateDaysLeft = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const motivationalQuotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
    "Believe you can and you're halfway there. - Theodore Roosevelt"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Exam Countdown & Motivation Wall</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Add New Exam</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newExam.name}
                onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                placeholder="Exam name"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <button
                onClick={addExam}
                disabled={!newExam.name || !newExam.date}
                className={`px-4 py-2 rounded ${(!newExam.name || !newExam.date) ? 
                  (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                  (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
              >
                Add Exam
              </button>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Motivational Quote</h3>
            <div className={`p-3 italic rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
              "{randomQuote}"
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Upcoming Exams</h3>
            
            {exams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams
                  .filter(exam => calculateDaysLeft(exam.date) >= 0)
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(exam => (
                    <div 
                      key={exam.id} 
                      className={`p-4 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                      onClick={() => setActiveExam(exam)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{exam.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-sm ${
                          calculateDaysLeft(exam.date) < 7 ? 
                            (darkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800') :
                            (darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800')
                        }`}>
                          {calculateDaysLeft(exam.date)} {calculateDaysLeft(exam.date) === 1 ? 'day' : 'days'} left
                        </div>
                      </div>
                      
                      <p className="text-sm mt-1">Date: {exam.date}</p>
                      
                      <div className="mt-2">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">
                            Tasks: {exam.tasks.filter(t => t.completed).length}/{exam.tasks.length}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-gray-300">
                            <div 
                              className="h-full rounded-full bg-green-500" 
                              style={{ 
                                width: `${exam.tasks.length > 0 ? 
                                  (exam.tasks.filter(t => t.completed).length / exam.tasks.length) * 100 : 
                                  0}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-center py-4">No exams scheduled yet</p>
            )}
          </div>
          
          {activeExam && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl">{activeExam.name}</h3>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  calculateDaysLeft(activeExam.date) < 7 ? 
                    (darkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800') :
                    (darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800')
                }`}>
                  {calculateDaysLeft(activeExam.date)} {calculateDaysLeft(activeExam.date) === 1 ? 'day' : 'days'} left
                </div>
              </div>
              
              <p className="mb-4">Date: {activeExam.date}</p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Preparation Tasks</h4>
                {activeExam.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {activeExam.tasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`p-2 rounded flex items-center ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(activeExam.id, task.id)}
                          className="mr-3 h-5 w-5"
                        />
                        <span className={`flex-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-2">No tasks added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Add New Task</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTask.examId === activeExam.id ? newTask.text : ''}
                    onChange={(e) => setNewTask({
                      text: e.target.value,
                      examId: activeExam.id
                    })}
                    placeholder="Task description"
                    className={`flex-1 p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                  />
                  <button
                    onClick={addTask}
                    disabled={!newTask.text || newTask.examId !== activeExam.id}
                    className={`px-4 py-2 rounded ${(!newTask.text || newTask.examId !== activeExam.id) ? 
                      (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                      (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCountdown;