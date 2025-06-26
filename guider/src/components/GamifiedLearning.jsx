import React, { useState } from 'react';

const GamifiedLearning = ({ darkMode }) => {
  const [userStats, setUserStats] = useState({
    level: 3,
    xp: 1250,
    nextLevelXp: 2000,
    badges: ['Fast Learner', 'Weekend Warrior', 'Early Bird'],
    streak: 5,
    missions: [
      { id: 1, title: 'Complete 5 flashcards', xp: 50, completed: true },
      { id: 2, title: 'Study for 30 minutes', xp: 100, completed: false },
      { id: 3, title: 'Take a quiz', xp: 75, completed: false },
      { id: 4, title: 'Read 3 articles', xp: 60, completed: false },
    ]
  });

  const completeMission = (id) => {
    setUserStats(prev => {
      const updatedMissions = prev.missions.map(mission => 
        mission.id === id ? { ...mission, completed: true } : mission
      );
      
      const newXp = prev.xp + prev.missions.find(m => m.id === id).xp;
      const newLevel = newXp >= prev.nextLevelXp ? prev.level + 1 : prev.level;
      const newNextLevelXp = newXp >= prev.nextLevelXp ? prev.nextLevelXp * 2 : prev.nextLevelXp;
      
      return {
        ...prev,
        level: newLevel,
        xp: newXp >= prev.nextLevelXp ? newXp - prev.nextLevelXp : newXp,
        nextLevelXp: newNextLevelXp,
        missions: updatedMissions
      };
    });
  };

  const xpPercentage = Math.min(100, (userStats.xp / userStats.nextLevelXp) * 100);

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Gamified Learning Missions</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Your Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Level {userStats.level}</span>
                  <span>{userStats.xp}/{userStats.nextLevelXp} XP</span>
                </div>
                <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-400'}`} 
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <p className="font-medium">Current Streak</p>
                <p className="text-2xl font-bold">{userStats.streak} days 🔥</p>
              </div>
              
              <div>
                <p className="font-medium mb-2">Badges Earned</p>
                <div className="flex flex-wrap gap-2">
                  {userStats.badges.map((badge, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Available Missions</h3>
            
            <div className="space-y-3">
              {userStats.missions.map(mission => (
                <div 
                  key={mission.id} 
                  className={`p-3 rounded flex items-center justify-between ${darkMode ? 'bg-gray-600' : 'bg-white'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                >
                  <div>
                    <h4 className="font-medium">{mission.title}</h4>
                    <p className="text-sm mt-1">
                      Reward: <span className="font-semibold">{mission.xp} XP</span>
                    </p>
                  </div>
                  
                  {mission.completed ? (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'}`}>
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => completeMission(mission.id)}
                      className={`px-3 py-1 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm`}
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Leaderboard (Top 5)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b`}>
                    <th className="text-left p-2">Rank</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Level</th>
                    <th className="text-left p-2">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'Alex Johnson', level: 12, xp: 4500 },
                    { rank: 2, name: 'Sam Wilson', level: 11, xp: 3800 },
                    { rank: 3, name: 'Taylor Smith', level: 10, xp: 3200 },
                    { rank: 4, name: 'Jordan Lee', level: 9, xp: 2800 },
                    { rank: 5, name: 'You', level: userStats.level, xp: userStats.xp }
                  ].map((player, index) => (
                    <tr 
                      key={index} 
                      className={`${darkMode ? 'border-gray-600' : 'border-gray-300'} border-b ${player.rank === 5 ? (darkMode ? 'bg-gray-600' : 'bg-gray-200') : ''}`}
                    >
                      <td className="p-2">{player.rank}</td>
                      <td className="p-2">{player.name}</td>
                      <td className="p-2">{player.level}</td>
                      <td className="p-2">{player.xp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamifiedLearning;