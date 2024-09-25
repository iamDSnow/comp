"use client";
import React, { useState } from 'react';
import { PropertyData } from '@/types';

const PropertyComparisonForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter property address"
          required
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Loading...' : 'Compare'}
        </button>
      </form>
      {result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonForm;
