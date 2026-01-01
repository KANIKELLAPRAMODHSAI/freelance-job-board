import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="home-container">
      <h1>Available Jobs</h1>
      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description.substring(0, 150)}...</p>
            <div className="job-meta">
              <span className="badge">${job.budget}</span>
              <span className="badge">{job.location}</span>
              <span className="badge">{job.applications.length} applicants</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Posted by: {job.postedBy.name}
            </p>
            <Link to={`/job/${job.id}`}>View Details →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;