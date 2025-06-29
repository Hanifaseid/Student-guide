import React, { useState } from 'react';
import { FiClock, FiBook, FiCalendar, FiPlus, FiTrendingUp } from 'react-icons/fi';

const StudyTracker = ({ darkMode }) => {
  const [studyLogs, setStudyLogs] = useState([
    { date: '2023-05-01', subject: 'Math', duration: 120 },
    { date: '2023-05-02', subject: 'Science', duration: 90 },
    { date: '2023-05-03', subject: 'History', duration: 60 },
    { date: '2023-05-04', subject: 'Math', duration: 180 },
  ]);

  const subjects = [...new Set(studyLogs.map(log => log.subject))];
  const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

  // Color palette
  const colors = {
    primary: darkMode ? 'rgb(99, 102, 241)' : 'rgb(79, 70, 229)',
    cardBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    cardHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-600' : 'border-gray-200',
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-2`}>
          Study Tracker Dashboard
        </h2>
        <button 
          className={`flex items-center gap-1 px-4 py-2 rounded-md ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition-colors`}
        >
          <FiPlus /> Add Session
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-lg ${colors.cardBg} ${colors.cardHover} shadow-md transition-all duration-300 group border ${colors.border} flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${colors.secondaryText}`}>Total Study Time</h3>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} text-indigo-500`}>
              <FiClock size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>{totalHours.toFixed(1)} hours</p>
          <p className={`text-sm ${colors.secondaryText} mt-auto`}>Across all subjects</p>
        </div>
        
        <div className={`p-6 rounded-lg ${colors.cardBg} ${colors.cardHover} shadow-md transition-all duration-300 group border ${colors.border} flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${colors.secondaryText}`}>Subjects</h3>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} text-indigo-500`}>
              <FiBook size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>{subjects.length}</p>
          <p className={`text-sm ${colors.secondaryText} mt-auto`}>Unique subjects studied</p>
        </div>
        
        <div className={`p-6 rounded-lg ${colors.cardBg} ${colors.cardHover} shadow-md transition-all duration-300 group border ${colors.border} flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${colors.secondaryText}`}>Study Sessions</h3>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} text-indigo-500`}>
              <FiCalendar size={20} />
            </div>
          </div>
          <p className={`text-3xl font-bold ${colors.text} mb-2`}>{studyLogs.length}</p>
          <p className={`text-sm ${colors.secondaryText} mt-auto`}>Total sessions logged</p>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className={`p-6 rounded-lg ${colors.cardBg} shadow-md border ${colors.border}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-semibold text-lg ${colors.text}`}>Recent Study Sessions</h3>
          <button className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}>
            View All
          </button>
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
                <tr 
                  key={index} 
                  className={`${colors.border} border-b ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`p-3 ${colors.text}`}>{log.date}</td>
                  <td className={`p-3 ${colors.text} font-medium`}>{log.subject}</td>
                  <td className={`p-3 ${colors.text}`}>{log.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudyTracker;