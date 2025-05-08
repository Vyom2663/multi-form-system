import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  isValid: boolean;
  isSubmitting: boolean;
}

export function FormNavigation({ isValid, isSubmitting }: FormNavigationProps) {
  const { navigateToPreviousForm } = useFormContext();

  return (
    <div className="flex justify-between gap-4 mt-8">
      <Button 
        type="button" 
        variant="outline" 
        className="cursor-pointer"
        onClick={navigateToPreviousForm}
      >
        Previous
      </Button>
      <Button 
        type="submit" 
        disabled={!isValid || isSubmitting}
        className="bg-purple-800 hover:bg-purple-800 cursor-pointer"
      >
        {isSubmitting ? 'Submitting...' : 'Next'}
      </Button>
    </div>
  );
}
