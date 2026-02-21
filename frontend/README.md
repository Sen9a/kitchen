# Kitchen Frontend

React-based frontend for the Kitchen Warehouse Management System.

## Features

- 📊 **Planes Table**: Display all planes with their details
  - ID, Name, Image preview
  - Drone Type, Communication Type, Video Type
  - Sortable and filterable columns
  - Row selection with checkboxes
- 🎨 **Material UI**: Modern, responsive design
- 🔄 **CRUD Operations**: Create, Read, Update, Delete planes
- ⚡ **FastAPI Backend Integration**: Seamless API communication

## Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:8000`

## Installation

```bash
# Install dependencies
npm install
```

## Running the App

```bash
# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── PlanesTable.js    # Main table component
│   ├── services/
│   │   └── api.js            # API client
│   ├── App.js                # Main app component
│   └── index.js              # Entry point
├── .env                      # Environment variables
├── package.json
└── README.md
```

## API Configuration

The frontend connects to the backend at `http://localhost:8000` by default. You can change this in the `.env` file:

```
REACT_APP_API_URL=http://your-backend-url:port
```

## Technologies Used

- React 18
- Material UI 5
- MUI X DataGrid
- Axios
