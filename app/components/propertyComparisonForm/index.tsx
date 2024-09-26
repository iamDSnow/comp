"use client";
import React, { useState } from 'react';
import { PropertyData } from '@/types';
import './PropertyTable.css';

const PropertyComparisonForm: React.FC = () => {
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address1, city, state, zip }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractProperties = (properties: any[]) => {
    return properties.map((property) => {
      const inputProperty = property.SALES_HISTORY ? JSON.stringify(property.SALES_HISTORY) : 'N/A';
      const comparableProperty = property.COMPARABLE_PROPERTY_ext || {};
      const salesHistory = property.SALES_HISTORY ? JSON.stringify(property.SALES_HISTORY) : 'N/A';
      const structure = property.STRUCTURE ? JSON.stringify(property.STRUCTURE) : 'N/A';
      const site = property.SITE ? JSON.stringify(property.SITE) : 'N/A';
      const tax = property._TAX ? JSON.stringify(property._TAX) : 'N/A';
      const legalDescription = property._LEGAL_DESCRIPTION ? JSON.stringify(property._LEGAL_DESCRIPTION) : 'N/A';
      const mailingAddress = property.MAILING_ADDRESS_ext ? JSON.stringify(property.MAILING_ADDRESS_ext) : 'N/A';
      const owner = property._OWNER ? JSON.stringify(property._OWNER) : 'N/A';

      return {
        inputProperty,
        comparableProperty,
        salesHistory,
        structure,
        site,
        tax,
        legalDescription,
        mailingAddress,
        owner,
      };
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          placeholder="Enter property address"
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="ZIP Code"
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
          <h2 className="text-xl font-bold mb-2">Comparison Results:</h2>
          <table className="min-w-full border border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Attribute</th>
                <th className="border px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {extractProperties(
                result.RESPONSE_GROUP.RESPONSE.RESPONSE_DATA.PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY
              ).map((property, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="border px-4 py-2" colSpan={2}>Property {index + 1}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Input Property</td>
                    <td className="border px-4 py-2">{property.inputProperty}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Comparable Property</td>
                    <td className="border px-4 py-2">{JSON.stringify(property.comparableProperty)}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Sales History</td>
                    <td className="border px-4 py-2">{property.salesHistory}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Structure</td>
                    <td className="border px-4 py-2">{property.structure}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Site</td>
                    <td className="border px-4 py-2">{property.site}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Tax</td>
                    <td className="border px-4 py-2">{property.tax}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Legal Description</td>
                    <td className="border px-4 py-2">{property.legalDescription}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Mailing Address</td>
                    <td className="border px-4 py-2">{property.mailingAddress}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Owner</td>
                    <td className="border px-4 py-2">{property.owner}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonForm;
