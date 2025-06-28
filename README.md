# Portfolio Management System

A comprehensive, enterprise-grade portfolio management system built with React, featuring advanced security, performance optimization, and real-time monitoring capabilities.

## 🚀 Features

### Core Functionality
- **Portfolio Management**: Track and manage investment portfolios with real-time data
- **Asset Allocation**: Visualize and optimize portfolio diversification
- **Performance Analytics**: Comprehensive performance tracking and reporting
- **Order Entry**: Execute buy/sell orders with validation
- **Transaction History**: Detailed transaction tracking and filtering
- **Reports & Analytics**: Generate comprehensive financial reports

### Advanced Features
- **Audit Logging**: Complete user action tracking and compliance
- **Exception Handling**: Robust error boundaries and validation
- **Performance Optimization**: Caching, lazy loading, and legacy system integration
- **Security Features**: Input sanitization, XSS protection, rate limiting
- **System Monitoring**: Real-time system health and performance metrics

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Material-UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **Testing**: Vitest, React Testing Library
- **Data Visualization**: Recharts, MUI Charts
- **Date Handling**: date-fns, MUI Date Pickers
- **HTTP Client**: Axios
- **Mock API**: JSON Server

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev:all
   ```

   This will start both the React development server (port 5173) and the JSON Server mock API (port 3001).

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

The project includes comprehensive testing with Vitest and React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run performance tests
npm run test:performance

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Structure

- **Unit Tests**: `src/utils/__tests__/` - Testing utility functions
- **Integration Tests**: `src/components/__tests__/` - Testing React components
- **Performance Tests**: `src/test/performance.test.js` - Load testing and performance validation

### Test Coverage

The testing suite covers:
- ✅ Utility functions (formatting, calculations, validation)
- ✅ Component rendering and user interactions
- ✅ Error boundary functionality
- ✅ Performance under load
- ✅ Security validation
- ✅ API integration

## 🏗️ Project Structure

```
portfolio-management-system/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Layout and navigation
│   │   ├── charts/         # Data visualization
│   │   ├── forms/          # Form components
│   │   └── tables/         # Data table components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API and business logic services
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   ├── test/               # Test setup and utilities
│   └── types/              # TypeScript type definitions
├── db.json                 # Mock database
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Portfolio Management System
VITE_APP_VERSION=1.0.0
```

### JSON Server Configuration

The mock API server runs on port 3001 and serves data from `db.json`. You can customize the database schema in `src/constants/databaseSchema.js`.

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security Features

### Input Validation & Sanitization
- XSS protection
- SQL injection prevention
- Input type validation
- Rate limiting

### Authentication & Authorization
- Session management
- Role-based access control
- Secure token handling

### Audit Logging
- Complete user action tracking
- Security event monitoring
- Compliance reporting

## 📊 Performance Features

### Optimization
- Lazy loading of components
- Intelligent caching system
- Memory management
- Legacy system integration

### Monitoring
- Real-time performance metrics
- Response time tracking
- Memory usage monitoring
- Cache hit rate analytics

## 🐛 Error Handling

### Error Boundaries
- Graceful error recovery
- User-friendly error messages
- Error reporting system
- Technical details toggle

### Validation
- Form validation
- API response validation
- Data integrity checks
- Business logic validation

## 📈 Monitoring & Analytics

### System Monitor
- Real-time system health
- Performance metrics
- Security events
- Audit logs

### Export Capabilities
- JSON export
- CSV export
- Excel export
- Custom report generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test examples

## 🔄 Version History

- **v1.0.0** - Initial release with core portfolio management features
- **v1.1.0** - Added advanced security and performance features
- **v1.2.0** - Comprehensive testing suite and documentation

## 🙏 Acknowledgments

- Material-UI for the component library
- Recharts for data visualization
- Vite for the build tool
- Vitest for testing framework
- JSON Server for mock API

---

**Built with ❤️ for modern portfolio management**
