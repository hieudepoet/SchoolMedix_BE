# SchoolMedix Project

Welcome to the SchoolMedix project, a comprehensive health management system designed for schools. This README provides step-by-step instructions to set up and run the project locally. Explore the live version at [https://schoolmedix.web.app/](https://schoolmedix.web.app/). Use the following credentials for testing:

- **Admin**: Username: `mndkhanh@gmail.com`, Password: `12345678`
- **Nurse**: Username: `mndkhanh3@gmail.com`, Password: `12345678`
- **Parent**: Username: `phamthanhqb2005@gmail.com`, Password: `12345678`

## Prerequisites

Ensure the following are installed on your system before starting:
- **Node.js** (version 14.x or higher recommended)
- **npm** (included with Node.js)
- **Git** (required for cloning the repository)

## Project Structure

The project is organized into a root folder with two main components:
- **`SchoolMedix_js`**: Root directory (create this folder locally and add the repositories below)
  - **`SchoolMedix_BE`**: Backend server (clone from [https://github.com/hieudepoet/SchoolMedix_BE](https://github.com/hieudepoet/SchoolMedix_BE))
  - **`SchoolMedix_FE/fe`**: Frontend user interface (clone from [https://github.com/hieudepoet/SchoolMedix_FE](https://github.com/hieudepoet/SchoolMedix_FE))

## Installation and Running

### Backend (Server)

1. Navigate to the backend directory:

   ```bash
   cd SchoolMedix_BE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local server:

   ```bash
   npm run dev
   ```

   - The server will run on a default port (e.g., 3000). Check the console for the exact URL.

### Frontend (UI)

1. Navigate to the frontend directory:

   ```bash
   cd SchoolMedix_FE/fe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend application:

   ```bash
   npm run dev
   ```

   - The UI will be available in your browser, typically at `http://localhost:5173` (or as specified in the console).

## Usage

- Open your browser and access the frontend URL (e.g., `http://localhost:5173`).
- Ensure the backend server is running to handle API requests.
- Follow the UI prompts to manage health records, campaigns, and medication requests.

## Troubleshooting

- If the server or UI fails to start, ensure all dependencies are installed and ports are not in use.
- Check the console logs for error messages and resolve accordingly.

## Contributing

Feel free to contribute by submitting issues or pull requests. Please follow the project's coding standards.

