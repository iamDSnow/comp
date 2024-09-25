import { NextApiRequest, NextApiResponse } from 'next';
import { PropertyData } from '@/types';
import * as XLSX from 'xlsx';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertyData>
) {
  if (req.method === 'POST') {
    const { address } = req.body;

    // This is where you would typically fetch data from Zillow or Redfin APIs
    // For this example, we'll use mock data
    const mockData: PropertyData = {
      submittedProperty: {
        address: address,
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 2000,
      },
      comparisons: [
        {
          address: '123 Nearby St',
          price: 495000,
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1950,
        },
        {
          address: '456 Close Ave',
          price: 510000,
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 2050,
        },
      ],
    };

    // Generate Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      mockData.submittedProperty,
      ...mockData.comparisons,
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Property Comparisons');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // In a real application, you would save this file or send it to the client
    // For this example, we'll just log its creation
    console.log('Excel file generated');

    res.status(200).json(mockData);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}