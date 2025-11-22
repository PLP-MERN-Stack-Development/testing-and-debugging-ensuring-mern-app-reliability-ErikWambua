// client/src/components/PostList.jsx - Component to display list of posts

import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

const PostList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery('posts', () => 
    postService.getPosts()
  );

  const deleteMutation = useMutation(postService.deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync(postId);
      } catch (error) {
        alert('Failed to delete post: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4" style={{ fontSize: '16px' }}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg" style={{ padding: '3rem', border: '2px solid #fee2e2' }}>
        <p className="text-red-600" style={{ fontSize: '18px', fontWeight: '500' }}>
          ⚠️ Error loading posts: {error.message}
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 rounded-lg" style={{ padding: '3rem', border: '2px solid #dbeafe' }}>
        <p className="text-gray-700" style={{ fontSize: '18px', fontWeight: '500' }}>
          📝 No posts yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post._id} 
          className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-all"
          style={{ border: '2px solid #e5e7eb' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                {post.category && (
                  <span 
                    className="px-3 py-1 rounded-full font-medium"
                    style={{ 
                      backgroundColor: '#dbeafe', 
                      color: '#1e40af',
                      fontSize: '13px'
                    }}
                  >
                    #{post.category}
                  </span>
                )}
                <span>📅 {new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span className="font-medium" style={{ 
                  textTransform: 'capitalize',
                  color: post.status === 'published' ? '#10b981' : '#6b7280'
                }}>
                  • {post.status || 'draft'}
                </span>
              </div>
            </div>
            {user && post.author === user._id && (
              <button
                onClick={() => handleDelete(post._id)}
                disabled={deleteMutation.isLoading}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isLoading ? '...' : '🗑️ Delete'}
              </button>
            )}
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" style={{ fontSize: '16px' }}>
            {post.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
