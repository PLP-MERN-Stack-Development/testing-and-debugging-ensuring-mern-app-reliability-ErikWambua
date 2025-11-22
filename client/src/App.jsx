import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Button from './components/common/Button';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
          📝 MERN Blog
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white hover:text-blue-400 transition-colors font-medium"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                ✏️ Create Post
              </Link>
              <span className="text-gray-300 text-sm border-l border-gray-600 pl-4">
                👤 {user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-2" style={{ color: '#111827' }}>Latest Blog Posts</h2>
        <p className="text-gray-600" style={{ fontSize: '16px' }}>Discover and share amazing content</p>
      </div>
      <PostList />
    </div>
  );
}

function CreatePostPage() {
  const { isAuthenticated } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8" style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <p className="text-red-600 mb-4" style={{ fontSize: '18px', fontWeight: '500' }}>Please login to create a post</p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#111827' }}>Create New Post</h2>
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" style={{ fontSize: '14px', fontWeight: '500' }}>
          Post created successfully!
        </div>
      )}
      <PostForm 
        onSuccess={() => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }} 
      />
    </div>
  );
}

function LoginPage() {
  const navigate = (path) => window.location.href = path;

  return (
    <div className="max-w-md mx-auto" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#111827' }}>Login to Your Account</h2>
      <LoginForm onSuccess={() => navigate('/')} />
      <p className="mt-4 text-center" style={{ color: '#6b7280', fontSize: '14px' }}>
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline" style={{ fontWeight: '600' }}>
          Register here
        </Link>
      </p>
    </div>
  );
}

function RegisterPage() {
  const navigate = (path) => window.location.href = path;

  return (
    <div className="max-w-md mx-auto" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#111827' }}>Create an Account</h2>
      <RegisterForm onSuccess={() => navigate('/')} />
      <p className="mt-4 text-center" style={{ color: '#6b7280', fontSize: '14px' }}>
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline" style={{ fontWeight: '600' }}>
          Login here
        </Link>
      </p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto p-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;