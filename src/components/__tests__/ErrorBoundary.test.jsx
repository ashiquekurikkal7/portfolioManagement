import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';

// Mock the services
vi.mock('../../services/auditService', () => ({
  auditService: {
    logSystemEvent: vi.fn()
  }
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component</div>;
};

// Wrapper component for testing
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ErrorBoundary - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <TestWrapper>
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when an error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We\'re sorry, but something unexpected happened. Our team has been notified.')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should show technical details when toggle is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    const toggleButton = screen.getByText('Show technical details');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Technical Information')).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle refresh button click', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    const refreshButton = screen.getByText('Refresh Page');
    fireEvent.click(refreshButton);

    expect(reloadSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    reloadSpy.mockRestore();
  });

  it('should handle go home button click', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const assignSpy = vi.spyOn(window.location, 'assign').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    const homeButton = screen.getByText('Go Home');
    fireEvent.click(homeButton);

    expect(assignSpy).toHaveBeenCalledWith('/');

    consoleSpy.mockRestore();
    assignSpy.mockRestore();
  });

  it('should handle error reporting', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    const reportButton = screen.getByText('Report Error');
    fireEvent.click(reportButton);

    expect(screen.getByText('Reporting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Reported')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should log error to audit service when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { auditService } = require('../../services/auditService');

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(auditService.logSystemEvent).toHaveBeenCalledWith('ERROR_BOUNDARY_CATCH', expect.any(Object));

    consoleSpy.mockRestore();
  });

  it('should handle multiple errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();

    // Trigger error
    rerender(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should provide helpful information to users', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('If this problem persists, please contact support with the error details above.')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
}); 