# Frontend Application

A clean Angular 18 application with core infrastructure setup, ready for development. This project maintains essential services, standards, and logging capabilities.

## 🚀 Features

- **Modern Angular 18** with standalone components and latest features
- **Core Infrastructure** with HTTP interceptors and error handling
- **Admin Error Logging** system with daily file management
- **Authentication Services** ready for integration
- **API Integration** with robust error handling
- **Code Quality Tools** (ESLint, Prettier, Husky)
- **Type Safety** with comprehensive TypeScript interfaces
- **Modular Architecture** with feature-based organization

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Angular CLI** (v18.0.0 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd academy-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `src/environments/environment.ts` with your development API URL
   - Update `src/environments/environment.prod.ts` with your production API URL

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200` - You'll be redirected to the Sign-in page

## 🔐 **Sign-in Page**

The application now includes a modern Sign-in page with:

### **Features:**
- **Clean, Modern Design** - Professional UI with gradient background
- **Form Validation** - Real-time validation with error messages
- **Material Design** - Angular Material components for consistent UI
- **Responsive Layout** - Works perfectly on all device sizes
- **Loading States** - User feedback during form submission
- **Error Handling** - Comprehensive error logging and user notifications
- **Accessibility** - WCAG compliant with proper ARIA labels

### **Form Fields:**
- **Email Address** - Required with email validation
- **Password** - Required with minimum length validation
- **Remember Me** - Checkbox for persistent login
- **Forgot Password** - Link to password reset (placeholder)

### **Navigation:**
- **Sign Up Link** - Direct link to registration page
- **Terms & Privacy** - Footer links for legal compliance

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── services/           # Business logic services
│   │   │   ├── api.service.ts         # Base API service
│   │   │   ├── auth.service.ts        # Authentication service
│   │   │   └── error-logging.service.ts # Error logging service
│   │   ├── interceptors/       # HTTP interceptors
│   │   │   └── error.interceptor.ts   # Global error handling
│   │   └── models/             # Data models & interfaces
│   │       └── user.model.ts          # User-related models
│   ├── shared/                 # Reusable components (currently empty)
│   ├── features/               # Feature modules (currently empty)
│   ├── app.component.ts        # Root component
│   ├── app.component.scss      # Root component styles
│   ├── app.config.ts           # Application configuration
│   ├── app.routes.ts           # Routing configuration
│   └── main.ts                 # Application bootstrap
├── assets/                     # Static assets
├── environments/               # Environment configurations
└── styles.scss                 # Global styles
```

## 🔧 Core Services

### **API Service** (`core/services/api.service.ts`)
- Base HTTP service for API communication
- Error handling and retry logic
- Request/response interceptors

### **Authentication Service** (`core/services/auth.service.ts`)
- User authentication and authorization
- Token management (JWT)
- User session handling
- Role-based access control

### **Error Logging Service** (`core/services/error-logging.service.ts`)
- Frontend error tracking and logging
- Daily log file management
- Local storage (IndexedDB/localStorage)
- Admin monitoring capabilities

### **Error Interceptor** (`core/interceptors/error.interceptor.ts`)
- Global HTTP error handling
- Automatic error logging
- Consistent error responses

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with optimizations
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎯 Current Status

- ✅ **Clean Angular 18 Setup** - Basic application structure
- ✅ **Core Services** - API, Auth, Error Logging services ready
- ✅ **HTTP Interceptors** - Global error handling configured
- ✅ **Build System** - Working build and development server
- ✅ **Code Quality** - ESLint, Prettier, Husky configured
- ✅ **TypeScript** - Full type safety with interfaces

## 🚀 Next Steps

The project is ready for:

1. **UI Component Development** - Add components as needed
2. **Feature Module Creation** - Build specific features
3. **API Integration** - Connect to backend services
4. **Authentication Implementation** - Add login/logout UI
5. **Dashboard Creation** - Build admin and user dashboards

## 📚 Development Guidelines

- Follow Angular style guide and best practices
- Use TypeScript for type safety
- Implement proper error handling
- Write comprehensive tests
- Use consistent naming conventions
- Document complex logic with TSDoc comments

## 🔍 Error Logging

The application includes a comprehensive error logging system:

- **Frontend Errors** - JavaScript errors, HTTP errors, validation errors
- **Daily Log Files** - Organized by date for easy management
- **Local Storage** - Persistent storage using IndexedDB
- **Admin Access** - View and download error logs
- **Extensible** - Ready for backend integration

## 📞 Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Ready for Development** - This is a clean, production-ready Angular 18 application with core infrastructure in place.