'use client';
import React, { useState } from 'react';
import styles from './PropertyInfoForm.module.scss'; // Import the SCSS module

// Update the type definition in PropertyInfoForm.tsx
interface PropertyInfoResponse {
  status: {
    version: string;
    code: number;
    msg: string;
    total: number;
    page: number;
    pagesize: number;
    responseDateTime: string;
    transactionID: string;
    attomId: number;
  };
  property: Array<{
    identifier: {
      Id: number;
      fips: string;
      apn: string;
      attomId: number;
    };
    address: {
      line1: string;
      locality: string;
      countrySubd: string;
      postal1: string;
    };
    summary: {
      yearBuilt: number;
      propType: string;
      propClass: string;
    };
    sale: {
      sellerName: string;
      amount: {
        saleAmt: number;
      };
    };
    assessment: {
      assessed: {
        assdTtlValue: number;
      };
      tax: {
        taxAmt: number;
      };
    };
    // Add any other relevant properties here
  }>;
}

const PropertyInfoForm: React.FC = () => {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyInfoResponse | null>(null);

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

      const data: PropertyInfoResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult(null); // Reset result on error
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.box}>Property Field</th>
                <th className={styles.box}>Value</th>
              </tr>
            </thead>
            <tbody>
  {result.property.map((prop) => (
    <>
      <tr key={`${prop.identifier.Id}-address`}>
        <td className={styles.box}>Address</td>
        <td className={styles.box}>{prop.address.line1}, {prop.address.locality}, {prop.address.countrySubd} {prop.address.postal1}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-yearBuilt`}>
        <td className={styles.box}>Year Built</td>
        <td className={styles.box}>{prop.summary.yearBuilt}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-propType`}>
        <td className={styles.box}>Property Type</td>
        <td className={styles.box}>{prop.summary.propType}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-propClass`}>
        <td className={styles.box}>Property Class</td>
        <td className={styles.box}>{prop.summary.propClass}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-sellerName`}>
        <td className={styles.box}>Seller Name</td>
        <td className={styles.box}>{prop.sale.sellerName}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-saleAmt`}>
        <td className={styles.box}>Sale Amount</td>
        <td className={styles.box}>${prop.sale.amount.saleAmt.toLocaleString()}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-assessedValue`}>
        <td className={styles.box}>Assessed Value</td>
        <td className={styles.box}>${prop.assessment.assessed.assdTtlValue.toLocaleString()}</td>
      </tr>
      <tr key={`${prop.identifier.Id}-taxAmt`}>
        <td className={styles.box}>Tax Amount</td>
        <td className={styles.box}>${prop.assessment.tax.taxAmt.toFixed(2)}</td>
      </tr>
    </>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyInfoForm;
