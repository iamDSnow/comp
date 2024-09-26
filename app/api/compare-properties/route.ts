import { NextRequest, NextResponse } from 'next/server';

const ATTOM_API_URL = 'https://api.gateway.attomdata.com/property/v2/salescomparables/address';

export async function POST(req: NextRequest) {
  const { address1, city, state, zip } = await req.json();

  // Validate input
  if (!address1 || !city || !state || !zip) {
    return NextResponse.json(
      { error: 'Address, city, state, and zip are required.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ATTOM_API_URL}/${encodeURIComponent(address1)}/${encodeURIComponent(city)}/US/${encodeURIComponent(state)}/${zip}?searchType=Radius&minComps=1&maxComps=10&miles=5&bedroomsRange=2&bathroomRange=2&sqFeetRange=600&lotSizeRange=2000&saleDateRange=6&yearBuiltRange=10&ownerOccupied=Both&distressed=IncludeDistressed`,
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
