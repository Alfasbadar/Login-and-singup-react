import React, { useState, useEffect } from 'react';
import './Distribution.css';
import { addDistributorToDatabase, getAllDistributor } from '../../Database/Database';
import DetailedDistribution from './DetailedDistribution';

function Distribution({ products }) {
  const [showAddDistributorForm, setShowAddDistributorForm] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [newDistributor, setNewDistributor] = useState({
    id: '',
    name: '',
    contact: '',
    comments: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [showDetailedDistribution, setShowDetailedDistribution] = useState(false);

  useEffect(() => {
    getAllDistributors();
  }, []);

  const getAllDistributors = async () => {
    try {
      const allDistributors = await getAllDistributor();
      setDistributors(allDistributors);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
  };

  const handleAddDistributor = () => {
    setShowAddDistributorForm(true);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() !== '') {
      const suggestions = distributors.filter((distributor) =>
        distributor.id.includes(term) ||
        distributor.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSelectDistributor = (selectedDistributor) => {
    setSelectedDistributor(selectedDistributor);
    setSearchTerm('');
    setSearchSuggestions([]);
    setShowDetailedDistribution(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchSuggestions.length > 0) {
      handleSelectDistributor(searchSuggestions[0]);
    }
  };

  const handleChange = (e) => {
    setNewDistributor({ ...newDistributor, [e.target.name]: e.target.value });
  };

  const handleDistributorSubmit = async () => {
    try {
      await addDistributorToDatabase(newDistributor);
      console.log('Distributor added:', newDistributor);
      setNewDistributor({
        id: '',
        name: '',
        contact: '',
        comments: ''
      });
      setShowAddDistributorForm(false);
      getAllDistributors();
    } catch (error) {
      console.error('Error adding distributor:', error);
    }
  };

  const handleBackClick = () => {
    setShowDetailedDistribution(false);
  };

  return (
    <div className="distribution-container">
      {showDetailedDistribution ? (
        <DetailedDistribution distributor={selectedDistributor} onBackClick={handleBackClick} products={products} />
      ) : (
        <>
          <div className="header">
            <div className={`search-bar-container ${showSearchBar ? 'active' : ''}`}>
              <input
                type="text"
                placeholder="Search distributor"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className={showSearchBar ? 'visible' : ''}
              />
              <button onClick={() => setShowSearchBar(!showSearchBar)}>
                {showSearchBar ? 'Cancel' : 'Search'}
              </button>
            </div>
            {showSearchBar && (
              <div className="search-suggestions">
                {searchSuggestions.map((distributor, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    onClick={() => handleSelectDistributor(distributor)}
                  >
                    {distributor.name}
                  </div>
                ))}
                {searchSuggestions.length === 0 && searchTerm && (
                  <div className="create-new" onClick={handleAddDistributor}>
                    Create new distributor
                  </div>
                )}
              </div>
            )}
          </div>
          {showAddDistributorForm && (
            <div className="popup-cardview">
              <div className="popup-content">
                <span className="close" onClick={() => setShowAddDistributorForm(false)}>
                  &times;
                </span>
                <h2>Add Distributor</h2>
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={newDistributor.id}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Distributor Name"
                  value={newDistributor.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact"
                  value={newDistributor.contact}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="comments"
                  placeholder="Comments"
                  value={newDistributor.comments}
                  onChange={handleChange}
                />
                <div className="button-container">
                  <button className="add" onClick={handleDistributorSubmit}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          <table className="distributor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {distributors.map((distributor, index) => (
                <tr key={index} onClick={() => handleSelectDistributor(distributor)}>
                  <td>{distributor.id}</td>
                  <td>{distributor.name}</td>
                  <td>{distributor.contact}</td>
                  <td>{distributor.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="add-distributor-button">
            <button onClick={handleAddDistributor}>+ Add Distributor</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Distribution;
