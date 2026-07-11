import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Code2, User } from 'lucide-react';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [query, setQuery] = useState('');
  const [type, setType] = useState('profile'); // 'profile' or 'repo'

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      // Clean up URL
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-xl">Redirecting to login...</p>
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (type === 'profile') {
        response = await fetch('http://localhost:3001/analyze-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: query })
        });
      } else {
        response = await fetch('http://localhost:3001/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: `Analyze this repository: ${query}` })
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            RepoScanAI
          </h1>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
            className="text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-2">New Analysis</h2>
          <p className="text-slate-400 mb-8">Enter a GitHub username or repository URL to begin.</p>

          <form onSubmit={handleSearch}>
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setType('profile')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center border transition-all ${
                  type === 'profile' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <User className="mr-2 w-5 h-5" /> Profile Audit
              </button>
              <button
                type="button"
                onClick={() => setType('repo')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center border transition-all ${
                  type === 'repo' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Code2 className="mr-2 w-5 h-5" /> Repo Audit
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={type === 'profile' ? 'e.g., torvalds' : 'e.g., https://github.com/facebook/react'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {loading ? 'Scanning...' : `Analyze ${type === 'profile' ? 'Developer' : 'Codebase'}`}
            </button>
          </form>

          {error && <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">{error}</div>}

          {result && (
             <div className="mt-8 p-6 bg-slate-800 rounded-xl">
               <h3 className="text-xl font-bold mb-4">Results</h3>
               <pre className="whitespace-pre-wrap text-sm text-slate-300">
                 {JSON.stringify(result, null, 2)}
               </pre>
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
