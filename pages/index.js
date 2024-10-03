import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaTrash } from "react-icons/fa";

const ContactAdminDashboard = () => {
  const [formData, setFormData] = useState([]);
  const [demoData, setDemoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactRes, demoRes] = await Promise.all([
        fetch("/api/getData"),
        fetch("/api/getDemoData")
      ]);

      if (!contactRes.ok || !demoRes.ok) {
        throw new Error(`Error fetching data`);
      }

      const contactJsonData = await contactRes.json();
      const demoJsonData = await demoRes.json();

      setFormData(contactJsonData.data);
      setDemoData(demoJsonData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, isDemo) => {
    try {
      const endpoint = isDemo ? `/api/deleteDemoEnquiry?id=${id}` : `/api/deleteEnquiry?id=${id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Refresh data after successful deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-white text-4xl"
        >
          <FaSpinner />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-lg"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Admin Dashboard
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Contact Form Submissions
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No submissions found</td>
                  </tr>
                ) : (
                  formData.map((entry) => (
                    <motion.tr
                      key={entry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.mobile || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleDelete(entry._id, false)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Demo Data Submissions
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {demoData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">No demo data submissions found</td>
                  </tr>
                ) : (
                  demoData.map((entry) => (
                    <motion.tr
                      key={entry._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.mobile || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.college || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleDelete(entry._id, true)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactAdminDashboard;