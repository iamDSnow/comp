
# Property Comparison App

This is a Next.js 14 application built using TypeScript and React, with SASS for styling. The app utilizes the **Attom API** to fetch single property records and enables the comparison of multiple property records in an easy-to-read table format.

## Features

- **Fetch Property Data:** Uses the Attom API to pull detailed information about properties.
- **Compare Properties:** Users can input property addresses, and the app will compare multiple properties side by side.
- **Responsive Design:** The app is fully responsive, with horizontal scrolling for tables that exceed the screen width.
- **Cleaned Data Display:** The app cleans up the API response, removing unnecessary characters like underscores (`_`) and `@` symbols for a more readable output.
- **SASS Styling:** SASS is used for styling, providing a consistent and customizable design across the application.

## Technologies Used

- **Next.js 14**: Framework for server-side rendering and static site generation.
- **TypeScript**: Strongly typed language for writing JavaScript applications.
- **React**: Front-end library for building user interfaces.
- **SASS**: CSS preprocessor for writing more maintainable and modular styles.
- **Attom API**: Third-party API for fetching real estate and property data.

## Installation

To get started with the application, follow these steps:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- **Attom API Key**: Sign up for an account with Attom to get an API key. You'll need this to fetch property data.

### Clone the Repository

```bash
git clone https://github.com/iamdsnow/comp.git
cd property-comparison-app
npm install

NEXT_PUBLIC_ATTOM_API_KEY=your-attom-api-key

npm run dev


