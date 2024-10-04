"use client";

import React, { useState } from 'react';
import styles from './PropertyTable.module.scss';
import { PropertyData, Property } from '@/types';

// Define a type for the form input values
interface FormData {
  address1: string;
  city: string;
  state: string;
  zip: string;
}

// Define a type for the cleaned property
interface CleanedProperty {
  [key: string]: string | number | CleanedProperty | Array<string | number | CleanedProperty>;
}

const PropertyComparisonForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ address1: '', city: '', state: '', zip: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: PropertyData = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to fetch property information.' } as PropertyData);
    } finally {
      setLoading(false);
    }
  };

  // Clean keys by removing unwanted characters and formatting
  const cleanKeys = (obj: Property | Record<string, unknown>): CleanedProperty => {
    if (Array.isArray(obj)) {
      return obj.map(cleanKeys) as unknown as CleanedProperty;
    }
    if (obj && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        // Remove '_ext', underscores, '@' symbols, and add space between camel case words
        let cleanedKey = key.replace(/@/g, '').replace(/_ext/g, '').replace(/_/g, '');
        cleanedKey = cleanedKey.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase

        // Exclude PrivacyType and SiteMailAddressSameIndicator rows
        if (cleanedKey === 'PrivacyType' || cleanedKey === 'Site Mail Address Same Indicator') {
          return acc;
        }

        acc[cleanedKey] = cleanKeys(value);
        return acc;
      }, {} as CleanedProperty);
    }
    return obj as CleanedProperty;
  };

  // Convert property data to tables
  const convertToTable = (properties: Property[]) => {
    return properties.map((property, index) => {
      const cleanedProperty = cleanKeys(property);

      if (!cleanedProperty || typeof cleanedProperty !== 'object') return null;

      // Create separate tables for each property
      return (
        <div key={index} className={styles.propertyTableContainer}>
          <h3 className={styles.propertyHeader}>Property {index + 1}</h3>
          <table className={styles.propertyTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Pointer</th>
                <th className={styles.tableHeader}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cleanedProperty).map(([key, value]) => (
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

  // Function to render nested values in columns
  const renderNestedValue = (value: string | number | CleanedProperty | Array<string | number | CleanedProperty>) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <div key={index}>{renderNestedValue(item)}</div>
      ));
    }

    if (value && typeof value === 'object') {
      return Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey} className={styles.nestedValue}>
          <strong>{subKey}:</strong> {renderNestedValue(subValue as string | number | CleanedProperty)}
        </div>
      ));
    }

    return value;
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.propertyForm}>
        {['address1', 'city', 'state', 'zip'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field as keyof FormData]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className={`${styles.inputField} border p-2 mr-2`}
          />
        ))}
        <button type="submit" disabled={loading} className={`${styles.submitButton} bg-blue-500 text-white p-2 rounded`}>
          {loading ? 'Loading...' : 'Compare'}
        </button>
      </form>
      {result && (
        <div className={styles.resultsContainer}>
          {convertToTable(result.RESPONSE_GROUP?.RESPONSE.RESPONSE_DATA.PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY || [])}
        </div>
      )}
    </div>
  );
};

export default PropertyComparisonForm;
