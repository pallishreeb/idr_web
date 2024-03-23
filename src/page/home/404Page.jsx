// 404Page.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from './page-not-found.png'; // Import your 404 image

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={notFoundImage} alt="404" className="mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/admin/dashboard" className="text-indigo-700 hover:underline">Go back to home</Link>
    </div>
  );
};

export default NotFoundPage;
