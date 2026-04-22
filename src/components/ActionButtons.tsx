interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  onSave?: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ActionButtons({
  onApprove,
  onReject,
  onSave,
  isLoading = false,
  size = 'md'
}: ActionButtonsProps) {
  const buttonSizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {onSave && (
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`btn-secondary ${buttonSizeClass} disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none`}
        >
          {isLoading ? 'Saving...' : 'Save Edit'}
        </button>
      )}
      <button
        onClick={onApprove}
        disabled={isLoading}
        className={`btn-success ${buttonSizeClass} disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none`}
      >
        {isLoading ? 'Processing...' : '✓ Approve'}
      </button>
      <button
        onClick={onReject}
        disabled={isLoading}
        className={`btn-danger ${buttonSizeClass} disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none`}
      >
        {isLoading ? 'Processing...' : '✕ Reject'}
      </button>
    </div>
  );
}
