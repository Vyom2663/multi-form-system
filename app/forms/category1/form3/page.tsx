"use client"
import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  occupation: string;
}

export default function Page() {
  const { formData, updateFormData, markFormCompleted, navigateToNextForm } = useFormContext();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      occupation: formData.occupation || ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Update context
      updateFormData(data);
      
      // Mark form as completed
      markFormCompleted('category1', 'form1_3');
      
      // Show success message
      toast("Form Saved", {
        description: "Your professional details have been saved.",
      });
      
      // Navigate to next form
      navigateToNextForm();
    } catch (error) {
      console.error("Form submission error:", error);
      toast("Error", {
        description: "There was an error saving your form.",
      });
    }
  };

  return (
    <FormWrapper
      title="Professional Details"
      description="Please provide your professional information"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          placeholder="Enter your occupation"
          {...register('occupation', { 
            required: 'Occupation is required'
          })}
          className={errors.occupation ? 'border-red-500' : ''}
        />
        {errors.occupation && <p className="text-sm text-red-500">{errors.occupation.message}</p>}
      </div>
    </FormWrapper>
  );
}
