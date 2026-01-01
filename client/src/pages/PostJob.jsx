import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

function PostJob() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      alert('Job posted successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to post job');
    }
  };

  if (!user || user.role !== 'client') {
    return (
      <div className="post-job-container">
        <div className="post-job-box">
          <p style={{ textAlign: 'center' }}>Only clients can post jobs. Please register as a client.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-job-container">
      <div className="post-job-box">
        <h1>Post a New Job</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Job Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows="8"
          />
          <input
            type="number"
            placeholder="Budget ($)"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
          <button type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;