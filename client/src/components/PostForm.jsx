// client/src/components/PostForm.jsx - Form component for creating/editing posts

import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { postService } from '../services/api';
import Button from './common/Button';

const PostForm = ({ post = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || '',
  });

  const [errors, setErrors] = useState({});

  const createMutation = useMutation(postService.createPost, {
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      // Reset form
      setFormData({ title: '', content: '', category: '' });
      setErrors({});
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      setErrors({ submit: message });
    },
  });

  const updateMutation = useMutation(
    (data) => postService.updatePost(post._id, data),
    {
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      onError: (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        setErrors({ submit: message });
      },
    }
  );

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (post) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Post Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter an engaging title"
          className="w-full px-3 py-2 border rounded"
          aria-label="Title"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          placeholder="Write your post content here..."
          className="w-full px-3 py-2 border rounded"
          aria-label="Content"
          style={{ fontSize: '16px', color: '#111827' }}
        />
        {errors.content && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.content}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: '#374151', fontSize: '14px' }}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          aria-label="Category"
          style={{ fontSize: '16px', color: '#111827' }}
        >
          <option value="">Select a category</option>
          <option value="tech">Technology</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="business">Business</option>
          <option value="travel">Travel</option>
        </select>
        {errors.category && (
          <p className="text-red-600 text-sm mt-1" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.category}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-red-600 text-sm" style={{ fontSize: '14px', fontWeight: '500' }}>{errors.submit}</p>
      )}

      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        {post ? 'Update Post' : 'Create Post'}
      </Button>
    </form>
  );
};

export default PostForm;
