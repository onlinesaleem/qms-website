"use client"; // Ensure this is a client-side component

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const AdminPage = () => {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState('');
  const [title, setTitle] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        setMessage('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  const fetchContent = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/content', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setContent(response.data);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  useEffect(() => {
    if (loading) {
      console.log("Still loading, waiting for authentication.");
      return; // Don't do anything until loading is complete
    }

    if (!user) {
      console.log("User is not authenticated, redirecting to login.");
      router.push('/login'); // Redirect if not authenticated
    } else {
      console.log("User is authenticated, fetching content.");
      fetchContent();
    }
  }, [user, loading, router, fetchContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!page || !title || !bodyContent) {
      setMessage('All fields are required.');
      return;
    }

    let imageUrl = '';

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadResponse = await axios.post('/api/admin/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        imageUrl = uploadResponse.data.imageUrl;
      } catch (error) {
        handleError(error);
        return;
      }
    }

    const contentData = {
      page,
      title,
      content: bodyContent,
      imageUrl,
    };

    try {
      if (isEditing && editingId) {
        await axios.put('/api/admin/content', { id: editingId, ...contentData }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (imageFile) {
          const formData = new FormData();
          await axios.post('/api/admin/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        }
        setMessage('Content updated successfully!');
      } else {
        await axios.post('/api/admin/content', contentData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage('Content created successfully!');
      }
      fetchContent();
      resetForm();
    } catch (error) {
      handleError(error);
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingId(item.id);
    setPage(item.page);
    setTitle(item.title);
    setBodyContent(item.content);
    setImageFile(null); // Reset image file when editing
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete('/api/admin/content', {
        data: { id },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Content deleted successfully!');
      fetchContent();
    } catch (error) {
      handleError(error);
    }
  };

  const resetForm = () => {
    setPage('');
    setTitle('');
    setBodyContent('');
    setImageFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="group relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="page" className="block text-sm font-medium text-gray-700">Page</label>
          <input
            type="text"
            id="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            rows={6}
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            id="imageUrl"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          {isEditing ? 'Update Content' : 'Create Content'}
        </button>
        {message && (
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {message}
          </div>
        )}
      </form>

      <div className="space-y-6">
        {content.map((item: any) => (
          <div key={item.id} className="p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{item.page}</p>
            <p className="text-gray-700 mb-6">{item.content}</p>

            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(item)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-150"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WrappedAdminPage = () => (
  <AuthProvider>
    <AdminPage />
  </AuthProvider>
);

export default WrappedAdminPage;