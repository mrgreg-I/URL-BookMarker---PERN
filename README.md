# URL-BookMarker---PERN
A URL Bookmarker application built with PostgreSQL, Express, React, and Node.js (PERN). Easily create, read, update, and delete bookmarks with categories and track how many times each link has been clicked.

## Features

### Core Functionality
- **Bookmark Management**: Create, read, update, and delete bookmarks
- **Categorization**: Organize bookmarks into categories
- **Click Counter**: Track the number of times each bookmark has been accessed (clicked)
- **Full CRUD Operations**: Complete Create, Read, Update, and Delete functionality
- **Get All Bookmarks**: Retrieve and display all bookmarks with their details

### Key Components
- **Bookmarks**: Individual saved URLs with metadata
- **Categories**: Tags/Categories for organizing bookmarks
- **Click Tracking**: Counter for monitoring bookmark usage

## Technology Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Setup Steps

1. Clone the repository:
```bash
git clone [repository-url]
cd URL-BookMarker---PERN
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend/urlbookmarker
npm install
```

4. Configure environment variables:
Create a `.env` file in the server directory with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/url_bookmarker
PORT=5000
```

5. Set up the database:
```bash
cd server
npx prisma migrate dev
```

6. Start the development servers:

Backend:
```bash
cd server
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend/urlbookmarker
npm run dev
```

## Project Structure
``` 
URL-BookMarker---PERN/
├── README.md              # This file
├── frontend/
│   └── urlbookmarker/
│       ├── package.json   # React dependencies
│       ├── vite.config.js # Vite configuration
│       ├── index.html     # HTML entry point
│       ├── postcss.config.cjs
│       ├── src/
│       │   ├── main.jsx   # React entry point
│       │   ├── App.jsx    # Main app component
│       │   ├── App.css    # App styles
│       │   ├── BookmarkDialog.jsx  # Bookmark form component
│       │   ├── BookmarkDialog.css
│       │   ├── index.css  # Global styles
│       │   └── assets/    # Static assets
│       └── public/        # Public files
└── server/
    ├── package.json       # Node.js dependencies
    ├── tsconfig.json      # TypeScript configuration
    ├── index.ts           # Server entry point
    ├── prisma.config.ts   # Prisma configuration
    ├── lib/
    │   └── prisma.ts      # Prisma client setup
    ├── prisma/
    │   └── schema.prisma  # Database schema
    └── generated/         # Prisma generated files
        └── prisma/
``` 
### Database Management

## Database Schema

### Core Tables (from initial migration)
- `urlbookmarker` - URL Bookmarks


## License
ISC

## Support
For issues or questions, please open an issue in the repository.
