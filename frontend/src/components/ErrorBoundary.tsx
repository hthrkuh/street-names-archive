import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" dir="rtl">
          <div className="error-boundary-content">
            <h2>אירעה שגיאה</h2>
            <p>מצטערים, אירעה שגיאה בלתי צפויה.</p>
            {this.state.error && (
              <details style={{ marginTop: '10px', textAlign: 'right' }}>
                <summary>פרטי השגיאה</summary>
                <pre style={{ marginTop: '10px', fontSize: '12px' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button onClick={this.handleReset} className="error-reset-button">
              נסה שוב
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

