import { createPortal } from 'react-dom';
import { Spinner } from '../ui/spinner';

interface LoadingProps {
  text?: string;
}

export default function LoadingDialog({ text }: LoadingProps) {
  return createPortal(
    <div className="absolute top-0 z-9999 h-screen w-screen flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm backdrop-filter">
      <Spinner size="large" className="text-foreground">
        {text && <span className="text-foreground mt-5">{text}</span>}
      </Spinner>
    </div>,
    document.body
  );
}
