import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

function JobDetails() {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(`/jobs/${jobId}`);
        setJob(response.data);
        
        if (user) {
          const hasApplied = response.data.applications.some(
            app => app.applicantId === user.id
          );
          setApplied(hasApplied);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };
    fetchJob();
  }, [jobId, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await API.post('/applications', {
        jobId: parseInt(jobId),
        coverLetter
      });
      alert('Application submitted successfully!');
      setApplied(true);
      setCoverLetter('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply');
    }
  };

  if (!job) return <div className="loading">Loading...</div>;

  return (
    <div className="job-details-container">
      <div className="job-details-box">
        <h1>{job.title}</h1>
        <p style={{ lineHeight: '1.8', color: '#555' }}>{job.description}</p>
        <div className="job-info">
          <p><strong>Budget:</strong> ${job.budget}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Posted by:</strong> {job.postedBy.name}</p>
          <p><strong>Total Applications:</strong> {job.applications.length}</p>
        </div>
      </div>

      {user && user.role === 'freelancer' && !applied && (
        <div className="apply-section">
          <h3>Apply for this job</h3>
          <form onSubmit={handleApply}>
            <textarea
              placeholder="Write your cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows="8"
            />
            <button type="submit">Submit Application</button>
          </form>
        </div>
      )}

      {applied && <div className="success-message">✓ You have already applied to this job</div>}
      
      {!user && <div className="apply-section"><p>Please login to apply for this job</p></div>}
    </div>
  );
}

export default JobDetails;