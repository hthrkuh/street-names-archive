import { useState, useEffect } from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  autoDismiss?: number; // milliseconds, 0 = no auto dismiss
}

/**
 * Error message component with dismiss functionality
 */
export default function ErrorMessage({
  message,
  type = 'error',
  onDismiss,
  autoDismiss = 0,
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 300); // Wait for fade out animation
        }
      }, autoDismiss);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300); // Wait for fade out animation
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`error-message error-message-${type} ${!isVisible ? 'fade-out' : ''}`}
      dir="rtl"
      role="alert"
      aria-live="polite"
    >
      <div className="error-message-content">
        <span className="error-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="error-text">{message}</span>
      </div>
      {onDismiss && (
        <button
          className="error-dismiss-button"
          onClick={handleDismiss}
          aria-label="סגור"
        >
          ×
        </button>
      )}
    </div>
  );
}

