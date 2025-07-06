import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiCalendar, FiBook, FiClock, FiFilter, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
const ExamCountdown  = ({ darkMode = true }) => {

  // Load exams from localStorage if available
  const [exams, setExams] = useState(() => {
    const savedExams = localStorage.getItem('exams');
    return savedExams ? JSON.parse(savedExams) : [
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
    ];
  });
  
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

  // Save exams to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addExam = () => {
    if (newExam.name && newExam.date) {
      const exam = { 
        ...newExam, 
        id: Date.now(), 
        tasks: [] 
      };
      setExams([...exams, exam]);
      setNewExam({ name: '', date: '', subject: '', priority: 'medium', notes: '' });
    }
  };

  const updateExam = () => {
    if (newExam.name && newExam.date && activeExam) {
      setExams(exams.map(exam => 
        exam.id === activeExam.id ? { ...newExam, id: activeExam.id, tasks: activeExam.tasks } : exam
      ));
      setActiveExam({ ...newExam, id: activeExam.id, tasks: activeExam.tasks });
      setEditMode(false);
    }
  };

  const deleteExam = (id) => {
    setExams(exams.filter(exam => exam.id !== id));
    if (activeExam && activeExam.id === id) {
      setActiveExam(null);
    }
  };

  const addTask = () => {
    if (newTask.text && newTask.examId) {
      const task = { 
        id: Date.now(), 
        text: newTask.text, 
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      setExams(exams.map(exam => 
        exam.id === newTask.examId ? 
          { ...exam, tasks: [...exam.tasks, task] } : 
          exam
      ));
      
      if (activeExam && activeExam.id === newTask.examId) {
        setActiveExam({
          ...activeExam,
          tasks: [...activeExam.tasks, task]
        });
      }
      
      setNewTask({ text: '', examId: null });
    }
  };

  const toggleTask = (examId, taskId) => {
    const updatedExams = exams.map(exam => 
      exam.id === examId ? 
        { 
          ...exam, 
          tasks: exam.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ) 
        } : 
        exam
    );
    
    setExams(updatedExams);
    
    if (activeExam && activeExam.id === examId) {
      setActiveExam(updatedExams.find(exam => exam.id === examId));
    }
  };

  const deleteTask = (examId, taskId) => {
    const updatedExams = exams.map(exam => 
      exam.id === examId ? 
        { 
          ...exam, 
          tasks: exam.tasks.filter(task => task.id !== taskId)
        } : 
        exam
    );
    
    setExams(updatedExams);
    
    if (activeExam && activeExam.id === examId) {
      setActiveExam(updatedExams.find(exam => exam.id === examId));
    }
  };

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

  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const changeQuote = () => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  };

  // Filter exams based on search term, priority filter, and active tab
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

  // Sort exams by date (soonest first for upcoming, most recent first for past)
  const sortedExams = [...filteredExams].sort((a, b) => {
    const aDays = calculateDaysLeft(a.date);
    const bDays = calculateDaysLeft(b.date);
    
    if (activeTab === 'upcoming') {
      return aDays - bDays;
    } else {
      return bDays - aDays;
    }
  });

  // Calculate overall progress
  const totalTasks = exams.reduce((sum, exam) => sum + exam.tasks.length, 0);
  const completedTasks = exams.reduce((sum, exam) => sum + exam.tasks.filter(t => t.completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Exam Countdown</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Stay organized and motivated for your upcoming exams
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {completedTasks}/{totalTasks} tasks completed
              </div>
              <div className="w-24 h-2 rounded-full bg-gray-300">
                <div 
                  className="h-full rounded-full bg-green-500" 
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Organized Sections */}
            <div className="lg:col-span-1 space-y-4">
              {/* Add New Exam Section */}
              <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('addExam')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FiPlus className="mr-2" /> Add New Exam
                  </h3>
                  {expandedSections.addExam ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.addExam && (
                  <div className="p-4 pt-0 space-y-3">
                    <div>
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
                    </div>
                    
                    <div>
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
                    </div>
                    
                    <div>
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
                    </div>
                    
                    <div>
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
                    </div>
                    
                    <div>
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
                    </div>
                    
                    <button
                      onClick={addExam}
                      disabled={!newExam.name || !newExam.date}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        (!newExam.name || !newExam.date) ? 
                          (darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : 
                          (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                      }`}
                    >
                      Add Exam
                    </button>
                  </div>
                )}
              </div>
              
              {/* Motivation Section */}
              <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('motivation')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FiBook className="mr-2" /> Motivation
                  </h3>
                  {expandedSections.motivation ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.motivation && (  
                  <div className="p-4 pt-0">
                    <div className={`p-3 rounded-lg italic ${darkMode ? 'bg-gray-600' : 'bg-white'} mb-2`}>
                      "{currentQuote}"
                    </div>
                    <button 
                      onClick={changeQuote}
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      New Quote
                    </button>
                  </div>
                )}
              </div>
              
              {/* Filters Section */}
              <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div 
                  className={`p-4 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  onClick={() => toggleSection('filters')}
                >
                  <h3 className="font-semibold flex items-center">
                    <FiFilter className="mr-2" /> Filters
                  </h3>
                  {expandedSections.filters ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.filters && (
                  <div className="p-4 pt-0 space-y-3">
                    <div>
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
                        <FiSearch className={`absolute left-2 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                    
                    <div>
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
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Exam Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveTab('upcoming')}
                          className={`py-2 rounded-lg font-medium text-sm ${
                            activeTab === 'upcoming' ? 
                              (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
                              (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                          }`}
                        >
                          Upcoming
                        </button>
                        <button
                          onClick={() => setActiveTab('past')}
                          className={`py-2 rounded-lg font-medium text-sm ${
                            activeTab === 'past' ? 
                              (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
                              (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                          }`}
                        >
                          Past
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main content - Exams List and Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Exams List */}
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">
                    {activeTab === 'upcoming' ? 'Upcoming Exams' : 'Past Exams'}
                  </h3>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {sortedExams.length} {sortedExams.length === 1 ? 'exam' : 'exams'} found
                  </div>
                </div>
                
                {sortedExams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortedExams.map(exam => {
                      const daysLeft = calculateDaysLeft(exam.date);
                      const isPast = daysLeft < 0;
                      
                      return (
                        <div 
                          key={exam.id} 
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
                                <div 
                                  className="h-full rounded-full ${
                                    exam.tasks.length > 0 ? 
                                      (exam.tasks.filter(t => t.completed).length / exam.tasks.length * 100 >= 75 ? 'bg-green-500' :
                                       exam.tasks.filter(t => t.completed).length / exam.tasks.length * 100 >= 50 ? 'bg-yellow-500' : 'bg-red-500') : 
                                      'bg-gray-400'
                                  }" 
                                  style={{ 
                                    width: `${exam.tasks.length > 0 ? 
                                      (exam.tasks.filter(t => t.completed).length / exam.tasks.length) * 100 : 
                                      0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <FiCalendar className="inline mr-1" /> {exam.date}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExam(exam.id);
                              }}
                              className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-500 hover:text-red-400' : 'text-gray-500 hover:bg-gray-200 hover:text-red-500'}`}
                              aria-label="Delete exam"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
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
                  </div>
                )}
              </div>
              
              {/* Exam Detail View */}
              {activeExam && (
                <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-xl">Edit Exam</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditMode(false)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Name
                          </label>
                          <input
                            type="text"
                            value={newExam.name}
                            onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Subject
                          </label>
                          <input
                            type="text"
                            value={newExam.subject}
                            onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Exam Date
                          </label>
                          <input
                            type="date"
                            value={newExam.date}
                            onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </div>
                        
                        <div>
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
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Notes
                          </label>
                          <textarea
                            value={newExam.notes}
                            onChange={(e) => setNewExam({...newExam, notes: e.target.value})}
                            rows="3"
                            className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          onClick={() => setEditMode(false)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updateExam}
                          className={`px-4 py-2 rounded-lg font-medium text-white ${
                            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-2xl">{activeExam.name}</h3>
                          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activeExam.subject}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
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
                          </button>
                          <button
                            onClick={() => deleteExam(activeExam.id)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'}`}
                            aria-label="Delete exam"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</div>
                          <div className="font-medium">
                            {new Date(activeExam.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Priority</div>
                          <div className="font-medium flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              darkMode ? `bg-${getPriorityColor(activeExam.priority)}-500` : `bg-${getPriorityColor(activeExam.priority)}-400`
                            }`} />
                            {getPriorityText(activeExam.priority)}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</div>
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
                        </div>
                      </div>
                      
                      {activeExam.notes && (
                        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p className="whitespace-pre-line">{activeExam.notes}</p>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg">Preparation Tasks</h4>
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
                          <div className="space-y-2">
                            {activeExam.tasks
                              .filter(task => showCompleted || !task.completed)
                              .map(task => (
                                <div 
                                  key={task.id} 
                                  className={`p-3 rounded-lg flex items-center ${
                                    darkMode ? 'bg-gray-600' : 'bg-white'
                                  } ${
                                    task.completed ? (darkMode ? 'opacity-70' : 'opacity-80') : ''
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleTask(activeExam.id, task.id)}
                                    className={`mr-3 flex-shrink-0 h-5 w-5 rounded flex items-center justify-center ${
                                      task.completed ? 
                                        (darkMode ? 'bg-green-500' : 'bg-green-400') : 
                                        (darkMode ? 'border border-gray-400' : 'border border-gray-300')
                                    }`}
                                  >
                                    {task.completed && <FiCheck className="text-white" size={14} />}
                                  </button>
                                  <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>
                                    {task.text}
                                  </span>
                                  <button
                                    onClick={() => deleteTask(activeExam.id, task.id)}
                                    className={`p-1 rounded-full ml-2 ${
                                      darkMode ? 'hover:bg-gray-500 text-gray-300' : 'hover:bg-gray-200 text-gray-500'
                                    }`}
                                    aria-label="Delete task"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              ))
                            }
                          </div>
                        ) : (
                          <div className={`text-center py-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tasks added yet</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Add New Task</h4>
                        <div className="flex space-x-2">
                          <input
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
                          <button
                            onClick={addTask}
                            disabled={!newTask.text || newTask.examId !== activeExam.id}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                              (!newTask.text || newTask.examId !== activeExam.id) ? 
                                (darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed') : 
                                (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                            }`}
                          >
                            Add Task
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCountdown;