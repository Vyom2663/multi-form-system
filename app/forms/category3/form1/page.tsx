"use client"
import React, { useState } from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  preferredContact: string;
}

export default function Form1() {
  const { formData, updateFormData, markFormCompleted, navigateToNextForm } = useFormContext();
  
  // State for radio group (react-hook-form doesn't handle radio groups well out of the box)
  const [preferredContact, setPreferredContact] = useState(formData.preferredContact || '');
  
  const { 
    register,
    setValue, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      preferredContact: formData.preferredContact || ''
    }
  });

  React.useEffect(() => {
    register('preferredContact', { required: 'Please select a preferred contact method' });
  }, [register]);

  React.useEffect(() => {
    if (preferredContact) {
      setValue('preferredContact', preferredContact, { shouldValidate: true });
    }
  }, [preferredContact, setValue]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: FormValues) => {
    try {
      // Update context
      updateFormData({ preferredContact });
      
      // Mark form as completed
      markFormCompleted('category3', 'form3_1');
      
      // Show success message
      toast("Form Saved", {
        description: "Your communication preferences have been saved.",
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
      title="Communication Preferences"
      description="How would you prefer to be contacted?"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
        <RadioGroup 
          value={preferredContact} 
          onValueChange={setPreferredContact}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="r1" />
            <Label htmlFor="r1">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="r2" />
            <Label htmlFor="r2">Phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="post" id="r3" />
            <Label htmlFor="r3">Post</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="r4" />
            <Label htmlFor="r4">Do not contact me</Label>
          </div>
        </RadioGroup>
        {errors.preferredContact && <p className="text-sm text-red-500">{errors.preferredContact.message}</p>}
      </div>
    </FormWrapper>
  );
}