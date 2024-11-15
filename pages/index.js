import React, { useEffect, useState } from "react";

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
        fetch("/api/getDemoData"),
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
      const endpoint = isDemo
        ? `/api/deleteDemoEnquiry?id=${id}`
        : `/api/deleteEnquiry?id=${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      await fetchData();
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-800 border-b border-blue-200 pb-2">
          Admin Dashboard
        </h1>

        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700">
            Enquiry Form Submissions
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  {["Name", "Email", "Mobile", "Message", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {formData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 whitespace-nowrap text-sm text-blue-500 text-center">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  formData.map((entry) => (
                    <tr
                      key={entry._id}
                      className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        {entry.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                        {entry.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                        {entry.mobile || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 truncate max-w-xs">
                        {entry.message}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entry._id, false)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded transition-colors duration-200 text-xs sm:text-sm ">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700">
            Demo Data Submissions
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-200">
              <thead className="bg-yellow-100">
                <tr>
                  {["Name", "Email", "Mobile", "Course", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-100">
                {demoData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 whitespace-nowrap text-sm text-yellow-600 text-center">
                      No demo data submissions found
                    </td>
                  </tr>
                ) : (
                  demoData.map((entry) => (
                    <tr
                      key={entry._id}
                      className="hover:bg-yellow-50 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-yellow-900">
                        {entry.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-700">
                        {entry.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-700">
                        {entry.mobile || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-700">
                        {entry.course}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entry._id, true)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded transition-colors duration-200 text-xs sm:text-sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactAdminDashboard;
