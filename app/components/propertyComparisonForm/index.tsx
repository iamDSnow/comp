"use client";

import React, { useState } from 'react';
import styles from './PropertyTable.module.scss';
import { PropertyData } from '@/types';

const PropertyComparisonForm: React.FC = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({ address1: '', city: '', state: '', zip: '' });
  // State to manage loading status during the fetch request
  const [loading, setLoading] = useState(false);
  // State to hold the result of the API call
  const [result, setResult] = useState<PropertyData | null>(null);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Destructure name and value from the event target
    // Update the formData state with the new value for the corresponding field
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true before the fetch
    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Convert formData to JSON and send it in the request body
        body: JSON.stringify(formData),
      });
      const data = await response.json(); // Parse the JSON response
      setResult(data); // Set the result state with the fetched data
    } catch (error) {
      console.error('Error:', error); // Log any errors during the fetch
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // Clean object keys by removing unwanted prefixes
  const cleanKeys = (obj: any): unknown => {
    if (Array.isArray(obj)) return obj.map(cleanKeys); // Recursively clean array elements
    if (obj && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        // Remove leading '@' or '_' from keys
        const cleanedKey = key.replace(/^@|^_/, '');
        acc[cleanedKey] = cleanKeys(value); // Recursively clean the value
        return acc;
      }, {} as Record<string, unknown>);
    }
    return obj; // Return the value as is if it's not an object or array
  };

  // Convert properties into a table format
  const convertToTable = (properties: any[]) => {
    return properties.map((property, index) => {
      const cleanedProperty = cleanKeys(property); // Clean the property keys

      // If the cleaned property is invalid, return null
      if (!cleanedProperty || typeof cleanedProperty !== 'object') return null;

      // Destructure unwanted properties from cleanedProperty
      const { PRODUCT_INFO_ext, COMPARABLE_PROPERTY_ext, MAILING_ADDRESS_ext, ...filteredProperty } = cleanedProperty as Record<string, unknown>;

      // Merge comparable properties into the filtered property
      if (COMPARABLE_PROPERTY_ext) {
        Object.entries(COMPARABLE_PROPERTY_ext).forEach(([key, value]) => {
          filteredProperty[key] = value;
        });
      }

      // Prepare mailing address if it exists
      const mailingAddress = MAILING_ADDRESS_ext ? { 'Owner Mailing Address': MAILING_ADDRESS_ext } : {};

      return (
        <div key={index} className={styles.propertyTableContainer}>
          <h3 className={styles.propertyHeader}>Property {index + 1}</h3>
          <table className={styles.propertyTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Attribute</th>
                <th className={styles.tableHeader}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries({ ...filteredProperty, ...mailingAddress }).map(([key, value]) => (
                <tr key={key}>
                  <td className={styles.tableCell}>{key}</td>
                  <td className={styles.tableCell}>{renderNestedValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  };

  // Recursively render nested values for display in the table
  const renderNestedValue = (value: any) => {
    if (Array.isArray(value)) {
      // If value is an array, map over it and render each item
      return value.map((item, index) => <div key={index}>{renderNestedValue(item)}</div>);
    }

    if (value && typeof value === 'object') {
      // If value is an object, render its entries recursively
      return Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey} className={styles.nestedValue}>
          <strong>{subKey}:</strong> {renderNestedValue(subValue)}
        </div>
      ));
    }

    return value; // Return the value as is if it's neither an object nor an array
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.propertyForm}>
        {/* Generate input fields dynamically from the formData keys */}
        {['address1', 'city', 'state', 'zip'].map((field) => (
          <input
            key={field}
            type="text"
            name={field} // Set input name to match formData keys
            value={formData[field as keyof typeof formData]} // Controlled input value
            onChange={handleChange} // Update formData on input change
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)} // Capitalize the placeholder
            required
            className={`${styles.inputField} border p-2 mr-2`}
          />
        ))}
        {/* Submit button with loading state */}
        <button type="submit" disabled={loading} className={`${styles.submitButton} bg-blue-500 text-white p-2 rounded`}>
          {loading ? 'Loading...' : 'Compare'} {/* Change button text based on loading state */}
        </button>
      </form>
      {result && (
        <div className={styles.resultsContainer}>
          {/* Convert and display the results as a table */}
          {convertToTable(result.RESPONSE_GROUP?.RESPONSE.RESPONSE_DATA.PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY || [])}
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonForm;
