// client/src/components/LoginForm.jsx - Login form component

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm" style={{ fontSize: '14px', fontWeight: '500' }}>{error}</p>
      )}

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
