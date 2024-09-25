export interface Property {
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
  }
  
  export interface PropertyData {
    submittedProperty: Property;
    comparisons: Property[];
  }