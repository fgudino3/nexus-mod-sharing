export function NexusButton({
  children,
  className,
  onClick,
}: NexusButtonProps) {
  return (
    <button
      className={`px-3 py-2 rounded-md bg-amber-600 text-lg font-medium ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface NexusButtonProps extends React.PropsWithChildren {
  className?: string;
  onClick: () => void;
}
