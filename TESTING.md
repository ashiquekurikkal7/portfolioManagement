# Testing Guide

This guide covers the comprehensive testing strategy for the Portfolio Management System, including unit tests, integration tests, performance tests, and best practices.

## 🧪 Testing Strategy

### Testing Pyramid

Our testing approach follows the testing pyramid:

```
    /\
   /  \     E2E Tests (Few)
  /____\    Integration Tests (Some)
 /______\   Unit Tests (Many)
```

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test component interactions and API integration
- **Performance Tests**: Test system performance under load
- **E2E Tests**: Test complete user workflows (future enhancement)

### Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **Performance Tests**: All critical paths
- **Overall Coverage**: 85%+

## 🚀 Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install testing dependencies (if not already installed)
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:performance   # Performance tests only

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch

# Run tests with UI (visual interface)
npm run test:ui
```

### Test Output

Tests will show:
- ✅ Passing tests
- ❌ Failing tests
- 📊 Coverage report
- ⏱️ Test execution time

## 📁 Test Structure

```
src/
├── utils/
│   └── __tests__/
│       └── dataUtils.test.js      # Unit tests for utilities
├── components/
│   └── __tests__/
│       └── ErrorBoundary.test.jsx # Integration tests for components
└── test/
    ├── setup.js                   # Test configuration
    └── performance.test.js        # Performance tests
```

## 🧩 Unit Tests

### What to Test

Unit tests focus on testing individual functions and utilities in isolation:

- **Utility Functions**: Formatting, calculations, validation
- **Helper Functions**: Data transformation, business logic
- **Pure Functions**: Functions with no side effects

### Example Unit Test

```javascript
import { describe, it, expect } from 'vitest';
import { formatCurrency, calculatePercentageChange } from '../dataUtils';

describe('Data Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive change', () => {
      expect(calculatePercentageChange(100, 110)).toBe(10);
    });

    it('should calculate negative change', () => {
      expect(calculatePercentageChange(100, 90)).toBe(-10);
    });

    it('should handle zero change', () => {
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });
  });
});
```

### Unit Testing Best Practices

1. **Test One Thing at a Time**
   ```javascript
   // Good
   it('should format currency with dollar sign', () => {
     expect(formatCurrency(100)).toBe('$100.00');
   });

   // Bad
   it('should format currency and handle edge cases', () => {
     expect(formatCurrency(100)).toBe('$100.00');
     expect(formatCurrency(-100)).toBe('-$100.00');
     expect(formatCurrency(0)).toBe('$0.00');
   });
   ```

2. **Use Descriptive Test Names**
   ```javascript
   // Good
   it('should return error color for negative percentage changes', () => {
     expect(getChangeColor(-5.5)).toBe('error');
   });

   // Bad
   it('should work with negative numbers', () => {
     expect(getChangeColor(-5.5)).toBe('error');
   });
   ```

3. **Test Edge Cases**
   ```javascript
   it('should handle null and undefined values', () => {
     expect(formatNumber(null)).toBe('0');
     expect(formatNumber(undefined)).toBe('0');
   });
   ```

## 🔗 Integration Tests

### What to Test

Integration tests focus on testing component interactions and API integration:

- **Component Rendering**: Components render correctly
- **User Interactions**: Click, type, form submissions
- **API Integration**: Data fetching and error handling
- **Component Communication**: Props, events, context

### Example Integration Test

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component</div>;
};

describe('ErrorBoundary Integration', () => {
  it('should render error UI when an error occurs', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </BrowserRouter>
    );

    const toggleButton = screen.getByText('Show technical details');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Technical Information')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing Best Practices

1. **Test User Workflows**
   ```javascript
   it('should complete a full order entry workflow', async () => {
     // Render order form
     // Fill in form fields
     // Submit form
     // Verify success message
     // Check API call was made
   });
   ```

2. **Mock External Dependencies**
   ```javascript
   vi.mock('../../services/apiService', () => ({
     apiService: {
       submitOrder: vi.fn().mockResolvedValue({ success: true })
     }
   }));
   ```

3. **Test Error Scenarios**
   ```javascript
   it('should handle API errors gracefully', async () => {
     apiService.submitOrder.mockRejectedValue(new Error('Network error'));
     
     // Test error handling
     expect(screen.getByText('Failed to submit order')).toBeInTheDocument();
   });
   ```

## ⚡ Performance Tests

### What to Test

Performance tests focus on system performance under various conditions:

- **Load Testing**: Concurrent users and requests
- **Response Time**: API and UI response times
- **Memory Usage**: Memory consumption and leaks
- **Caching**: Cache performance and hit rates

### Example Performance Test

```javascript
describe('Performance Testing', () => {
  it('should handle concurrent API requests', async () => {
    const concurrentRequests = 100;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        performanceService.integrateWithLegacySystem('portfolio_sync', {
          portfolioIds: [i + 1]
        })
      );
    }

    const startTime = performance.now();
    const results = await Promise.all(promises);
    const totalTime = performance.now() - startTime;

    expect(results).toHaveLength(concurrentRequests);
    expect(totalTime).toBeLessThan(10000); // Should complete within 10 seconds
  });

  it('should maintain performance under high cache usage', async () => {
    const cacheOperations = 1000;
    const startTime = performance.now();

    for (let i = 0; i < cacheOperations; i++) {
      performanceService.setCache(`key-${i}`, `value-${i}`);
      performanceService.getCache(`key-${i}`);
    }

    const totalTime = performance.now() - startTime;
    expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
  });
});
```

### Performance Testing Best Practices

1. **Set Realistic Thresholds**
   ```javascript
   expect(totalTime).toBeLessThan(1000); // 1 second threshold
   expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB threshold
   ```

2. **Test Different Scenarios**
   ```javascript
   it('should handle memory pressure gracefully', async () => {
     // Test with large datasets
     // Test memory cleanup
     // Test garbage collection
   });
   ```

3. **Monitor Resource Usage**
   ```javascript
   it('should monitor memory usage during operations', () => {
     const initialMemory = performance.memory?.usedJSHeapSize || 0;
     // Perform operations
     const finalMemory = performance.memory?.usedJSHeapSize || 0;
     expect(finalMemory).toBeLessThanOrEqual(initialMemory + 10 * 1024 * 1024);
   });
   ```

## 🛠️ Test Setup

### Test Configuration

The test setup is configured in `src/test/setup.js`:

```javascript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();
```

### Vite Configuration

Testing is configured in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    }
  }
});
```

## 📊 Coverage Reports

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Output

Coverage reports show:
- **Statements**: Percentage of statements executed
- **Branches**: Percentage of branches executed
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

### Coverage Goals

- **Overall Coverage**: 85%+
- **Critical Paths**: 95%+
- **New Features**: 90%+

## 🔧 Test Utilities

### Custom Test Helpers

Create reusable test utilities in `src/test/helpers.js`:

```javascript
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

export const mockApiResponse = (data) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

export const mockApiError = (status = 500, message = 'Internal Server Error') => {
  return Promise.reject(new Error(message));
};
```

### Test Data Factories

Create test data factories for consistent test data:

```javascript
export const createMockPortfolio = (overrides = {}) => ({
  id: 1,
  name: 'Test Portfolio',
  totalValue: 100000,
  totalQuantity: 100,
  averagePrice: 1000,
  ...overrides
});

export const createMockTransaction = (overrides = {}) => ({
  id: 1,
  securityId: 1,
  securityName: 'Test Security',
  transactionType: 'Buy',
  quantity: 10,
  orderValue: 1000,
  timestamp: new Date().toISOString(),
  ...overrides
});
```

## 🚨 Common Testing Issues

### Async Testing

```javascript
// Good
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe(expectedValue);
});

// Bad
it('should handle async operations', () => {
  someAsyncFunction().then(result => {
    expect(result).toBe(expectedValue);
  });
});
```

### Component Testing

```javascript
// Good
it('should render component with props', () => {
  render(<MyComponent data={testData} />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});

// Bad
it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Mocking

```javascript
// Good - Mock at module level
vi.mock('../services/apiService');

// Bad - Mock inside test
const mockApi = vi.fn();
```

## 📈 Continuous Integration

### GitHub Actions

Tests run automatically on every push:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
```

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit"
    }
  }
}
```

## 🎯 Testing Checklist

### Before Writing Tests
- [ ] Understand the component/function behavior
- [ ] Identify edge cases and error scenarios
- [ ] Plan test structure and organization

### While Writing Tests
- [ ] Write descriptive test names
- [ ] Test one thing at a time
- [ ] Include positive and negative test cases
- [ ] Mock external dependencies
- [ ] Test error handling

### After Writing Tests
- [ ] Run tests locally
- [ ] Check coverage reports
- [ ] Review test readability
- [ ] Ensure tests are maintainable

## 🆘 Troubleshooting

### Common Issues

1. **Tests Not Running**
   ```bash
   # Clear cache
   rm -rf node_modules/.vite
   npm install
   npm test
   ```

2. **Mock Not Working**
   ```javascript
   // Ensure mock is at top level
   vi.mock('../services/apiService', () => ({
     apiService: { method: vi.fn() }
   }));
   ```

3. **Async Test Failures**
   ```javascript
   // Use waitFor for async assertions
   await waitFor(() => {
     expect(screen.getByText('Result')).toBeInTheDocument();
   });
   ```

### Getting Help

- Check the [Vitest documentation](https://vitest.dev/)
- Review [React Testing Library docs](https://testing-library.com/docs/react-testing-library/intro/)
- Look at existing test examples in the codebase
- Create an issue for test-related problems

---

**Happy Testing! 🧪** 