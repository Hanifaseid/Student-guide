import React, { useState } from 'react';

const DiscussionForum = ({ darkMode }) => {
  const [topics, setTopics] = useState([
    { 
      id: 1, 
      title: 'How to solve this math problem?', 
      author: 'Alex', 
      subject: 'Math', 
      date: '2023-05-10', 
      content: "I'm stuck on problem 5 in chapter 3. Can anyone help explain how to approach it?", 
      replies: [
        { id: 1, author: 'Sam', date: '2023-05-11', content: 'Have you tried using the quadratic formula?', upvotes: 3 },
        { id: 2, author: 'Taylor', date: '2023-05-11', content: 'I think you need to factor it first.', upvotes: 1 }
      ],
      upvotes: 5
    },
    { 
      id: 2, 
      title: 'Best resources for learning React', 
      author: 'Jordan', 
      subject: 'Programming', 
      date: '2023-05-08', 
      content: "I'm just starting with React. What are the best tutorials or documentation to learn from?", 
      replies: [
        { id: 3, author: 'Casey', date: '2023-05-09', content: 'The official React docs are great!', upvotes: 2 }
      ],
      upvotes: 8
    }
  ]);
  
  const [newTopic, setNewTopic] = useState({ 
    title: '', 
    subject: '', 
    content: '' 
  });
  
  const [newReply, setNewReply] = useState({ 
    content: '', 
    topicId: null 
  });
  
  const [activeTopic, setActiveTopic] = useState(null);

  const addTopic = () => {
    if (newTopic.title && newTopic.subject && newTopic.content) {
      const topic = { 
        ...newTopic, 
        id: Date.now(), 
        author: 'You', 
        date: new Date().toISOString().split('T')[0], 
        replies: [], 
        upvotes: 0 
      };
      setTopics([...topics, topic]);
      setNewTopic({ title: '', subject: '', content: '' });
    }
  };

  const addReply = () => {
    if (newReply.content && newReply.topicId) {
      const reply = { 
        id: Date.now(), 
        author: 'You', 
        date: new Date().toISOString().split('T')[0], 
        content: newReply.content, 
        upvotes: 0 
      };
      
      setTopics(topics.map(topic => 
        topic.id === newReply.topicId ? 
          { ...topic, replies: [...topic.replies, reply] } : 
          topic
      ));
      
      setNewReply({ content: '', topicId: null });
    }
  };

  const upvoteTopic = (id) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, upvotes: topic.upvotes + 1 } : topic
    ));
  };

  const upvoteReply = (topicId, replyId) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? 
        { 
          ...topic, 
          replies: topic.replies.map(reply => 
            reply.id === replyId ? { ...reply, upvotes: reply.upvotes + 1 } : reply
          ) 
        } : 
        topic
    ));
  };

  const subjects = [...new Set(topics.map(topic => topic.subject))];

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Peer Study Discussion Forum</h2>
      
      {!activeTopic ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
              <h3 className="font-semibold mb-3">Discussion Topics</h3>
              
              {topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map(topic => (
                    <div 
                      key={topic.id} 
                      className={`p-4 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                      onClick={() => setActiveTopic(topic)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg">{topic.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            upvoteTopic(topic.id);
                          }}
                          className={`flex items-center space-x-1 px-2 py-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                        >
                          <span>▲</span>
                          <span>{topic.upvotes}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center text-sm mt-1 mb-2">
                        <span className={`px-2 py-1 rounded mr-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                          {topic.subject}
                        </span>
                        <span>by {topic.author} on {topic.date}</span>
                      </div>
                      
                      <p className="text-sm line-clamp-2">{topic.content}</p>
                      
                      <div className="flex items-center text-sm mt-2">
                        <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                          {topic.replies.length} replies
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">No discussion topics yet</p>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-3">Start New Topic</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                  placeholder="Topic title"
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                />
                
                <select
                  value={newTopic.subject}
                  onChange={(e) => setNewTopic({...newTopic, subject: e.target.value})}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                  <option value="new">+ Add new subject</option>
                </select>
                
                {newTopic.subject === 'new' && (
                  <input
                    type="text"
                    value={newTopic.newSubject || ''}
                    onChange={(e) => setNewTopic({...newTopic, subject: e.target.value})}
                    placeholder="Enter new subject"
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                  />
                )}
                
                <textarea
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                  placeholder="Your question or discussion topic"
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                  rows="4"
                />
                
                <button
                  onClick={addTopic}
                  disabled={!newTopic.title || !newTopic.subject || !newTopic.content}
                  className={`px-4 py-2 rounded ${(!newTopic.title || !newTopic.subject || !newTopic.content) ? 
                    (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                    (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
                >
                  Post Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveTopic(null)}
            className={`mb-4 px-3 py-1 rounded flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            ← Back to topics
          </button>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-xl">{activeTopic.title}</h3>
              <button
                onClick={() => upvoteTopic(activeTopic.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              >
                <span>▲</span>
                <span>{activeTopic.upvotes}</span>
              </button>
            </div>
            
            <div className="flex items-center text-sm mt-1 mb-3">
              <span className={`px-2 py-1 rounded mr-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                {activeTopic.subject}
              </span>
              <span>by {activeTopic.author} on {activeTopic.date}</span>
            </div>
            
            <div className={`p-3 rounded mb-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <p>{activeTopic.content}</p>
            </div>
            
            <h4 className="font-semibold mb-3">Replies ({activeTopic.replies.length})</h4>
            
            {activeTopic.replies.length > 0 ? (
              <div className="space-y-4">
                {activeTopic.replies.map(reply => (
                  <div 
                    key={reply.id} 
                    className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{reply.author}</p>
                        <p className="text-xs text-gray-500">{reply.date}</p>
                      </div>
                      <button
                        onClick={() => upvoteReply(activeTopic.id, reply.id)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                      >
                        <span>▲</span>
                        <span>{reply.upvotes}</span>
                      </button>
                    </div>
                    <p className="mt-2">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No replies yet</p>
            )}
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Post a Reply</h4>
              <textarea
                value={newReply.topicId === activeTopic.id ? newReply.content : ''}
                onChange={(e) => setNewReply({
                  content: e.target.value,
                  topicId: activeTopic.id
                })}
                placeholder="Your reply..."
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                rows="3"
              />
              <button
                onClick={addReply}
                disabled={!newReply.content || newReply.topicId !== activeTopic.id}
                className={`mt-2 px-4 py-2 rounded ${(!newReply.content || newReply.topicId !== activeTopic.id) ? 
                  (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                  (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;