import React, { useState, useEffect } from 'react';
import { FiAward, FiClock, FiStar, FiTrendingUp, FiCheckCircle, FiZap } from 'react-icons/fi';
import { FaFire, FaCrown, FaMedal, FaTrophy } from 'react-icons/fa';

const GamifiedLearning = ({ darkMode }) => {
  const [userStats, setUserStats] = useState({
    level: 3,
    xp: 1250,
    nextLevelXp: 2000,
    badges: [
      { name: 'Fast Learner', icon: <FiTrendingUp />, earned: '2023-05-15' },
      { name: 'Weekend Warrior', icon: <FiClock />, earned: '2023-06-20' },
      { name: 'Early Bird', icon: <FiStar />, earned: '2023-07-01' },
      { name: 'Quiz Master', icon: <FiCheckCircle />, earned: null },
    ],
    streak: 5,
    lastActive: new Date().toISOString(),
    missions: [
      { id: 1, title: 'Complete 5 flashcards', xp: 50, completed: true, type: 'flashcard' },
      { id: 2, title: 'Study for 30 minutes', xp: 100, completed: false, type: 'time' },
      { id: 3, title: 'Take a quiz', xp: 75, completed: false, type: 'quiz' },
      { id: 4, title: 'Read 3 articles', xp: 60, completed: false, type: 'reading' },
      { id: 5, title: 'Complete all daily missions', xp: 150, completed: false, type: 'combo' },
    ],
    achievements: [
      { id: 1, title: 'First Steps', description: 'Complete your first mission', xp: 100, completed: true },
      { id: 2, title: 'Streak Builder', description: 'Maintain a 7-day streak', xp: 250, completed: false },
      { id: 3, title: 'Overachiever', description: 'Complete all daily missions', xp: 300, completed: false },
    ]
  });

  const [activeTab, setActiveTab] = useState('missions');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  // Check streak daily
  useEffect(() => {
    const lastActive = new Date(userStats.lastActive);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActive.toDateString() === yesterday.toDateString()) {
      // Continue streak
      setUserStats(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActive: today.toISOString()
      }));
    } else if (lastActive.toDateString() !== today.toDateString()) {
      // Reset streak if not consecutive
      setUserStats(prev => ({
        ...prev,
        streak: 1,
        lastActive: today.toISOString()
      }));
    }
  }, []);

  const completeMission = (id) => {
    setUserStats(prev => {
      const mission = prev.missions.find(m => m.id === id);
      const updatedMissions = prev.missions.map(m => 
        m.id === id ? { ...m, completed: true } : m
      );
      
      let newXp = prev.xp + mission.xp;
      let newLevel = prev.level;
      let newNextLevelXp = prev.nextLevelXp;
      let leveledUp = false;
      
      // Check for level up
      if (newXp >= prev.nextLevelXp) {
        newLevel = prev.level + 1;
        newNextLevelXp = Math.floor(prev.nextLevelXp * 1.5);
        newXp = newXp - prev.nextLevelXp;
        leveledUp = true;
      }
      
      // Check for new badges
      let newBadges = [...prev.badges];
      let badgeUnlocked = null;
      
      // Check for Quiz Master badge
      if (mission.type === 'quiz' && !newBadges.some(b => b.name === 'Quiz Master')) {
        newBadges = newBadges.map(b => 
          b.name === 'Quiz Master' ? { ...b, earned: new Date().toISOString().split('T')[0] } : b
        );
        badgeUnlocked = 'Quiz Master';
      }
      
      // Check for combo mission completion
      if (id === 5 && !newBadges.some(b => b.name === 'Daily Champion')) {
        newBadges.push({ name: 'Daily Champion', icon: <FaTrophy />, earned: new Date().toISOString().split('T')[0] });
        badgeUnlocked = 'Daily Champion';
      }
      
      // Check achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 3 && updatedMissions.every(m => m.completed) && !ach.completed) {
          return { ...ach, completed: true };
        }
        return ach;
      });
      
      const newState = {
        ...prev,
        level: newLevel,
        xp: newXp,
        nextLevelXp: newNextLevelXp,
        missions: updatedMissions,
        badges: newBadges,
        achievements: updatedAchievements
      };
      
      if (leveledUp) {
        setTimeout(() => setShowLevelUp(true), 300);
      }
      
      if (badgeUnlocked) {
        setTimeout(() => setNewBadge(badgeUnlocked), 500);
      }
      
      return newState;
    });
  };

  const xpPercentage = Math.min(100, (userStats.xp / userStats.nextLevelXp) * 100);
  const streakBonus = Math.min(20, userStats.streak * 2); // Max 20% bonus

  const getMissionIcon = (type) => {
    switch(type) {
      case 'flashcard': return <FiAward className="mr-2" />;
      case 'time': return <FiClock className="mr-2" />;
      case 'quiz': return <FiCheckCircle className="mr-2" />;
      case 'reading': return <FiStar className="mr-2" />;
      case 'combo': return <FaMedal className="mr-2" />;
      default: return <FiZap className="mr-2" />;
    }
  };

  const leaderboardData = [
    { rank: 1, name: 'Alex Johnson', level: 12, xp: 4500, avatar: 'AJ', isCurrent: false },
    { rank: 2, name: 'Sam Wilson', level: 11, xp: 3800, avatar: 'SW', isCurrent: false },
    { rank: 3, name: 'Taylor Smith', level: 10, xp: 3200, avatar: 'TS', isCurrent: false },
    { rank: 4, name: 'Jordan Lee', level: 9, xp: 2800, avatar: 'JL', isCurrent: false },
    { rank: 5, name: 'You', level: userStats.level, xp: userStats.xp, avatar: 'YO', isCurrent: true }
  ];

  return (
    <div className={`p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-lg`}>
      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} text-center animate-bounce`}>
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Level Up!</h3>
            <p className="mb-4">Congratulations! You've reached level {userStats.level}</p>
            <button 
              onClick={() => setShowLevelUp(false)}
              className={`px-6 py-2 cursor-pointer rounded-full font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
      
      {/* New Badge Modal */}
      {newBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-8 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} text-center animate-pulse`}>
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2">New Badge Unlocked!</h3>
            <p className="text-xl font-semibold mb-4 text-yellow-500">{newBadge}</p>
            <button 
              onClick={() => setNewBadge(null)}
              className={`px-6 py-2 cursor-pointer rounded-full font-medium ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FiZap className="mr-2 text-yellow-500" /> Gamified Learning
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow`}>
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4 
                ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                YO
              </div>
              <div>
                <h3 className="font-bold text-lg">Your Profile</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active learner</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Level Progress */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Level {userStats.level}</span>
                  <span className="text-sm">{userStats.xp}/{userStats.nextLevelXp} XP</span>
                </div>
                <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500`} 
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* Streak */}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                <p className="font-medium flex items-center">
                  <FaFire className={`mr-2 ${userStats.streak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                  Current Streak
                </p>
                <p className="text-2xl font-bold mt-1">
                  {userStats.streak} day{userStats.streak !== 1 ? 's' : ''} 
                  {userStats.streak > 0 && ' 🔥'}
                </p>
                {userStats.streak > 0 && (
                  <p className="text-sm mt-1">
                    +{streakBonus}% XP bonus (max 20%)
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow`}>
            <h3 className="font-semibold mb-3 flex items-center">
              <FiAward className="mr-2" /> Badges Earned
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {userStats.badges.map((badge, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg flex flex-col items-center text-center ${badge.earned ? 
                    (darkMode ? 'bg-yellow-800 text-yellow-100' : 'bg-yellow-100 text-yellow-800') : 
                    (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500')}`}
                >
                  <div className="text-2xl mb-1">
                    {badge.earned ? badge.icon : <FiAward />}
                  </div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  {badge.earned && (
                    <p className="text-xs mt-1 opacity-70">Earned {badge.earned}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Missions and Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className={`flex border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('missions')}
              className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'missions' ? 
                (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            >
              Missions
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'achievements' ? 
                (darkMode ? 'text-purple-400 border-b-2 border-purple-400' : 'text-purple-600 border-b-2 border-purple-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'leaderboard' ? 
                (darkMode ? 'text-green-400 border-b-2 border-green-400' : 'text-green-600 border-b-2 border-green-600') : 
                (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            >
              Leaderboard
            </button>
          </div>
          
          {/* Tab Content */}
      {activeTab === 'missions' && (
  <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow`}>
    <h3 className="font-semibold mb-4 flex items-center">
      <FiZap className="mr-2 text-yellow-500" /> Daily Missions
    </h3>

    <div className="space-y-3">
      {userStats.missions.map((mission) => (
        <div
          key={mission.id}
          className={`p-4 rounded-lg flex items-center justify-between transition-all ${
            darkMode ? 'bg-gray-600' : 'bg-white'
          } border ${darkMode ? 'border-gray-500' : 'border-gray-200'} ${
            mission.completed ? 'opacity-80' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-center">
            <div
              className={`mr-4 text-xl ${
                mission.completed
                  ? 'text-green-500'
                  : darkMode
                  ? 'text-blue-400'
                  : 'text-blue-500'
              }`}
            >
              {getMissionIcon(mission.type)}
            </div>
            <div>
              <h4 className={`font-medium ${mission.completed && 'line-through'}`}>
                {mission.title}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Reward: <span className="font-semibold">{mission.xp} XP</span>
              </p>
            </div>
          </div>

          {mission.completed ? (
            <span
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'
              }`}
            >
              <FiCheckCircle className="mr-1" /> Completed
            </span>
          ) : (
            <button
              onClick={() => completeMission(mission.id)}
              className={`px-4 py-2 cursor-pointer rounded-lg flex items-center ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white text-sm font-medium transition-colors`}
            >
              <FiCheckCircle className="mr-1" /> Complete
            </button>
          )}
        </div>
      ))}
    </div>

    <div className="mt-6">
      <h4 className="font-medium mb-2">Daily Progress</h4>
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 mr-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{
              width: `${(userStats.missions.filter((m) => m.completed).length / userStats.missions.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-sm font-medium">
          {userStats.missions.filter((m) => m.completed).length}/{userStats.missions.length} completed
        </span>
      </div>
    </div>
  </div>
)}
          
          {activeTab === 'achievements' && (
            <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow`}>
              <h3 className="font-semibold mb-4 flex items-center">
                <FaMedal className="mr-2 text-yellow-500" /> Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userStats.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${achievement.completed ? 
                      (darkMode ? 'bg-yellow-800 border-yellow-700' : 'bg-yellow-100 border-yellow-200') : 
                      (darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200')}`}
                  >
                    <div className="flex items-start">
                      <div className={`mr-3 text-2xl ${achievement.completed ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {achievement.completed ? <FaMedal /> : <FaMedal className="opacity-30" />}
                      </div>
                      <div>
                        <h4 className={`font-medium ${!achievement.completed && 'opacity-70'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ${!achievement.completed && 'opacity-70'}`}>
                          {achievement.description}
                        </p>
                        <p className="text-xs mt-2 font-medium">
                          {achievement.completed ? (
                            <span className="text-green-500">+{achievement.xp} XP earned</span>
                          ) : (
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>+{achievement.xp} XP</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'leaderboard' && (
            <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow`}>
              <h3 className="font-semibold mb-4 flex items-center">
                <FaCrown className="mr-2 text-yellow-500" /> Weekly Leaderboard
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b`}>
                      <th className="text-left p-3">Rank</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Level</th>
                      <th className="text-left p-3">XP</th>
                      <th className="text-left p-3">Badges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player, index) => (
                      <tr 
                        key={index} 
                        className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b ${player.isCurrent ? (darkMode ? 'bg-gray-600' : 'bg-gray-100') : ''}`}
                      >
                        <td className="p-3">
                          <div className="flex items-center">
                            {player.rank === 1 ? (
                              <FaCrown className="text-yellow-500 mr-2" />
                            ) : player.rank === 2 ? (
                              <FaMedal className="text-gray-400 mr-2" />
                            ) : player.rank === 3 ? (
                              <FaMedal className="text-yellow-700 mr-2" />
                            ) : (
                              <span className="w-5 mr-2 text-center">{player.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 
                              ${player.isCurrent ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
                              (darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-300 text-gray-700')}`}>
                              {player.avatar}
                            </div>
                            {player.name}
                          </div>
                        </td>
                        <td className="p-3">{player.level}</td>
                        <td className="p-3">{player.xp}</td>
                        <td className="p-3">
                          <div className="flex">
                            {Array(Math.min(3, player.level)).fill().map((_, i) => (
                              <FiAward 
                                key={i} 
                                className={`text-sm ${i < player.rank ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm italic">
                  {leaderboardData.find(p => p.isCurrent).rank === 1 ? 
                    "You're in first place! Keep it up!" : 
                    `You're ${leaderboardData.find(p => p.isCurrent).rank}${['st','nd','rd','th'][Math.min(3, leaderboardData.find(p => p.isCurrent).rank-1)]} place`}
                </p>
                <button 
                  className={`px-3 py-1 cursor-pointer text-sm rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  View Full Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamifiedLearning;