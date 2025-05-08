"use client";
import React, { useEffect } from "react";
import { useFormContext } from "@/context/FormContext";
import { FormWrapper } from "@/components/FormWrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  name: string;
  email: string;
  gender: string;
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
    setCurrentForm("form1_1");
    setCurrentCategory("category1");
  }, [setCurrentForm, setCurrentCategory]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      gender: formData.gender || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      updateFormData(data);
      markFormCompleted("category1", "form1_1");
      toast("Form Saved", {
        description: "Your personal details have been saved.",
      });
      navigateToNextForm();
    } catch (error) {
      console.error("Form submission error:", error);
      toast("Error", { description: "There was an error saving your form." });
    }
  };

  return (
    <FormWrapper
      title="Basic Personal Details"
      description="Please provide your basic information"
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)} // Pass handleSubmit to FormWrapper
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          {...register("name", { required: "Name is required" })}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender.message}</p>
        )}
      </div>
    </FormWrapper>
  );
}
