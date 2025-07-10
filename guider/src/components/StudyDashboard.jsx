import React, { useState } from 'react';
import { FiClock, FiBook, FiCalendar, FiPlus, FiCheck, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const StudyDashboard = ({ darkMode }) => {
  // Study Tracker State
  const [studyLogs, setStudyLogs] = useState([
    { date: '2023-05-01', subject: 'Math', duration: 120 },
    { date: '2023-05-02', subject: 'Science', duration: 90 },
    { date: '2023-05-03', subject: 'History', duration: 60 },
    { date: '2023-05-04', subject: 'Math', duration: 180 },
  ]);

  // Study Planner State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete math assignment', subject: 'Math', priority: 'high', completed: false },
    { id: 2, text: 'Read science chapter 5', subject: 'Science', priority: 'medium', completed: false },
    { id: 3, text: 'Review history notes', subject: 'History', priority: 'low', completed: true },
  ]);
  const [newTask, setNewTask] = useState({ text: '', subject: '', priority: 'medium' });
  const [activeTab, setActiveTab] = useState('tracker');
  const [isAddingSession, setIsAddingSession] = useState(false);

  const subjects = [...new Set(studyLogs.map((log) => log.subject))];
  const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

  // Colors
  const colors = {
    primary: darkMode ? 'rgb(99, 102, 241)' : 'rgb(79, 70, 229)',
    cardBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    cardHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-600' : 'border-gray-200',
  };

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
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

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const addTask = () => {
    if (newTask.text && newTask.subject) {
      setTasks([
        ...tasks,
        {
          ...newTask,
          id: Date.now(),
          completed: false,
        },
      ]);
      setNewTask({ text: '', subject: '', priority: 'medium' });
    }
  };

  const addSession = (session) => {
    setStudyLogs([...studyLogs, session]);
    setIsAddingSession(false);
  };

  const priorityColors = {
    high: darkMode ? 'bg-red-700' : 'bg-red-100 text-red-800',
    medium: darkMode ? 'bg-yellow-700' : 'bg-yellow-100 text-yellow-800',
    low: darkMode ? 'bg-green-700' : 'bg-green-100 text-green-800',
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} pt-9 shadow-xl transition-all duration-300 max-w-6xl mx-auto`}
    >
      {/* ✅ Fixed Header */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-2"
        >
          📚 Student  Dashboard
        </motion.h2>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingSession(true)}
            className={`flex items-center gap-1 px-4 py-2 rounded-md ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white transition-colors`}
          >
            <FiPlus /> Add Session
          </motion.button>

          <div className={`flex rounded-md overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 ${activeTab === 'tracker' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow') : ''}`}
            >
              Tracker
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 ${activeTab === 'planner' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow') : ''}`}
            >
              Planner
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          variants={fadeIn}
          whileHover={cardHover.hover}
          className={`p-6 rounded-lg ${colors.cardBg} shadow-md transition-all duration-300 border ${colors.border} flex flex-col`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${colors.secondaryText}`}>Total Study Time</h3>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} text-indigo-500`}
            >
              <FiClock size={20} />
            </motion.div>
          </div>
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-bold ${colors.text} mb-2`}
          >
            {totalHours.toFixed(1)} hours
          </motion.p>
          <p className={`text-sm ${colors.secondaryText} mt-auto`}>Across all subjects</p>
        </motion.div>
        {/* Repeat similar for other cards... */}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tracker' ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Recent Sessions Table */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              className={`p-6 rounded-lg ${colors.cardBg} shadow-md border ${colors.border}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold text-lg ${colors.text}`}>Recent Study Sessions</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm ${
                    darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                  } transition-colors flex items-center gap-1`}
                >
                  View All <FiChevronDown />
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${colors.border} border-b`}>
                      <th className={`text-left p-3 ${colors.secondaryText} font-medium`}>Date</th>
                      <th className={`text-left p-3 ${colors.secondaryText} font-medium`}>Subject</th>
                      <th className={`text-left p-3 ${colors.secondaryText} font-medium`}>Duration (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyLogs.map((log, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${colors.border} border-b ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <td className={`p-3 ${colors.text}`}>{log.date}</td>
                        <td className={`p-3 ${colors.text} font-medium`}>{log.subject}</td>
                        <td className={`p-3 ${colors.text}`}>{log.duration}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="planner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tasks List */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h3 className={`font-semibold mb-3 ${colors.text}`}>Your Tasks</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                      className={`p-3 rounded flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-sm`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mr-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 rounded border ${
                            task.completed
                              ? `${darkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-400 border-indigo-400'}`
                              : `${darkMode ? 'border-gray-500' : 'border-gray-300'}`
                          } flex items-center justify-center`}
                        >
                          {task.completed && <FiCheck className="text-white" size={14} />}
                        </div>
                      </motion.div>
                      <div className="flex-1">
                        <p className={`${task.completed ? 'line-through opacity-70' : ''} ${colors.text}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center mt-1 space-x-2 text-sm">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}
                          >
                            {task.priority}
                          </motion.span>
                          <span className={colors.secondaryText}>{task.subject}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Add Task Form */}
            <motion.div
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-inner`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={`font-semibold mb-3 ${colors.text}`}>Add New Task</h3>
              <div className="space-y-3">
                <motion.input
                  type="text"
                  value={newTask.text}
                  onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                  placeholder="Task description"
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'} shadow-sm`}
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.input
                  type="text"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="Subject"
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'} shadow-sm`}
                  whileFocus={{ scale: 1.01 }}
                />
                <div className="relative w-full">
                  <motion.select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className={`w-full appearance-none p-2 pr-10 cursor-pointer rounded ${
                      darkMode ? 'bg-gray-600 text-white' : 'bg-white'
                    } shadow-sm`}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </motion.select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FiChevronDown className={`${darkMode ? 'text-white' : 'text-black'}`} />
                  </div>
                </div>
                <motion.button
                  onClick={addTask}
                  className={`px-4 py-2 rounded ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white shadow-md`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Session Modal */}
      <AnimatePresence>
        {isAddingSession && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={`text-xl font-bold mb-4 ${colors.text}`}>Add Study Session</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block mb-1 ${colors.secondaryText}`}>Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} border ${colors.border}`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 ${colors.secondaryText}`}>Subject</label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} border ${colors.border}`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 ${colors.secondaryText}`}>Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="Enter duration"
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} border ${colors.border}`}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <motion.button
                    onClick={() => setIsAddingSession(false)}
                    className={`px-4 py-2 rounded ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                    } ${colors.text}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      addSession({
                        date: new Date().toISOString().split('T')[0],
                        subject: 'New Subject',
                        duration: 60,
                      })
                    }
                    className={`px-4 py-2 rounded ${
                      darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-400'
                    } text-white`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Session
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudyDashboard;