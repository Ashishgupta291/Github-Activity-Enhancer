import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [token, setToken] = useState('');

  //const [email, setEmail] = useState('');

  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [numberOfCommits, setNumberOfCommits] = useState(200);
  const [isLoading, setIsLoading] = useState(false); 
  const [message, setMessage] = useState('');
  
  const messageRef = useRef(null);//new

  const fetchRepositories = async () => {
    try {
      const response = await axios.post('https://gae-api.onrender.com/api/repositories', { token }); // change when hosting
      setRepositories(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch repositories');
    }
  };

  const makeCommits = async () => {
    setIsLoading(true); // Start animation
    setMessage(''); // Clear previous messages
    try {
      const response = await axios.post('https://gae-api.onrender.com/api/make-commits', { //change when hosting
        repoUrl: selectedRepo,
        token,
        // email,
        username: selectedRepo.split('/')[3],
        numberOfCommits: parseInt(numberOfCommits, 10),
      }
    );

      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
      alert('Error making commits');
    }
    finally {
      setIsLoading(false); 
    }
  };

  //new
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">GitHub Activity Enhancer</h1>
      <div className="card p-4 shadow mt-4">
        <div className="mb-3">
          <label className="form-label">GitHub Token:</label>
          <input
            type="text"
            className="form-control"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="btn btn-primary mt-3" onClick={fetchRepositories}>Fetch Repositories</button>
        </div>
        {repositories.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Select Repository:</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="">--Select--</option>
              {repositories.map((repo) => (
                <option key={repo.url} value={repo.url}>{repo.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* <div className="mb-3">
          <label className="form-label">Email used on GitHub:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}

        <div className="mb-3">
          <label className="form-label">Number of Commits (Default: 200):</label>
          <input
            type="number"
            className="form-control"
            value={numberOfCommits}
            onChange={(e) => setNumberOfCommits(e.target.value)}
            min="1"
          />
        </div>
        <button className="btn btn-success mt-3" onClick={makeCommits} disabled={isLoading}>{isLoading ? 'Processing...' : 'Generate Commits'}</button>
        {isLoading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Processing your request...</p>
          </div>
        )}
        {/* {message && <p className="text-success mt-3">{message}</p>} */}

        <div ref={messageRef} className="text-success mt-3">
          {message && <p>{message}</p>}
        </div>

      </div>

      
      <div className="mt-5">
        <h2 className="text-center">How to generate GitHub Token</h2>
        <div className="text-center">
          <div className="mt-4">
            <p>Step 1: Go to your GitHub Dashboard-> Settings-> Developer settings-> Personal access tokens-> Tokens (Classic)-> Generate new token.</p>
            <img src="step1.png" alt="Step 1" className="img-fluid mb-2" style={{ maxWidth: '100%' }} />
            <img src="step3.png" alt="Step 2" className="img-fluid mb-2" style={{ maxWidth: '100%' }} />
          </div>
          <div className="mt-4">
            <p>Step 2: Generate Token and copy Generated token. (you may delete it once enhancement is done.)</p>
            <img src="step2.png" alt="Step 2" className="img-fluid mb-2" style={{ maxWidth: '100%' }} />
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default App;
