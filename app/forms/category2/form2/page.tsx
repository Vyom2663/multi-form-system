"use client"
import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  city: string;
  zipCode: string;
}

export default function Form2() {
  const { formData, updateFormData, markFormCompleted, navigateToNextForm } = useFormContext();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      city: formData.city || '',
      zipCode: formData.zipCode || ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Update context
      updateFormData(data);
      
      // Mark form as completed
      markFormCompleted('category2', 'form2_2');
      
      // Show success message
      toast("Form Saved", {
        description: "Your location details have been saved.",
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
      title="Location Details"
      description="Please provide your city and zip code"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Enter your city"
          {...register('city', { 
            required: 'City is required'
          })}
          className={errors.city ? 'border-red-500' : ''}
        />
        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          placeholder="Enter your zip code"
          {...register('zipCode', { 
            required: 'Zip code is required',
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Invalid zip code format'
            }
          })}
          className={errors.zipCode ? 'border-red-500' : ''}
        />
        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
      </div>
    </FormWrapper>
  );
}