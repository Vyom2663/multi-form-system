export interface FormData {
    // Category 1 - Personal Information
    name?: string;
    email?: string;
    gender?: string;
    age?: number;
    occupation?: string;
    
    // Category 2 - Contact Information
    phoneNumber?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    
    // Category 3 - Preferences
    preferredContact?: string;
    newsletter?: boolean;
    termsAccepted?: boolean;
    interests?: string[];
  }
  
  export interface CategoryInfo {
    id: string;
    name: string;
    description: string;
    forms: FormInfo[];
  }
  
  export interface FormInfo {
    id: string;
    categoryId: string;
    name: string;
    route: string;
    completed: boolean;
  }
  
  export interface FormCategory {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    inProgress: boolean;
    accessible: boolean;
    progress: number;
  }