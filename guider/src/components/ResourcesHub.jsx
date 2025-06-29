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
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-lg`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Study Resources Hub</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
            <h3 className="font-semibold text-lg mb-4">Add New Resource</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  placeholder="Resource title"
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer`}
                >
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
                <input
                  type="text"
                  value={newResource.subject}
                  onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                  placeholder="Subject (e.g., Math, Science)"
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="URL"
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Description"
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  rows="3"
                />
              </div>
              
              <button
                onClick={addResource}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium shadow-md hover:shadow-lg cursor-pointer`}
              >
                Add Resource
              </button>
            </div>
          </div>
          
          <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer`}
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
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer`}
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
                  className={`mr-2 rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} cursor-pointer`}
                />
                <label htmlFor="bookmarked" className="cursor-pointer">Bookmarked Only</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Resources</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {filteredResources.length} {filteredResources.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => (
                  <div 
                    key={resource.id} 
                    className={`p-4 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-600 hover:bg-gray-550' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'} shadow-sm hover:shadow-md cursor-default`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg mb-1 truncate">{resource.title}</h4>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`p-1 rounded-full transition-colors duration-200 ${resource.bookmarked ? 'text-yellow-400 hover:text-yellow-500' : darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} cursor-pointer`}
                        aria-label={resource.bookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        {resource.bookmarked ? '★' : '☆'}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 my-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                        {resource.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
                        {resource.subject}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3 line-clamp-2">{resource.description}</p>
                    
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 cursor-pointer`}
                    >
                      Visit Resource
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No resources match your filters</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or add new resources</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHub;