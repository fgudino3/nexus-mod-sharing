import '@/styles/Stepper.css';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <>
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i && 'active'} ${
              i < currentStep && 'complete'
            } `}
          >
            <div className="step">
              {i < currentStep ? <Check size={24} /> : i + 1}
            </div>
            <p
              className={`${currentStep === i ? 'text-foreground' : 'text-foreground/75'}`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
