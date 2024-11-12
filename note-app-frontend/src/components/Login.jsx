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

  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setErrorMessage('');

  //   try {
  //     const response = await fetch('http://localhost:3000/user/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Login successful:', data);
  //       localStorage.setItem('accessToken', data.accessToken);
  //       setAccessToken(data.accessToken);
  //       navigate('/note');  // Navigate to home page after successful login
  //     } else {
  //       const errorData = await response.json();
  //       setErrorMessage(errorData.message || 'Login failed');
  //     }
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     setErrorMessage('An error occurred while logging in');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'}
             focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-600">Sign Up</Link>
        </p>
        {/* {accessToken && (
          <p className="mt-4 text-green-500 text-center font-medium">Login successful!</p>
        )} */}
      </div>
    </div>
  );
}

export default Login;
