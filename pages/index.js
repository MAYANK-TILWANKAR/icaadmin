import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaTrash, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white text-6xl"
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
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 m-6 rounded-lg shadow-xl"
        role="alert"
      >
        <p className="font-bold text-xl mb-2">Error</p>
        <p className="text-lg">{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Admin Dashboard
        </h1>

        <AnimatePresence>
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Contact Form Submissions
            </h2>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-12">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 text-lg">No submissions found</td>
                    </tr>
                  ) : (
                    formData.map((entry) => (
                      <motion.tr
                        key={entry._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-indigo-500" />
                            {entry.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-green-500" />
                            {entry.mobile || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{entry.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(entry._id, false)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            key="demo-data"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Demo Data Submissions
            </h2>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {demoData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500 text-lg">No demo data submissions found</td>
                    </tr>
                  ) : (
                    demoData.map((entry) => (
                      <motion.tr
                        key={entry._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-blue-500" />
                            {entry.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-green-500" />
                            {entry.mobile || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaGraduationCap className="mr-2 text-purple-500" />
                            {entry.college || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-yellow-500" />
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{entry.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(entry._id, true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactAdminDashboard;