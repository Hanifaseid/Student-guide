import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiThumbsUp, FiMessageSquare, FiSearch, FiPlus, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
const DiscussionForum  = ({ darkMode = true }) => {

  const [topics, setTopics] = useState([
    { 
      id: 1, 
      title: 'How to solve this math problem?', 
      author: 'Alex', 
      authorAvatar: 'A', 
      subject: 'Math', 
      date: '2023-05-10', 
      content: "I'm stuck on problem 5 in chapter 3. Can anyone help explain how to approach it? The problem is about quadratic equations and I'm not sure how to factor it properly.", 
      replies: [
        { id: 1, author: 'Sam', authorAvatar: 'S', date: '2023-05-11', content: 'Have you tried using the quadratic formula? It might be easier than factoring in this case.', upvotes: 3 },
        { id: 2, author: 'Taylor', authorAvatar: 'T', date: '2023-05-11', content: 'I think you need to factor it first. Look for two numbers that multiply to the last term and add to the middle coefficient.', upvotes: 1 }
      ],
      upvotes: 5,
      views: 124,
      tags: ['algebra', 'quadratic']
    },
    { 
      id: 2, 
      title: 'Best resources for learning React', 
      author: 'Jordan', 
      authorAvatar: 'J', 
      subject: 'Programming', 
      date: '2023-05-08', 
      content: "I'm just starting with React. What are the best tutorials or documentation to learn from? I prefer interactive tutorials if possible.", 
      replies: [
        { id: 3, author: 'Casey', authorAvatar: 'C', date: '2023-05-09', content: 'The official React docs are great, especially the new beta docs with interactive examples!', upvotes: 2 },
        { id: 4, author: 'Riley', authorAvatar: 'R', date: '2023-05-10', content: 'I recommend Scrimba for interactive learning. Their free React course is excellent.', upvotes: 5 }
      ],
      upvotes: 8,
      views: 89,
      tags: ['react', 'frontend']
    },
    { 
      id: 3, 
      title: 'History paper topic suggestions', 
      author: 'Morgan', 
      authorAvatar: 'M', 
      subject: 'History', 
      date: '2023-05-12', 
      content: "Need ideas for my 10-page history paper on 20th century political movements. Any interesting angles or under-researched topics?", 
      replies: [],
      upvotes: 2,
      views: 42,
      tags: ['20th-century', 'politics']
    }
  ]);
  
  const [newTopic, setNewTopic] = useState({ 
    title: '', 
    subject: '', 
    content: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  
  const [newReply, setNewReply] = useState({ 
    content: '', 
    topicId: null 
  });
  
  const [activeTopic, setActiveTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addTopic = () => {
    if (newTopic.title && newTopic.subject && newTopic.content) {
      const topic = { 
        ...newTopic, 
        id: Date.now(), 
        author: 'You', 
        authorAvatar: 'Y', 
        date: new Date().toISOString().split('T')[0], 
        replies: [], 
        upvotes: 0,
        views: 0,
        tags: newTopic.tags
      };
      setTopics([topic, ...topics]);
      setNewTopic({ title: '', subject: '', content: '', tags: [] });
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const addTag = () => {
    if (newTag && !newTopic.tags.includes(newTag.toLowerCase())) {
      setNewTopic({
        ...newTopic,
        tags: [...newTopic.tags, newTag.toLowerCase()]
      });
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTopic({
      ...newTopic,
      tags: newTopic.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addReply = () => {
    if (newReply.content && newReply.topicId) {
      const reply = { 
        id: Date.now(), 
        author: 'You', 
        authorAvatar: 'Y', 
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

  const toggleReplyExpansion = (replyId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'most-upvotes') {
      return b.upvotes - a.upvotes;
    } else if (sortBy === 'most-replies') {
      return b.replies.length - a.replies.length;
    }
    return 0;
  });

  const subjects = ['all', ...new Set(topics.map(topic => topic.subject))];
  const allTags = [...new Set(topics.flatMap(topic => topic.tags))];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
<div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} pt-8`}>
  <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold flex items-center">
        <FiMessageSquare className="mr-2" />
        Peer Study Forum
      </h1>
    </div>
  </div>

  {/* Other page content goes here */}


      <div className="container mx-auto px-4 py-8">
        {!activeTopic ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm mb-6`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search topics..."
                      className={`w-full pl-10 pr-4 py-2.5 cursor-pointer rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-[120px]">
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer`}
                      >
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject === 'all' ? 'All Subjects' : subject}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiChevronDown />
                      </div>
                    </div>
                    <div className="relative flex-1 min-w-[140px]">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer`}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most-upvotes">Most Upvotes</option>
                        <option value="most-replies">Most Replies</option>
                      </select>
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiChevronDown />
                      </div>
                    </div>
                  </div>
                </div>

                {sortedTopics.length > 0 ? (
                  <div className="space-y-4">
                    {sortedTopics.map(topic => (
                      <div 
                        key={topic.id} 
                        className={`p-5 rounded-xl transition-all hover:shadow-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-white hover:bg-gray-50 border-gray-200'} border cursor-pointer`}
                        onClick={() => {
                          setActiveTopic(topic);
                          setTopics(topics.map(t => 
                            t.id === topic.id ? { ...t, views: t.views + 1 } : t
                          ));
                        }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg mb-1.5">{topic.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                              <span className={`px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
                                {topic.subject}
                              </span>
                              {topic.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <p className={`text-sm line-clamp-2 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {topic.content}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                upvoteTopic(topic.id);
                              }}
                              className={`flex flex-col cursor-pointer items-center p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                            >
                              <FiThumbsUp className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                              <span className="text-xs mt-1">{topic.upvotes}</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                              {topic.authorAvatar}
                            </div>
                            <span>{topic.author}</span>
                            <span className="mx-2">•</span>
                            <span>{topic.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              <FiMessageSquare className="mr-1.5" />
                              {topic.replies.length}
                            </span>
                            <span>👁️ {topic.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-10 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-lg mb-2">No discussion topics found</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Try adjusting your search or create a new topic
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className={`sticky top-24 p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FiPlus className="mr-2" />
                  Start New Topic
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                      placeholder="Enter topic title"
                      className={`w-full p-2.5 cursor-pointer rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        value={newTopic.subject}
                        onChange={(e) => setNewTopic({...newTopic, subject: e.target.value})}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer`}
                      >
                        <option value="">Select subject</option>
                        {subjects.filter(s => s !== 'all').map((subject, index) => (
                          <option key={index} value={subject}>{subject}</option>
                        ))}
                        <option value="new">+ Add new subject</option>
                      </select>
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiChevronDown />
                      </div>
                    </div>
                  </div>
                  
                  {newTopic.subject === 'new' && (
                    <div>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        New Subject
                      </label>
                      <input
                        type="text"
                        onChange={(e) => setNewTopic({...newTopic, subject: e.target.value})}
                        placeholder="Enter new subject"
                        className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                      />
                    </div>
                  )}
                  
                 <div>
  <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Tags
  </label>
  <div className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
    <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
      {newTopic.tags.map((tag, index) => (
        <div 
          key={index} 
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
        >
          #{tag}
          <button 
            onClick={() => removeTag(tag)}
            className="ml-1.5 cursor-pointer hover:text-red-400"
            type="button"
          >
            <FiX size={12} />
          </button>
        </div>
      ))}
    </div>

    {showTagInput ? (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add tag..."
          className={`flex-grow p-2 w-full h-full box-border overflow-hiddenrounded-lg border
          ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          autoFocus
        />
       
      </div>
    ) : (
      <button
        onClick={() => setShowTagInput(true)}
        className={`text-sm cursor-pointer flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
        type="button"
      >
        <FiPlus className="mr-1" />
        Add tag
      </button>
    )}
  </div>
</div>
                  
                  <div>
                    <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Content
                    </label>
                    <textarea
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                      placeholder="Your question or discussion topic (markdown supported)"
                      className={`w-full p-2.5 cursor-pointer rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                      rows="5"
                    />
                  </div>
                  
                <button
                  onClick={addTopic}
                  disabled={!newTopic.title || !newTopic.subject || !newTopic.content}
                  className={`w-full py-2.5 cursor-pointer rounded-lg font-bolder bg-gray-500 hover:bg-gray-600 text-lg transition-all ${
                    (!newTopic.title || !newTopic.subject || !newTopic.content)
                      ? (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed')
                      : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')
                  } text-white shadow-md`}
                >
                  Post Topic
                </button>

                </div>
              </div>

              <div className={`mt-4 p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
                <h3 className="font-semibold text-lg mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag, index) => (
                    <span 
                      key={index} 
                      className={`px-2.5 py-1 rounded-full text-xs cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-gray-200 hover:bg-gray-300 text-blue-600'}`}
                      onClick={() => setSearchTerm(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTopic(null)}
              className={`mb-6 px-4 py-2 rounded-lg cursor-pointer flex items-center transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} shadow-sm`}
            >
              <FiArrowLeft className="mr-2" />
              Back to topics
            </button>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm mb-6`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-2xl mb-2">{activeTopic.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                    <span className={`px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`}>
                      {activeTopic.subject}
                    </span>
                    {activeTopic.tags.map((tag, index) => (
                      <span key={index} className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => upvoteTopic(activeTopic.id)}
                  className={`flex flex-col items-center p-2 rounded-full cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <FiThumbsUp size={20} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                  <span className="text-sm cursor-pointer mt-1">{activeTopic.upvotes}</span>
                </button>
              </div>
              
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                  {activeTopic.authorAvatar}
                </div>
                <span className="font-medium">{activeTopic.author}</span>
                <span className="mx-2">•</span>
                <span>{activeTopic.date}</span>
                <span className="mx-2">•</span>
                <span>👁️ {activeTopic.views} views</span>
              </div>
              
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="whitespace-pre-line">{activeTopic.content}</p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {activeTopic.replies.length} {activeTopic.replies.length === 1 ? 'Reply' : 'Replies'}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sort by:</span>
                  <div className="relative">
                    <select
                      className={`appearance-none p-1.5 pr-6 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} cursor-pointer text-sm`}
                    >
                      <option>Newest</option>
                      <option>Oldest</option>
                      <option>Most Upvoted</option>
                    </select>
                    <div className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>
              
              {activeTopic.replies.length > 0 ? (
                <div className="space-y-4">
                  {activeTopic.replies.map(reply => (
                    <div 
                      key={reply.id} 
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                            {reply.authorAvatar}
                          </div>
                          <span className="font-medium">{reply.author}</span>
                          <span className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{reply.date}</span>
                        </div>
                        <button
                          onClick={() => upvoteReply(activeTopic.id, reply.id)}
                          className={`flex items-center cursor-pointer gap-1 px-2 py-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        >
                          <FiThumbsUp size={16} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                          <span className="text-sm">{reply.upvotes}</span>
                        </button>
                      </div>
                      <div className="pl-8">
                        <p className={`whitespace-pre-line ${expandedReplies[reply.id] ? '' : 'line-clamp-3'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {reply.content}
                        </p>
                        {reply.content.length > 200 && (
                          <button
                            onClick={() => toggleReplyExpansion(reply.id)}
                            className={`text-sm cursor-pointer mt-1 flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            {expandedReplies[reply.id] ? (
                              <>
                                <FiChevronUp className="inline mr-1" />
                                Show less
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="inline mr-1" />
                                Show more
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="mb-2">No replies yet</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Be the first to reply to this topic
                  </p>
                </div>
              )}
              
              <div className="mt-8">
                <h4 className="font-semibold text-lg mb-4">Post Your Reply</h4>
                <textarea
                  value={newReply.topicId === activeTopic.id ? newReply.content : ''}
                  onChange={(e) => setNewReply({
                    content: e.target.value,
                    topicId: activeTopic.id
                  })}
                  placeholder="Write your reply here... (markdown supported)"
                  className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                  rows="5"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tip: You can use markdown for formatting
                  </div>
                  <button
                    onClick={addReply}
                    disabled={!newReply.content || newReply.topicId !== activeTopic.id}
                    className={`px-6 py-2.5 cursor-pointer rounded-lg font-medium shadow-md ${
                      (!newReply.content || newReply.topicId !== activeTopic.id) ? 
                      (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                      (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')
                    } text-white`}
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isScrolled && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 cursor-pointer rounded-full shadow-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-white hover:bg-gray-100 text-blue-600'}`}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default DiscussionForum;