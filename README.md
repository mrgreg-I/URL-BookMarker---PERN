# URL-BookMarker---PERN
A URL Bookmarker application built with PostgreSQL, Express, React, and Node.js (PERN). Easily create, read, update, and delete bookmarks with categories and track how many times each link has been clicked.

## Features

### Core Functionality
- **Bookmark Management**: Create, read, update, and delete bookmarks
- **Categorization**: Organize bookmarks into custom categories
- **Click Counter**: Track the number of times each bookmark has been accessed
- **Full CRUD Operations**: Complete Create, Read, Update, and Delete functionality
- **Get All Bookmarks**: Retrieve and display all bookmarks with their details

### Key Components
- **Bookmarks**: Individual saved URLs with metadata
- **Categories**: Custom tags/categories for organizing bookmarks
- **Click Tracking**: Counter for monitoring bookmark usage

## Technology Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Development**: Nodemon, ESLint

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
│       ├── server.js      # Server entry point
│       ├── config/
│       │   ├── db.js      # Database configuration
│       │   └── swagger.js # Swagger/OpenAPI configuration
│       ├── controllers/   # Request handlers
│       ├── models/        # Data models
│       ├── routes/        # API route definitions with Swagger annotations
│       └── middleware/    # Express middleware
```

## API Documentation
See [API.md](./API.md) for complete API endpoint documentation.

### Interactive Documentation
When `API_DOC=true` is set in the environment variables, you can access the interactive Swagger UI documentation at:
```
http://localhost:3000/api-docs
```

### Main API Routes
- `/games` - Game management
- `/moderator` - Moderator authentication and controls
- `/group` - Team/group management
- `/round` - Round operations
- `/threat` - Threat scenario management
- `/card` - Response card management
- `/score` - Scoring and evaluation

## Authentication
Protected routes require JWT authentication. Moderators must:
1. Register via `/moderator/register`
2. Login via `/moderator/login` to receive a JWT token
3. Include the token in the Authorization header: `Bearer <token>`

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses Nodemon to automatically restart the server on file changes.

### Database Management

#### Running Migrations
```bash
# Run all pending migrations
npm run db:migrate

# Add new migrations
# Create a new file in migrations/ folder with sequential numbering
# Example: migrations/002_add_new_feature.sql
```

#### Database Scripts
- **`npm run db:provision`** - Creates the database if it doesn't exist
- **`npm run db:migrate`** - Runs all pending SQL migrations
- **`npm run db:setup`** - Runs both provision and migrate (for initial setup)

#### Migration System Features
- Tracks executed migrations in a `migrations` table
- Only runs new migrations that haven't been executed
- Supports transactional migrations with automatic rollback on failure
- Sequential execution based on filename sorting

### Testing the API
Test if the server is running:
```bash
curl http://localhost:5000/test
# Response: "AHHHHHHHHHH!!!"
```

## Database Schema

### Core Tables (from initial migration)
- `users` - User accounts with authentication
- `cards` - Card information with user association
- `transactions` - Transaction records with status tracking
- `migrations` - Tracks executed database migrations

### Game Tables (to be added in future migrations)
- `game` - Game sessions
- `moderator` - Game facilitators
- `game_settings` - Configurable game parameters
- `group` - Participating teams
- `rounds` - Game rounds
- `threat` - Security scenarios
- `category` - Classification system
- `threat_category` - Threat categorization
- `threat_answer` - Correct responses to threats
- `card_usage` - Track card usage limits
- `round_card_selection` - Cards played per round
- `score` - Team scoring

## Security Considerations
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Helmet.js for security headers
- Environment variables for sensitive configuration
- Input validation on all endpoints

## License
ISC

## Support
For issues or questions, please open an issue in the repository.