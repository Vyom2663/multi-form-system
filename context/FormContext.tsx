"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormData, CategoryInfo, FormInfo } from "@/types/form-types";
import { toast } from "sonner";

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  categories: CategoryInfo[];
  currentCategory: string | null;
  currentForm: string | null;
  setCurrentForm: (formId: string | null) => void;
  setCurrentCategory: (categoryId: string | null) => void;
  markFormCompleted: (categoryId: string, formId: string) => void;
  getCategoryProgress: (categoryId: string) => number;
  getOverallProgress: () => number;
  isCategoryAccessible: (categoryId: string) => boolean;
  isFormAccessible: (formId: string) => boolean;
  navigateToNextForm: () => void;
  navigateToPreviousForm: () => void;
  resetFormData: () => void;
}

const defaultFormData: FormData = {};

const initialCategories: CategoryInfo[] = [
  {
    id: "category1",
    name: "Personal Information",
    description: "Basic personal details",
    forms: [
      {
        id: "form1_1",
        categoryId: "category1",
        name: "Basic Details",
        route: "/forms/category1/form1",
        completed: false,
      },
      {
        id: "form1_2",
        categoryId: "category1",
        name: "Additional Details",
        route: "/forms/category1/form2",
        completed: false,
      },
      {
        id: "form1_3",
        categoryId: "category1",
        name: "Professional Details",
        route: "/forms/category1/form3",
        completed: false,
      },
    ],
  },
  {
    id: "category2",
    name: "Contact Information",
    description: "Your contact details",
    forms: [
      {
        id: "form2_1",
        categoryId: "category2",
        name: "Phone & Address",
        route: "/forms/category2/form1",
        completed: false,
      },
      {
        id: "form2_2",
        categoryId: "category2",
        name: "Additional Contacts",
        route: "/forms/category2/form2",
        completed: false,
      },
    ],
  },
  {
    id: "category3",
    name: "Preferences",
    description: "Your preferences and settings",
    forms: [
      {
        id: "form3_1",
        categoryId: "category3",
        name: "Communication Preferences",
        route: "/forms/category3/form1",
        completed: false,
      },
      {
        id: "form3_2",
        categoryId: "category3",
        name: "Terms & Interests",
        route: "/forms/category3/form2",
        completed: false,
      },
    ],
  },
];

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  // Load data from localStorage if available, otherwise use defaults
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [categories, setCategories] =
    useState<CategoryInfo[]>(initialCategories);

  // Load data from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("formData");
      const savedCategories = localStorage.getItem("formCategories");

      if (savedData) setFormData(JSON.parse(savedData));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("formCategories", JSON.stringify(categories));
    }
  }, [formData, categories]);

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentForm, setCurrentForm] = useState<string | null>(null);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const markFormCompleted = (categoryId: string, formId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id !== categoryId) return category;

        const formsUpdated = category.forms.map((form) =>
          form.id === formId && !form.completed
            ? { ...form, completed: true }
            : form
        );

        return { ...category, forms: formsUpdated };
      })
    );
  };

  const getCategoryProgress = (categoryId: string): number => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return 0;

    const totalForms = category.forms.length;
    if (totalForms === 0) return 0;

    const completedForms = category.forms.filter(
      (form) => form.completed
    ).length;
    return (completedForms / totalForms) * 100;
  };

  const getOverallProgress = (): number => {
    const totalForms = categories.reduce(
      (sum, category) => sum + category.forms.length,
      0
    );
    if (totalForms === 0) return 0;

    const completedForms = categories.reduce(
      (sum, category) =>
        sum + category.forms.filter((form) => form.completed).length,
      0
    );

    return (completedForms / totalForms) * 100;
  };

  const isCategoryAccessible = (categoryId: string): boolean => {
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);
    if (categoryIndex === 0) return true;

    // Previous category must be completed to access this category
    const previousCategory = categories[categoryIndex - 1];
    return previousCategory.forms.every((form) => form.completed);
  };

  const isFormAccessible = (formId: string): boolean => {
    // Find which category this form belongs to
    for (const category of categories) {
      const formIndex = category.forms.findIndex((f) => f.id === formId);
      if (formIndex !== -1) {
        // First form in an accessible category is always accessible
        if (formIndex === 0) return isCategoryAccessible(category.id);

        // Previous form must be completed to access this form
        return category.forms[formIndex - 1].completed;
      }
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const findFormAndCategory = (
    formId: string | null
  ): { form: FormInfo | null; category: CategoryInfo | null } => {
    if (!formId) return { form: null, category: null };

    for (const category of categories) {
      const form = category.forms.find((f) => f.id === formId);
      if (form) {
        return { form, category };
      }
    }

    return { form: null, category: null };
  };

  const navigateToNextForm = () => {
    if (!currentForm || !currentCategory) return;

    const currentCategoryObj = categories.find((c) => c.id === currentCategory);
    if (!currentCategoryObj) return;

    const currentFormIndex = currentCategoryObj.forms.findIndex(
      (f) => f.id === currentForm
    );
    if (currentFormIndex === -1) return;

    // If there's a next form in the same category
    if (currentFormIndex < currentCategoryObj.forms.length - 1) {
      const nextForm = currentCategoryObj.forms[currentFormIndex + 1];
      setCurrentForm(nextForm.id);
      router.push(nextForm.route);
      return;
    }

    // Otherwise, move to the next category's first form
    const currentCategoryIndex = categories.findIndex(
      (c) => c.id === currentCategory
    );
    if (currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1];
      if (
        isCategoryAccessible(nextCategory.id) &&
        nextCategory.forms.length > 0
      ) {
        const nextForm = nextCategory.forms[0];
        setCurrentCategory(nextCategory.id);
        setCurrentForm(nextForm.id);
        router.push(nextForm.route);
        return;
      } else {
        toast("Category Locked", {
          description: "You need to complete the current category first.",
        });
      }
    } else {
      // Completed all forms in all categories
      router.push("/completion");
    }
  };

  const navigateToPreviousForm = () => {
    if (!currentForm || !currentCategory) return;

    const currentCategoryObj = categories.find((c) => c.id === currentCategory);
    if (!currentCategoryObj) return;

    const currentFormIndex = currentCategoryObj.forms.findIndex(
      (f) => f.id === currentForm
    );
    if (currentFormIndex === -1) return;

    // If there's a previous form in the same category
    if (currentFormIndex > 0) {
      const prevForm = currentCategoryObj.forms[currentFormIndex - 1];
      setCurrentForm(prevForm.id);
      router.push(prevForm.route);
      return;
    }

    // Otherwise, move to the previous category's last form
    const currentCategoryIndex = categories.findIndex(
      (c) => c.id === currentCategory
    );
    if (currentCategoryIndex > 0) {
      const prevCategory = categories[currentCategoryIndex - 1];
      if (prevCategory.forms.length > 0) {
        const prevForm = prevCategory.forms[prevCategory.forms.length - 1];
        setCurrentCategory(prevCategory.id);
        setCurrentForm(prevForm.id);
        router.push(prevForm.route);
      }
    }
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
    setCategories(initialCategories);
    localStorage.removeItem("formData");
    localStorage.removeItem("formCategories");
    router.push("/");
    toast("Form Reset", {
      description: "All form data has been reset.",
    });
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        categories,
        currentCategory,
        currentForm,
        setCurrentForm,
        setCurrentCategory,
        markFormCompleted,
        getCategoryProgress,
        getOverallProgress,
        isCategoryAccessible,
        isFormAccessible,
        navigateToNextForm,
        navigateToPreviousForm,
        resetFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
