import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

/**
 * Loading spinner component
 */
export default function LoadingSpinner({ 
  size = 'medium', 
  message = 'טוען...' 
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner-container ${size}`} dir="rtl">
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

