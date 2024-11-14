import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useStore from '../store/store';


function Login() {
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [accessToken, setAccessToken] = useState(null);
  const { data, loading, error, notes, authUser, createNote,authId, getNotes, loginData,notesUI} = useStore();


  const navigate = useNavigate();  // Hook for navigation
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = inputUser
    const password = inputPass
    
    // setInputPass("");
    // setInputUser("");
    loginData( username, password );
    
  }

  useEffect(() => {
    if (authId) {
      getNotes(authId);  // Get notes for user after login
      navigate('/note');  // Navigate to home page after successful login
    }
  }, [authId, navigate, getNotes]);

 
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#182775] p-4">
      <div className="w-full max-w-sm p-6 bg-[#122eb9] rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center text-white">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
            <input
              type="text"
              id="username"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name='password'
              autoComplete="on"
              id="password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-[#78cdff]' : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'}
             focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="pt-4 text-center text-sm text-white">
          Don't have an account? <Link to="/signup" className="text-blue-300 hover:text-blue-600 underline">Sign Up</Link>
        </p>
      
      </div>
    </div>
  );
}

export default Login;
