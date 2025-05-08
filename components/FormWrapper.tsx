import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormNavigation } from '@/components/FormNavigation';

interface FormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormWrapper({ 
  title, 
  description, 
  children, 
  isValid, 
  isSubmitting, 
  onSubmit 
}: FormWrapperProps) {
  return (
    <div className="form-step-container">
      <Card className="shadow-md">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-form-purple">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {children}
            </div>
          </CardContent>
          <CardFooter>
            <FormNavigation isValid={isValid} isSubmitting={isSubmitting} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
