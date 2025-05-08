"use client"
import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  phoneNumber: string;
  address: string;
}

export default function Form1() {
  const { formData, updateFormData, markFormCompleted, navigateToNextForm } = useFormContext();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: formData.phoneNumber || '',
      address: formData.address || ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Update context
      updateFormData(data);
      
      // Mark form as completed
      markFormCompleted('category2', 'form2_1');
      
      // Show success message
      toast("Form Saved", {
        description: "Your contact information has been saved.",
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
      title="Phone & Address"
      description="Please provide your contact information"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="Enter your phone number"
          {...register('phoneNumber', { 
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9+-\s]+$/,
              message: 'Invalid phone number format'
            }
          })}
          className={errors.phoneNumber ? 'border-red-500' : ''}
        />
        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          {...register('address', { 
            required: 'Address is required'
          })}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      </div>
    </FormWrapper>
  );
}