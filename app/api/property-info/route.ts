import { NextRequest, NextResponse } from 'next/server';

const ATTOM_API_URL = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile';

// Handle POST requests
export async function POST(req: NextRequest) {
  const { address1, address2 } = await req.json();

  // Validate input
  if (!address1 || !address2) {
    return NextResponse.json(
      { error: 'Both address fields are required.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ATTOM_API_URL}?address1=${encodeURIComponent(address1)}&address2=${encodeURIComponent(address2)}`,
      {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_ATTOM_API as string,
        },
      }
    );

    if (response.ok) {
      const propertyData = await response.json();
      return NextResponse.json(propertyData, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch property information', details: errorData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
