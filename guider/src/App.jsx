import { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudyTracker from './components/StudyTracker';
import StudyPlanner from './components/StudyPlanner';
import NotesOrganizer from './components/NotesOrganizer';
import QuizMaker from './components/QuizMaker';
import ResourcesHub from './components/ResourcesHub';
import DiscussionForum from './components/DiscussionForum';
import ReadingTrainer from './components/ReadingTrainer';
import ExamCountdown from './components/ExamCountdown';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeComponent, setActiveComponent] = useState('StudyTracker');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderComponent = () => {
    switch (activeComponent) {

      case 'StudyTracker': return <StudyTracker darkMode={darkMode} />;
      case 'StudyPlanner': return <StudyPlanner darkMode={darkMode} />;
      case 'NotesOrganizer': return <NotesOrganizer darkMode={darkMode} />;
      case 'QuizMaker': return <QuizMaker darkMode={darkMode} />;
      case 'ResourcesHub': return <ResourcesHub darkMode={darkMode} />;
      case 'DiscussionForum': return <DiscussionForum darkMode={darkMode} />;
      case 'ReadingTrainer': return <ReadingTrainer darkMode={darkMode} />;
      case 'ExamCountdown': return <ExamCountdown darkMode={darkMode} />;
      default: return <StudyTracker darkMode={darkMode} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        setActiveComponent={setActiveComponent}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;