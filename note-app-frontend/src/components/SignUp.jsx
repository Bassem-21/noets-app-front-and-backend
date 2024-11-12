import {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

function SignUp() {
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  const { data, loading, error, notes, authUser, createNote,authId, getNotes, signupData,notesUI} = useStore();

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const username = inputUser
    const password = inputPass

    signupData(username, password)
    // Basic validation
    if (inputPass !== confirmPassword) {
      // setErrorMessage('Passwords do not match');
      // setLoading(false);
      console.log('Passwords do not match')
      return;
    }
  }
  useEffect(() => {
    if (authId) {
      getNotes(authId);  // Get notes for user after login
      navigate('/note');  // Navigate to home page after successful login
    }
  }, [authId, navigate, getNotes]);

    // try {
    //   const response = await fetch('http://localhost:3000/user/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Signup successful:', data);
    //     navigate('/note');  // Redirect to the login page after successful sign up
    //   } else {
    //     const errorData = await response.json();
    //     setErrorMessage(errorData.message || 'Signup failed');
    //   }
    // } catch (error) {
    //   console.error('Error signing up:', error);
    //   setErrorMessage('An error occurred while signing up');
    // } finally {
    //   setLoading(false);
    // }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp}>
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

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
