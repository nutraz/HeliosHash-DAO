import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../error-boundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear any previous errors
    jest.clearAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred. Please try again or contact support if the problem persists.')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Reload Page')).toBeInTheDocument()
    expect(screen.getByText('Go Home')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('calls resetError when Try Again button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const tryAgainButton = screen.getByText('Try Again')
    fireEvent.click(tryAgainButton)

    // After clicking try again, the error should be reset and children should render
    expect(screen.getByText('No error')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  it('reloads page when Reload Page button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByText('Reload Page')
    fireEvent.click(reloadButton)

    expect(reloadSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
    reloadSpy.mockRestore()
  })

  it('navigates home when Go Home button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    delete (window as any).location
    window.location = { href: '' } as any

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const goHomeButton = screen.getByText('Go Home')
    fireEvent.click(goHomeButton)

    expect(window.location.href).toBe('/')

    consoleSpy.mockRestore()
  })
})
