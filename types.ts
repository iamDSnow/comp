export interface Property {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
}

// Define the interface for the RESPONSE_GROUP
export interface ResponseGroup {
  RESPONSE: {
      RESPONSE_DATA: {
          PROPERTY_INFORMATION_RESPONSE_ext: {
              SUBJECT_PROPERTY_ext: {
                  PROPERTY: Property[]; // Assuming PROPERTY is an array of Property
              };
          };
      };
  };
}

// Define the PropertyData interface
export interface PropertyData {
  submittedProperty: Property; // The property submitted by the user for comparison
  comparisons: Property[];      // Array of compared properties
  RESPONSE_GROUP?: ResponseGroup; // Optional RESPONSE_GROUP object
  status?: string;              // Optional status field for the comparison result
  error?: string;               // Optional error message
}
