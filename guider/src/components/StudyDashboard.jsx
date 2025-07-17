import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiClock, FiBook, FiCalendar, FiPlus, FiCheck, FiChevronDown
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // for token

const StudyDashboard = ({ darkMode }) => {
  const { token } = useAuth();

  const [studyLogs, setStudyLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: '', subject: '', priority: 'medium' });
  const [activeTab, setActiveTab] = useState('tracker');
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: '', subject: '', duration: '' });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/study/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudyLogs(res.data.sessions || []);
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      }
    };
    fetchDashboard();
  }, [token]);

  const addTask = async () => {
    if (!newTask.text || !newTask.subject) return;
    try {
      const res = await axios.post(
        '/api/study/tasks',
        newTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setNewTask({ text: '', subject: '', priority: 'medium' });
    } catch (err) {
      console.error('Failed to add task:', err.message);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.patch(
        `/api/study/tasks/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task._id === res.data._id ? res.data : task));
    } catch (err) {
      console.error('Failed to toggle task:', err.message);
    }
  };

  const addSession = async () => {
    const { date, subject, duration } = sessionForm;
    if (!date || !subject || !duration) return;
    try {
      const res = await axios.post(
        '/api/study/sessions',
        { date, subject, duration: parseInt(duration) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudyLogs([...studyLogs, res.data]);
      setIsAddingSession(false);
      setSessionForm({ date: '', subject: '', duration: '' });
    } catch (err) {
      console.error('Failed to add session:', err.message);
    }
  };

  const subjects = [...new Set(studyLogs.map((log) => log.subject))];
  const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

  const colors = {
    primary: darkMode ? 'rgb(99, 102, 241)' : 'rgb(79, 70, 229)',
    cardBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    cardHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-600' : 'border-gray-200',
  };

  const priorityColors = {
    high: darkMode ? 'bg-red-700' : 'bg-red-100 text-red-800',
    medium: darkMode ? 'bg-yellow-700' : 'bg-yellow-100 text-yellow-800',
    low: darkMode ? 'bg-green-700' : 'bg-green-100 text-green-800',
  };

  const cardHover = {
    hover: {
      y: -5,
      boxShadow: darkMode
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
  };

  // Variants for animation
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className={`px-4 py-8 sm:px-8 transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* ✅ Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold flex gap-2 items-center text-indigo-500"
        >
          <FiBook /> Study Dashboard
        </motion.h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingSession(true)}
            className="flex items-center gap-1 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            <FiPlus /> Add Session
          </button>
          <div className={`flex overflow-hidden rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 ${activeTab === 'tracker' ? 'bg-indigo-600 text-white' : ''}`}
            >
              Tracker
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 ${activeTab === 'planner' ? 'bg-indigo-600 text-white' : ''}`}
            >
              Planner
            </button>
          </div>
        </div>
      </motion.div>

      {/* ✅ Tracker */}
      {activeTab === 'tracker' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div
            variants={fadeIn}
            className={`p-6 rounded-lg ${colors.cardBg} shadow-md border ${colors.border} mb-6`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>Study Summary</h3>
            <p className={`text-lg ${colors.text}`}>Total Study Hours: {totalHours.toFixed(1)}</p>
          </motion.div>

          {/* Sessions Table */}
          <motion.div variants={fadeIn} className={`rounded-lg ${colors.cardBg} shadow-md border ${colors.border}`}>
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${colors.border}`}>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {studyLogs.map((log, idx) => (
                  <tr key={idx} className={`border-b ${colors.border}`}>
                    <td className="p-3">{log.date}</td>
                    <td className="p-3">{log.subject}</td>
                    <td className="p-3">{log.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ Planner */}
      {activeTab === 'planner' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              variants={itemVariants}
              className={`p-4 rounded-md flex justify-between items-center shadow-md ${colors.cardBg}`}
            >
              <div>
                <p className={`font-semibold ${task.completed ? 'line-through opacity-70' : ''}`}>{task.text}</p>
                <small className={colors.secondaryText}>
                  {task.subject} - <span className={`${priorityColors[task.priority]}`}>{task.priority}</span>
                </small>
              </div>
              <button onClick={() => toggleTask(task._id)} className="text-indigo-500 hover:text-indigo-600">
                <FiCheck size={20} />
              </button>
            </motion.div>
          ))}

          {/* Add New Task */}
          <div className={`p-4 rounded-md ${colors.cardBg} shadow-md`}>
            <h4 className="font-semibold mb-2">Add Task</h4>
            <input
              type="text"
              placeholder="Task"
              className="w-full mb-2 p-2 rounded bg-white text-black"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full mb-2 p-2 rounded bg-white text-black"
              value={newTask.subject}
              onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
            />
            <select
              className="w-full mb-2 p-2 rounded bg-white text-black"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={addTask} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
              Add Task
            </button>
          </div>
        </motion.div>
      )}

      {/* ✅ Modal - Add Session */}
<AnimatePresence>
  {isAddingSession && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-white rounded-lg p-6 w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <h2 className="text-lg font-bold mb-4">Add Study Session</h2>
        <input
          type="date"
          value={sessionForm.date}
          onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
          className="w-full p-2 mb-3 rounded bg-white text-black"
        />
        <input
          type="text"
          placeholder="Subject"
          value={sessionForm.subject}
          onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
          className="w-full p-2 mb-3 rounded bg-white text-black"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={sessionForm.duration}
          onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-white text-black"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsAddingSession(false)} className="px-4 py-2 rounded bg-gray-300">
            Cancel
          </button>
          <button
            onClick={addSession}
            className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
};

export default StudyDashboard;
