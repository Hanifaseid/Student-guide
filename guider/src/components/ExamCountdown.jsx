import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiCalendar, 
  FiBook, FiClock, FiFilter, FiSearch, FiChevronDown, 
  FiChevronUp, FiAward, FiList, FiBookmark, FiAlertTriangle, 
  FiBarChart2, FiCheckCircle, FiLayers 
} from 'react-icons/fi';
import { 
  FaBook, FaCalendarAlt, FaFilter, FaSearch, 
  FaTasks, FaLightbulb, FaChartPie, FaRegStar,
  FaRegCheckCircle, FaRegClock
} from 'react-icons/fa';

const API_URL = 'https://student-guide-backend-cb6l.onrender.com/api/exams';

const ExamCountdown = ({ darkMode = true }) => {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null); 
  const [newExam, setNewExam] = useState({ 
    name: '', 
    date: '',
    subject: '',
    priority: 'medium',
    notes: ''
  });
  const [newTask, setNewTask] = useState({ 
    text: '', 
    examId: null 
  });
  const [activeExam, setActiveExam] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedSections, setExpandedSections] = useState({
    addExam: true,
    motivation: true,
    filters: true
  });
  const [currentQuote, setCurrentQuote] = useState('');

  const motivationalQuotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis"
  ];

  // Fetch exams from backend
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(API_URL, { headers });
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
        // Fallback to hardcoded data if API fails
        setExams([
          { 
            id: 1, 
            name: 'Final Math Exam', 
            date: '2023-06-15',
            subject: 'Mathematics',
            priority: 'high',
            notes: 'Covers all chapters from the semester',
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
            subject: 'Biology',
            priority: 'medium',
            notes: 'Focus on chapters 4-6',
            tasks: [
              { id: 4, text: 'Read lab reports', completed: false },
              { id: 5, text: 'Memorize key terms', completed: false }
            ]
          }
        ]);
      }
    };

    fetchExams();
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  // Rest of your functions remain exactly the same
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addExam = async () => {
    if (newExam.name && newExam.date) {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.post(API_URL, newExam, { headers });
        setExams([...exams, res.data]);
        setNewExam({ name: '', date: '', subject: '', priority: 'medium', notes: '' });
      } catch (err) {
        console.error('Failed to add exam:', err);
      }
    }
  };

  const updateExam = async () => {
    if (newExam.name && newExam.date && activeExam) {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.put(`${API_URL}/${activeExam.id}`, {
          ...newExam,
          tasks: activeExam.tasks
        }, { headers });
        setExams(exams.map(exam => exam.id === res.data.id ? res.data : exam));
        setActiveExam(res.data);
        setEditMode(false);
      } catch (err) {
        console.error('Failed to update exam:', err);
      }
    }
  };

  const deleteExam = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_URL}/${id}`, { headers });
      setExams(exams.filter(exam => exam.id !== id));
      if (activeExam && activeExam.id === id) {
        setActiveExam(null);
      }
    } catch (err) {
      console.error('Failed to delete exam:', err);
    }
  };

  const addTask = async () => {
    if (newTask.text && newTask.examId) {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const task = {
          text: newTask.text,
          completed: false
        };
        const res = await axios.post(`${API_URL}/${newTask.examId}/tasks`, task, { headers });
        const updatedExam = res.data;
        setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
        if (activeExam && activeExam.id === updatedExam.id) {
          setActiveExam(updatedExam);
        }
        setNewTask({ text: '', examId: null });
      } catch (err) {
        console.error('Failed to add task:', err);
      }
    }
  };

  const toggleTask = async (examId, taskId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const examRes = await axios.get(`${API_URL}/${examId}`, { headers });
      const exam = examRes.data;
      const task = exam.tasks.find(t => t._id === taskId);
      task.completed = !task.completed;
      const res = await axios.put(`${API_URL}/${examId}`, exam, { headers });
      const updatedExam = res.data;
      setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
      if (activeExam && activeExam.id === updatedExam.id) {
        setActiveExam(updatedExam);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (examId, taskId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.delete(`${API_URL}/${examId}/tasks/${taskId}`, { headers });
      const updatedExam = res.data;
      setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
      if (activeExam && activeExam.id === updatedExam.id) {
        setActiveExam(updatedExam);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Rest of your helper functions remain exactly the same
  const calculateDaysLeft = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(date);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'None';
    }
  };

  const changeQuote = () => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  };

  // Filter and sort functions remain exactly the same
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || exam.priority === filterPriority;
    const daysLeft = calculateDaysLeft(exam.date);
    const isUpcoming = daysLeft >= 0;
    const matchesTab = (activeTab === 'upcoming' && isUpcoming) || 
                      (activeTab === 'past' && daysLeft < 0);
    return matchesSearch && matchesPriority && matchesTab;
  });

  const sortedExams = [...filteredExams].sort((a, b) => {
    const aDays = calculateDaysLeft(a.date);
    const bDays = calculateDaysLeft(b.date);
    if (activeTab === 'upcoming') {
      return aDays - bDays;
    } else {
      return bDays - aDays;
    }
  });

  const totalTasks = exams.reduce((sum, exam) => sum + exam.tasks.length, 0);
  const completedTasks = exams.reduce((sum, exam) => sum + exam.tasks.filter(t => t.completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Animation variants remain exactly the same
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
      

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'}`}
    >
      <motion.div 
        variants={slideUp}
        className={`max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
      >
        <div className="p-6 md:p-8">
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              >
                Exam Countdown
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Stay organized and motivated for your upcoming exams
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 md:mt-0 flex items-center space-x-2"
            >
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {completedTasks}/{totalTasks} tasks completed
              </div>
              <div className="w-24 h-2 rounded-full bg-gray-300">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
                />
              </div>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Organized Sections */}
            <div className="lg:col-span-1 space-y-4">
              {/* Add New Exam Section */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}
              >
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('addExam')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> Add New Exam
                  </h3>
                  {expandedSections.addExam ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
                
                <AnimatePresence>
                  {expandedSections.addExam && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0, height: 0 },
                        visible: { opacity: 1, height: 'auto' }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-3">
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Name
                          </label>
                          <input
                            type="text"
                            value={newExam.name}
                            onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                            placeholder="e.g. Final Calculus Exam"
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
                          />
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Subject
                          </label>
                          <input
                            type="text"
                            value={newExam.subject}
                            onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                            placeholder="e.g. Mathematics"
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
                          />
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={newExam.date}
                              onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                              className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'} pr-8`}
                            />
                            <FiCalendar className={`absolute right-2 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Priority
                          </label>
                          <select
                            value={newExam.priority}
                            onChange={(e) => setNewExam({...newExam, priority: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Notes
                          </label>
                          <textarea
                            value={newExam.notes}
                            onChange={(e) => setNewExam({...newExam, notes: e.target.value})}
                            placeholder="Additional information..."
                            rows="2"
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
                          />
                        </motion.div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={addExam}
                          disabled={!newExam.name || !newExam.date}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                            (!newExam.name || !newExam.date) ? 
                              (darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : 
                              'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          Add Exam
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Motivation Section */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}
              >
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('motivation')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FaLightbulb className="mr-2 text-yellow-500" /> Motivation
                  </h3>
                  {expandedSections.motivation ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
                
                <AnimatePresence>
                  {expandedSections.motivation && (  
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0, height: 0 },
                        visible: { opacity: 1, height: 'auto' }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <motion.div 
                          key={currentQuote}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`p-3 rounded-lg italic ${darkMode ? 'bg-gray-600' : 'bg-white'} mb-2`}
                        >
                          "{currentQuote}"
                        </motion.div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={changeQuote}
                          className={`w-full py-2 px-4 rounded-lg font-medium ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          New Quote
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Filters Section */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}
              >
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('filters')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FaFilter className="mr-2 text-purple-500" /> Filters
                  </h3>
                  {expandedSections.filters ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
                
                <AnimatePresence>
                  {expandedSections.filters && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0, height: 0 },
                        visible: { opacity: 1, height: 'auto' }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-3">
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Search Exams
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search by name or subject"
                              className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'} pl-8`}
                            />
                            <FaSearch className={`absolute left-2 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Priority
                          </label>
                          <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          >
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveTab('upcoming')}
                              className={`py-2 rounded-lg font-medium text-sm ${
                                activeTab === 'upcoming' ? 
                                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                                  (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                              }`}
                            >
                              Upcoming
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveTab('past')}
                              className={`py-2 rounded-lg font-medium text-sm ${
                                activeTab === 'past' ? 
                                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 
                                  (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                              }`}
                            >
                              Past
                            </motion.button>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          variants={fadeIn}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            id="showCompleted"
                            checked={showCompleted}
                            onChange={() => setShowCompleted(!showCompleted)}
                            className="mr-2 h-4 w-4 rounded"
                          />
                          <label htmlFor="showCompleted" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Show completed tasks
                          </label>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Main content - Exams List and Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Exams List */}
              <motion.div 
                variants={itemVariants}
                className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <FaBook className="mr-2 text-blue-500" />
                    {activeTab === 'upcoming' ? 'Upcoming Exams' : 'Past Exams'}
                  </h3>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {sortedExams.length} {sortedExams.length === 1 ? 'exam' : 'exams'} found
                  </div>
                </div>
                
                {sortedExams.length > 0 ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {sortedExams.map((exam, index) => {
                      const daysLeft = calculateDaysLeft(exam.date);
                      const isPast = daysLeft < 0;
                      
                      return (
                        <motion.div 
                          key={exam.id}
                          variants={itemVariants}
                          whileHover={{ y: -5 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'
                          } border ${
                            darkMode ? 'border-gray-500' : 'border-gray-200'
                          } ${
                            activeExam?.id === exam.id ? (darkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400') : ''
                          }`}
                          onClick={() => setActiveExam(exam)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{exam.name}</h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {exam.subject}
                              </p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isPast ? 
                                (darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700') :
                                daysLeft < 7 ? 
                                  (darkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-800') :
                                  (darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800')
                            }`}>
                              {isPast ? 
                                `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago` : 
                                `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              darkMode ? `bg-${getPriorityColor(exam.priority)}-500` : `bg-${getPriorityColor(exam.priority)}-400`
                            }`} />
                            <span className={`text-xs font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {getPriorityText(exam.priority)} Priority
                            </span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center text-sm">
                              <span className="mr-2">
                                Tasks: {exam.tasks.filter(t => t.completed).length}/{exam.tasks.length}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-gray-300">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${exam.tasks.length > 0 ? 
                                      (exam.tasks.filter(t => t.completed).length / exam.tasks.length) * 100 : 
                                      0}%` 
                                  }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`h-full rounded-full ${
                                    exam.tasks.length > 0 ? 
                                      (exam.tasks.filter(t => t.completed).length / exam.tasks.length * 100 >= 75 ? 'bg-green-500' :
                                       exam.tasks.filter(t => t.completed).length / exam.tasks.length * 100 >= 50 ? 'bg-yellow-500' : 'bg-red-500') : 
                                      'bg-gray-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <FiCalendar className="inline mr-1" /> {exam.date}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExam(exam.id);
                              }}
                              className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-500 hover:text-red-400' : 'text-gray-500 hover:bg-gray-200 hover:text-red-500'}`}
                              aria-label="Delete exam"
                            >
                              <FiTrash2 size={14} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                  >
                    <svg 
                      className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="mt-2 font-medium">
                      No {activeTab === 'upcoming' ? 'upcoming' : 'past'} exams found
                    </h4>
                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm || filterPriority !== 'all' ? 
                        'Try adjusting your search or filters' : 
                        'Add a new exam to get started'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Exam Detail View */}
              {activeExam && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}
                >
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-xl flex items-center">
                          <FiEdit2 className="mr-2 text-blue-500" /> Edit Exam
                        </h3>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditMode(false)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          >
                            <FiX />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Name
                          </label>
                          <input
                            type="text"
                            value={newExam.name}
                            onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Subject
                          </label>
                          <input
                            type="text"
                            value={newExam.subject}
                            onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Date
                          </label>
                          <input
                            type="date"
                            value={newExam.date}
                            onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </motion.div>
                        
                        <motion.div variants={fadeIn}>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Priority
                          </label>
                          <select
                            value={newExam.priority}
                            onChange={(e) => setNewExam({...newExam, priority: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </motion.div>
                        
                        <motion.div variants={fadeIn} className="md:col-span-2">
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Notes
                          </label>
                          <textarea
                            value={newExam.notes}
                            onChange={(e) => setNewExam({...newExam, notes: e.target.value})}
                            rows="3"
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </motion.div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditMode(false)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={updateExam}
                          className={`px-4 py-2 rounded-lg font-medium text-white ${
                            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-2xl flex items-center">
                            <FaBookmark className="mr-2 text-blue-500" /> {activeExam.name}
                          </h3>
                          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activeExam.subject}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setNewExam({
                                name: activeExam.name,
                                date: activeExam.date,
                                subject: activeExam.subject,
                                priority: activeExam.priority,
                                notes: activeExam.notes
                              });
                              setEditMode(true);
                            }}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                            aria-label="Edit exam"
                          >
                            <FiEdit2 />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteExam(activeExam.id)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}
                            aria-label="Delete exam"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                        >
                          <div className={`text-sm flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaRegClock className="mr-2" /> Date
                          </div>
                          <div className="font-medium">
                            {new Date(activeExam.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                        >
                          <div className={`text-sm flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FiAlertTriangle className="mr-2" /> Priority
                          </div>
                          <div className="font-medium flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              darkMode ? `bg-${getPriorityColor(activeExam.priority)}-500` : `bg-${getPriorityColor(activeExam.priority)}-400`
                            }`} />
                            {getPriorityText(activeExam.priority)}
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                        >
                          <div className={`text-sm flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaRegCheckCircle className="mr-2" /> Status
                          </div>
                          <div className="font-medium">
                            {calculateDaysLeft(activeExam.date) >= 0 ? (
                              <span className={`${
                                calculateDaysLeft(activeExam.date) < 7 ? 
                                  (darkMode ? 'text-red-400' : 'text-red-600') : 
                                  (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                              }`}>
                                {calculateDaysLeft(activeExam.date)} {calculateDaysLeft(activeExam.date) === 1 ? 'day' : 'days'} left
                              </span>
                            ) : (
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                Completed {Math.abs(calculateDaysLeft(activeExam.date))} {Math.abs(calculateDaysLeft(activeExam.date)) === 1 ? 'day' : 'days'} ago
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </div>
                      
                      {activeExam.notes && (
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}
                        >
                          <h4 className="font-semibold mb-2 flex items-center">
                            <FiBook className="mr-2 text-blue-500" /> Notes
                          </h4>
                          <p className="whitespace-pre-line">{activeExam.notes}</p>
                        </motion.div>
                      )}
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg flex items-center">
                            <FaTasks className="mr-2 text-blue-500" /> Preparation Tasks
                          </h4>
                          <div className={`text-sm ${
                            activeExam.tasks.length > 0 ? 
                              (activeExam.tasks.filter(t => t.completed).length === activeExam.tasks.length ? 
                                (darkMode ? 'text-green-400' : 'text-green-600') : 
                                (darkMode ? 'text-yellow-400' : 'text-yellow-600')) : 
                              (darkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            {activeExam.tasks.filter(t => t.completed).length}/{activeExam.tasks.length} completed
                          </div>
                        </div>
                        
                        {activeExam.tasks.length > 0 ? (
                          <motion.div 
                            variants={containerVariants}
                            className="space-y-2"
                          >
                            {activeExam.tasks
                              .filter(task => showCompleted || !task.completed)
                              .map((task, index) => (
                                <motion.div 
                                  key={task.id}
                                  variants={itemVariants}
                                  whileHover={{ x: 5 }}
                                  className={`p-3 rounded-lg flex items-center ${
                                    darkMode ? 'bg-gray-600' : 'bg-white'
                                  } ${
                                    task.completed ? (darkMode ? 'opacity-70' : 'opacity-80') : ''
                                  } shadow-sm`}
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleTask(activeExam.id, task.id)}
                                    className={`mr-3 flex-shrink-0 h-5 w-5 rounded flex items-center justify-center ${
                                      task.completed ? 
                                        (darkMode ? 'bg-green-500' : 'bg-green-400') : 
                                        (darkMode ? 'border border-gray-400' : 'border border-gray-300')
                                    }`}
                                  >
                                    {task.completed && <FiCheck className="text-white" size={14} />}
                                  </motion.button>
                                  <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>
                                    {task.text}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteTask(activeExam.id, task.id)}
                                    className={`p-1 rounded-full ml-2 ${
                                      darkMode ? 'hover:bg-gray-500 text-gray-300' : 'hover:bg-gray-200 text-gray-500'
                                    }`}
                                    aria-label="Delete task"
                                  >
                                    <FiTrash2 size={14} />
                                  </motion.button>
                                </motion.div>
                              ))
                            }
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-center py-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                          >
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tasks added yet</p>
                          </motion.div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center">
                          <FiPlus className="mr-2 text-blue-500" /> Add New Task
                        </h4>
                        <div className="flex space-x-2">
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={newTask.examId === activeExam.id ? newTask.text : ''}
                            onChange={(e) => setNewTask({
                              text: e.target.value,
                              examId: activeExam.id
                            })}
                            placeholder="What do you need to prepare?"
                            className={`flex-1 p-3 rounded-lg ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={addTask}
                            disabled={!newTask.text || newTask.examId !== activeExam.id}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                              (!newTask.text || newTask.examId !== activeExam.id) ? 
                                (darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : 
                                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                            }`}
                          >
                            Add Task
                          </motion.button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExamCountdown;