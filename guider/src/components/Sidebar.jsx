const Sidebar = ({ darkMode, toggleDarkMode, setActiveComponent }) => {
  const menuItems = [
    { name: 'FlashcardApp', label: 'Smart Flashcard App' },
    { name: 'StudyTracker', label: 'Study Tracker Dashboard' },
    { name: 'StudyPlanner', label: 'Personalized Study Planner' },
    { name: 'NotesOrganizer', label: 'Interactive Notes Organizer' },
    { name: 'QuizMaker', label: 'Quiz Maker & Practice Platform' },
    { name: 'ResourcesHub', label: 'Study Resources Hub' },
    { name: 'GamifiedLearning', label: 'Gamified Learning Missions' },
    { name: 'DiscussionForum', label: 'Peer Study Discussion Forum' },
    { name: 'ReadingTrainer', label: 'Reading Comprehension Trainer' },
    { name: 'ExamCountdown', label: 'Exam Countdown & Motivation Wall' },
  ];

  return (
    <div className={`w-64 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold">Student Learning</h1>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActiveComponent(item.name)}
                className={`w-full text-left p-2 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;