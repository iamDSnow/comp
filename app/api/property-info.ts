import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ESTATED_API_URL = 'https://apis.estated.com/v4/property';
const ESTATED_API_TOKEN = 'YOUR_TOKEN_HERE'; // Replace with your actual token

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address } = req.body;

    try {
      // Call Estated API
      const response = await axios.get(`${ESTATED_API_URL}`, {
        params: {
          token: ESTATED_API_TOKEN,
          combined_address: address,
        },
      });

      const propertyData = response.data;

      // Log the property data to console
      console.log('Property Data:', propertyData);

      // Generate Excel file
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([propertyData]);
      XLSX.utils.book_append_sheet(wb, ws, 'Property Information');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      // Set the appropriate headers to download the Excel file
      res.setHeader('Content-Disposition', 'attachment; filename=property_information.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(excelBuffer);

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching property information' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
