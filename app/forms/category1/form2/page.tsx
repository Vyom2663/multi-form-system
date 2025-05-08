"use client"
import React, { useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  age: number | string;
}

export default function Page() {
  const {
      formData,
      updateFormData,
      markFormCompleted,
      navigateToNextForm,
      setCurrentForm,
      setCurrentCategory,
    } = useFormContext();

    useEffect(() => {
        setCurrentForm("form1_2");
        setCurrentCategory("category1");
      }, [setCurrentForm, setCurrentCategory]);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      age: formData.age?.toString() || ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert age to number
      const processedData = {
        age: typeof data.age === 'string' ? parseInt(data.age, 10) : data.age
      };
      
      // Update context
      updateFormData(processedData);
      
      // Mark form as completed
      markFormCompleted('category1', 'form1_2');
      
      // Show success message
      toast("Form Saved", {
        description: "Your additional details have been saved.",
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
      title="Additional Personal Details"
      description="Please provide additional information"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          min={1}
          max={120}
          {...register('age', { 
            required: 'Age is required',
            min: { value: 1, message: 'Age must be at least 1' },
            max: { value: 120, message: 'Age must be at most 120' }
          })}
          className={errors.age ? 'border-red-500' : ''}
        />
        {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
      </div>
    </FormWrapper>
  );
}