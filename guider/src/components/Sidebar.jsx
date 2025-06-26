import { useState } from 'react';
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiFileText,
  FiHelpCircle,
  FiAward,
  FiUsers,
  FiClock,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiBookmark,
  FiPieChart,
  FiLayers
} from 'react-icons/fi';

const Sidebar = ({ darkMode, toggleDarkMode, setActiveComponent }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('FlashcardApp');

  const menuItems = [
    { name: 'FlashcardApp', label: 'Smart Flashcard', icon: <FiBookmark size={18} /> },
    { name: 'StudyTracker', label: 'Study Tracker', icon: <FiPieChart size={18} /> },
    { name: 'StudyPlanner', label: 'Study Planner', icon: <FiCalendar size={18} /> },
    { name: 'NotesOrganizer', label: 'Notes Organizer', icon: <FiFileText size={18} /> },
    { name: 'QuizMaker', label: 'Quiz Maker', icon: <FiHelpCircle size={18} /> },
    { name: 'ResourcesHub', label: 'Study Resources', icon: <FiBook size={18} /> },
    { name: 'GamifiedLearning', label: 'Gamified Learning', icon: <FiAward size={18} /> },
    { name: 'DiscussionForum', label: 'Peer Study', icon: <FiUsers size={18} /> },
    { name: 'ReadingTrainer', label: 'Reading Comprehension', icon: <FiLayers size={18} /> },
    { name: 'ExamCountdown', label: 'Exam Countdown', icon: <FiClock size={18} /> },
  ];

  const handleItemClick = (name) => {
    setActiveItem(name);
    setActiveComponent(name);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'justify-between p-4'}`}>
            {!isCollapsed && (
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Student Learning</h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 cursor-pointer rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleItemClick(item.name)}
                    className={`flex cursor-pointer items-center w-full p-3 rounded-lg transition-colors ${
                      activeItem === item.name
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`${isCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                    U
                  </div>
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>User</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 cursor-pointer rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div
          className={`flex items-center justify-between p-4 shadow-sm ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
          }`}
        >
        </div>

        {/* Page Content would go here */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Your main content would be rendered here based on activeComponent */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;