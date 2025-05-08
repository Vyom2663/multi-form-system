"use client"
import React, { useState } from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormWrapper } from '@/components/FormWrapper';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormValues {
  newsletter: boolean;
  termsAccepted: boolean;
  interests: string[];
}

export default function Form2() {
  const { formData, updateFormData, markFormCompleted, navigateToNextForm } = useFormContext();
  
  const [newsletter, setNewsletter] = useState(formData.newsletter || false);
  const [termsAccepted, setTermsAccepted] = useState(formData.termsAccepted || false);
  
  // For checkboxes group
  const [interests, setInterests] = useState<string[]>(formData.interests || []);
  
  const { 
    register,
    setValue, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      newsletter: formData.newsletter || false,
      termsAccepted: formData.termsAccepted || false,
      interests: formData.interests || []
    }
  });

  React.useEffect(() => {
    register('termsAccepted', { 
      required: 'You must accept the terms and conditions'
    });
    register('interests');
  }, [register]);

  React.useEffect(() => {
    setValue('newsletter', newsletter);
    setValue('termsAccepted', termsAccepted, { shouldValidate: true });
    setValue('interests', interests);
  }, [newsletter, termsAccepted, interests, setValue]);

  const handleInterestChange = (checked: boolean, interest: string) => {
    if (checked) {
      setInterests(prev => [...prev, interest]);
    } else {
      setInterests(prev => prev.filter(i => i !== interest));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: FormValues) => {
    try {
      // Update context with the current checkbox values
      updateFormData({ 
        newsletter, 
        termsAccepted, 
        interests 
      });
      
      // Mark form as completed
      markFormCompleted('category3', 'form3_2');
      
      // Show success message
      toast("Form Saved", {
        description: "Your preferences have been saved.",
      });
      
      // Navigate to completion page
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
      title="Terms & Interests"
      description="Please review and accept our terms"
      isValid={isValid && termsAccepted}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="newsletter" 
            checked={newsletter}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') setNewsletter(checked);
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="newsletter">
              Subscribe to newsletter
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about our products and services.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Interests (Optional)</Label>
          <div className="space-y-2">
            {['Technology', 'Sports', 'Entertainment', 'Business', 'Science'].map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox 
                  id={`interest-${interest}`}
                  checked={interests.includes(interest)}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') handleInterestChange(checked, interest);
                  }}
                />
                <Label htmlFor={`interest-${interest}`}>{interest}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') setTermsAccepted(checked);
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="terms" className={errors.termsAccepted ? "text-red-500" : ""}>
              I accept the terms and conditions
            </Label>
            <p className="text-sm text-muted-foreground">
              By checking this, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
        {errors.termsAccepted && <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>}
      </div>
    </FormWrapper>
  );
}