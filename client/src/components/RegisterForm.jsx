// client/src/components/RegisterForm.jsx - Registration form component

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Registration failed' });
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.username && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.username}</p>
        )}
      </div>

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
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.email}</p>
        )}
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
          placeholder="At least 6 characters"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.confirmPassword}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-red-600 text-sm" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.submit}</p>
      )}

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
