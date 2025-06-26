import React, { useState } from 'react';

const ResourcesHub = ({ darkMode }) => {
  const [resources, setResources] = useState([
    { 
      id: 1, 
      title: 'React Documentation', 
      type: 'website', 
      subject: 'React', 
      url: 'https://reactjs.org/docs/getting-started.html',
      description: 'Official React documentation with guides and API reference',
      bookmarked: true
    },
    { 
      id: 2, 
      title: 'Tailwind CSS Crash Course', 
      type: 'video', 
      subject: 'CSS', 
      url: 'https://www.youtube.com/watch?v=UBOj6rqRUME',
      description: 'Learn Tailwind CSS fundamentals in this YouTube tutorial',
      bookmarked: false
    },
    { 
      id: 3, 
      title: 'JavaScript: The Good Parts', 
      type: 'book', 
      subject: 'JavaScript', 
      url: 'https://www.oreilly.com/library/view/javascript-the-good/9780596517748/',
      description: 'Classic book about JavaScript best practices',
      bookmarked: true
    }
  ]);
  
  const [newResource, setNewResource] = useState({ 
    title: '', 
    type: 'website', 
    subject: '', 
    url: '', 
    description: '' 
  });
  
  const [filter, setFilter] = useState({ 
    type: 'all', 
    subject: 'all', 
    bookmarked: false 
  });

  const addResource = () => {
    if (newResource.title && newResource.url) {
      setResources([...resources, { 
        ...newResource, 
        id: Date.now(), 
        bookmarked: false 
      }]);
      setNewResource({ 
        title: '', 
        type: 'website', 
        subject: '', 
        url: '', 
        description: '' 
      });
    }
  };

  const toggleBookmark = (id) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource
    ));
  };

  const filteredResources = resources.filter(resource => {
    return (
      (filter.type === 'all' || resource.type === filter.type) &&
      (filter.subject === 'all' || resource.subject === filter.subject) &&
      (!filter.bookmarked || resource.bookmarked)
    );
  });

  const subjects = [...new Set(resources.map(resource => resource.subject))];

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Study Resources Hub</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Add New Resource</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                placeholder="Resource title"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              >
                <option value="website">Website</option>
                <option value="video">Video</option>
                <option value="book">Book</option>
                <option value="article">Article</option>
                <option value="podcast">Podcast</option>
                <option value="pdf">PDF</option>
              </select>
              
              <input
                type="text"
                value={newResource.subject}
                onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                placeholder="Subject (e.g., Math, Science)"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                placeholder="URL"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <textarea
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                placeholder="Description"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                rows="3"
              />
              
              <button
                onClick={addResource}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Add Resource
              </button>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                >
                  <option value="all">All Types</option>
                  <option value="website">Website</option>
                  <option value="video">Video</option>
                  <option value="book">Book</option>
                  <option value="article">Article</option>
                  <option value="podcast">Podcast</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={filter.subject}
                  onChange={(e) => setFilter({...filter, subject: e.target.value})}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                >
                  <option value="all">All Subjects</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bookmarked"
                  checked={filter.bookmarked}
                  onChange={(e) => setFilter({...filter, bookmarked: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="bookmarked">Bookmarked Only</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Resources</h3>
            
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => (
                  <div 
                    key={resource.id} 
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg mb-1">{resource.title}</h4>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`p-1 rounded-full ${resource.bookmarked ? 'text-yellow-400' : darkMode ? 'text-gray-400' : 'text-gray-300'}`}
                      >
                        {resource.bookmarked ? '★' : '☆'}
                      </button>
                    </div>
                    
                    <div className="flex items-center text-sm mb-2">
                      <span className={`px-2 py-1 rounded mr-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                        {resource.type}
                      </span>
                      <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                        {resource.subject}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3">{resource.description}</p>
                    
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Visit Resource →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No resources match your filters</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHub;