"use client";

import React, { useState } from 'react';

// Define a type for the API response
interface PropertyInfoResponse {
  // Add the expected properties from the response
  // Example:
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  // Add any other properties you expect
  error?: string; // If your response may include an error message
}

const PropertyInfoForm: React.FC = () => {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyInfoResponse | null>(null); // Use the new type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/property-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address1, address2 }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: PropertyInfoResponse = await response.json(); // Use the defined type
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch property information.' }); // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Single Property Information</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          placeholder="Enter address line 1"
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          placeholder="Enter City,State"
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Loading...' : 'Get Property Info'}
        </button>
      </form>
      {result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Single Property Information:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PropertyInfoForm;
