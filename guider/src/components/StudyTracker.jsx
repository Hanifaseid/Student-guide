import React, { useState } from 'react';

const StudyTracker = ({ darkMode }) => {
  const [studyLogs, setStudyLogs] = useState([
    { date: '2023-05-01', subject: 'Math', duration: 120 },
    { date: '2023-05-02', subject: 'Science', duration: 90 },
    { date: '2023-05-03', subject: 'History', duration: 60 },
    { date: '2023-05-04', subject: 'Math', duration: 180 },
  ]);

  const subjects = [...new Set(studyLogs.map(log => log.subject))];
  const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Study Tracker Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-2">Total Study Time</h3>
          <p className="text-3xl font-bold">{totalHours.toFixed(1)} hours</p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-2">Subjects</h3>
          <p className="text-3xl font-bold">{subjects.length}</p>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-2">Study Sessions</h3>
          <p className="text-3xl font-bold">{studyLogs.length}</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
        <h3 className="font-semibold mb-3">Recent Study Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b`}>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Subject</th>
                <th className="text-left p-2">Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {studyLogs.map((log, index) => (
                <tr key={index} className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b`}>
                  <td className="p-2">{log.date}</td>
                  <td className="p-2">{log.subject}</td>
                  <td className="p-2">{log.duration}</td>
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