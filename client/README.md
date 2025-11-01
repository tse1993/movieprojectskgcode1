# Movie Pulse - Frontend Client

A modern, feature-rich movie discovery and social platform built with React 19 and Vite. Movie Pulse allows users to discover movies, rate them, manage favorites and watchlists, and engage with a community through real-time activity feeds and comments.

## Technology Stack

### Core
- **React 19.1.1** - Latest React with modern features
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **JavaScript** with JSDoc type annotations for type safety

### UI & Styling
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible component system
- **Radix UI** - Headless UI primitives for accessibility
- **Lucide React** - Beautiful icon library
- **Sonner** - Elegant toast notifications
- **next-themes** - Theme management (light/dark mode)

### State Management
- **React Context API** - Global authentication state
- **Local Component State** - Feature-specific state management

## Features

### Authentication
- User registration and login with JWT authentication
- Password reset and forgot password functionality
- Persistent sessions with localStorage
- Secure token-based API communication

### Movie Discovery
- Search movies with debounced input
- Browse popular movies, top-rated, and new releases
- Filter by genre (Action, Drama, Sci-Fi, Comedy, Thriller, Romance)
- Featured hero section with movie backdrops
- Detailed movie information with trailers, cast, and crew

### User Interactions
- **Rating System**: Rate movies on a 1-10 star scale
- **Favorites**: Save favorite movies for quick access
- **Watchlist**: Track movies to watch later
- **Comments**: Engage in community discussions on movies

### Social Features
- Real-time activity feed using Server-Sent Events (SSE)
- View other users' public profiles
- See community activity (ratings, comments, favorites)
- Live notifications of new activities

### User Profile
- Personal statistics dashboard
- Manage favorites with filtering and sorting
- View rated movies with analytics
- Watchlist management
- Profile settings (name, password change)

## Project Structure

```
client/
├── public/                    # Static assets
├── src/
│   ├── assets/
│   │   ├── lib/              # Utilities (cn function for className merging)
│   │   ├── types/            # JSDoc type definitions
│   │   │   ├── feed/
│   │   │   ├── movieDisplays/
│   │   │   ├── pagesProps/
│   │   │   └── userProfile/
│   │   └── ui/               # Shadcn/ui components (15 components)
│   ├── components/           # Feature components (19 components)
│   │   ├── CookieNotification/
│   │   ├── Dashboard/        # Main landing page
│   │   ├── FeedPage/         # Real-time activity feed
│   │   ├── Header/           # Navigation and search
│   │   ├── HeroSection/      # Featured movie display
│   │   ├── Login/            # Authentication UI
│   │   ├── MovieCard/        # Movie preview card
│   │   ├── MovieComments/    # Comments section
│   │   ├── MovieDetails/     # Full movie modal
│   │   ├── MovieGrid/        # Grid layout
│   │   ├── MovieSection/     # Horizontal movie list
│   │   ├── NewReleases/      # New releases page
│   │   ├── PopularMovies/    # Popular movies page
│   │   ├── Root/             # App shell and state management
│   │   ├── Settings/         # User settings
│   │   ├── StarRating/       # Interactive rating component
│   │   ├── TopRated/         # Top-rated movies page
│   │   ├── UserProfile/      # User profile with tabs
│   │   └── UserProfileModal/ # Public profile viewer
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── services/
│   │   └── api.js            # Centralized API service layer
│   ├── index.css             # Global styles and Tailwind config
│   └── main.jsx              # Application entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── components.json           # Shadcn/ui configuration
├── jsconfig.json             # Path aliases configuration
└── eslint.config.js          # ESLint rules
```

## Architecture

### Container/View Pattern
The application follows a strict separation of concerns:
- **Container components** (e.g., `DashboardPage.jsx`) handle state, business logic, data fetching, and event handlers
- **View components** (e.g., `DashboardView.jsx`) are pure presentational components that receive props only

This pattern ensures maintainability, testability, and clear separation between logic and UI.

### Custom Routing
- No external routing library (no React Router)
- Routing managed in `Root.jsx` with state-based view switching
- Views: main, settings, profile, feed, popular, top_rated, new_releases
- Navigation through prop callbacks

### API Integration
- Centralized API service in `src/services/api.js`
- Bearer token authentication from localStorage
- Consistent error handling and response processing
- Real-time updates via Server-Sent Events (SSE)

### Type Safety
- JSDoc type annotations throughout the codebase
- Custom type definitions in `src/assets/types/`
- Types for User, Movie, MovieRating, FavoriteMovie, WatchlistMovie, and more

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client folder:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)

## Key Components

### UI Components (15 Shadcn/ui components)
- Button, Card, Dialog, Input, Label
- Select, Tabs, Progress, Avatar
- Alert Dialog, Dropdown Menu, Separator
- Scroll Area, Skeleton, Toaster

### Feature Components (19 components)
All feature components follow the Container/View pattern with co-located styles (`.styles.css` files).

## Styling

- **Tailwind CSS 4** with utility-first approach
- Light/dark mode support via CSS custom properties
- Custom theme configuration in `index.css`
- Consistent design tokens for colors, spacing, and typography
- Accessible component styling via Radix UI primitives

## Development Workflow

### Code Organization
- Feature-based folder structure
- Co-located styles with components
- Centralized type definitions
- Separation of concerns (services, contexts, components)

### Best Practices
- JSDoc annotations for type safety
- Consistent naming conventions (Page.jsx vs View.jsx)
- Error handling with try-catch and toast notifications
- Loading states and skeleton screens
- Accessibility with ARIA-compliant components
- Performance optimizations (lazy loading, debouncing, parallel requests)

## API Endpoints

The frontend integrates with the backend API for:
- **Authentication**: register, login, getProfile
- **Movies**: search, popular, top-rated, upcoming, by genre, details
- **User Actions**: rate, favorite, watchlist management
- **Social**: comments, activity feed (SSE), public profiles
- **Profile**: update profile, change password, statistics

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)

## Contributing

1. Follow the Container/View pattern for new components
2. Use JSDoc annotations for type safety
3. Add corresponding `.styles.css` files for component-specific styles
4. Follow existing naming conventions
5. Test dark mode compatibility
6. Ensure accessibility standards are met

## License

This project is part of Movie Pulse application.

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vite.dev/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Accessible primitives from [Radix UI](https://www.radix-ui.com/)
