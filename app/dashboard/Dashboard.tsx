"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, CircleDot } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Dashboard() {
  const { 
    categories, 
    getOverallProgress, 
    getCategoryProgress,
    isCategoryAccessible,
    setCurrentCategory,
    setCurrentForm
  } = useFormContext();
  
  const router = useRouter();
  const overallProgress = getOverallProgress();

  const handleFormClick = (categoryId: string, formId: string, route: string) => {
    // Check if category is accessible
    if (!isCategoryAccessible(categoryId)) {
      toast("Category Locked", {
        description: "You need to complete previous categories first."
      });
      return;
    }
    
    // Check if this is not the first form in the category
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const formIndex = category.forms.findIndex(f => f.id === formId);
      if (formIndex > 0) {
        // Check if previous forms in this category are completed
        const prevForm = category.forms[formIndex - 1];
        if (!prevForm.completed) {
          toast("Form Locked", {
            description: "You need to complete previous forms first."
          });
          return;
        }
      }
    }
    
    // Navigate to the form
    setCurrentCategory(categoryId);
    setCurrentForm(formId);
    router.push(route);
  };

  const getFormStatus = (categoryId: string, form: { id: string; completed: boolean }, index: number) => {
    // First form in category is accessible if category is accessible
    if (index === 0) {
      return isCategoryAccessible(categoryId);
    }
    
    // Other forms are accessible if previous form is completed
    const category = categories.find(c => c.id === categoryId);
    if (!category) return false;
    
    return index > 0 && category.forms[index - 1].completed;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10 text-purple-400">Form Completion Dashboard</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Progress</span>
            <span className="text-purple-400">{Math.round(overallProgress)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={overallProgress}   
            className="h-2" 
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Form Categories</h2>
        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const categoryProgress = getCategoryProgress(category.id);
            
            return (
              <Card key={category.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {category.name}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(categoryProgress)}% Complete
                    </span>
                  </div>
                  <Progress 
                    value={categoryProgress} 
                    className="h-1 mt-1" 
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">Status</TableHead>
                          <TableHead>Form Name</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.forms.map((form, index) => {
                          const isFormAccessible = getFormStatus(category.id, form, index);
                          
                          return (
                            <TableRow key={form.id}>
                              <TableCell>
                                {form.completed ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <CircleDot className="h-4 w-4 text-gray-300" />
                                )}
                              </TableCell>
                              <TableCell>{form.name}</TableCell>
                              <TableCell className="text-right">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      disabled={!isFormAccessible}
                                      onClick={() => handleFormClick(category.id, form.id, form.route)}
                                    >
                                      {form.completed ? "Edit" : "Start"}
                                    </Button>
                                  </TooltipTrigger>
                                  {!isFormAccessible && (
                                    <TooltipContent>
                                      <p>Complete previous forms first</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}