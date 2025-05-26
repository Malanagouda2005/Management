import React, { useState } from 'react';
import axios from 'axios';

interface AuthPageProps {
  onLogin: () => void; // Add a prop for the login callback
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirm: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tab === 'signup') {
        if (form.password !== form.confirm) {
          alert('Passwords do not match');
          return;
        }

        // Call the signup API
        await axios.post('http://localhost:5000/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        alert('Signup successful! Please login.');
        setTab('login');
      } else if (tab === 'login') {
        // Call the login API
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });

        // Store the token and call onLogin
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        onLogin(); // Call the onLogin function to update the loggedIn state
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex justify-between">
          <button
            className={`text-sm font-medium px-2 py-1 rounded ${tab === 'login' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-500'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`text-sm font-medium px-2 py-1 rounded ${tab === 'signup' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-500'}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>
        <div className="p-6">
          {tab === 'login' && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition shadow-sm font-medium"
              >
                Login
              </button>
            </form>
          )}
          {tab === 'signup' && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition shadow-sm font-medium"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;