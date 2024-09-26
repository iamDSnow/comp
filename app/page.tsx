import React from 'react';
import PropertyComparisonForm from '@/app/components/propertyComparisonForm';
import PropertyInfoForm from '@/app/components/PropertyInfoForm';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Comparison Tool</h1>
      <PropertyComparisonForm />
      <PropertyInfoForm />
    </div>
  );
};

export default Home;