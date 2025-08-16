"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateModuleMutation } from "@/redux/features/module/module";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

interface Module {
  id: string;
  title: string;
  description: string;
}



interface FormInputs {
  title: string;
  description: string;
  coursesId: string
}

export default function ModuleForm({  courseId , onSuccess}: {courseId: string; onSuccess?: () => void;}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createModule, {isLoading, isError}] = useCreateModuleMutation()
  const {register, handleSubmit, formState: { errors }, reset,} = useForm<FormInputs>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      
      // console.log({ ...data, courseId: courseId });
      const response = await createModule({ ...data,  courseId });
      console.log({...data, courseId})
      setIsSubmitting(true)
      toast.success("Module created successfully!"); // Add toast for user feedback
      reset(data); // Reset form with submitted values to mark as pristine
    onSuccess?.(); // Call onSuccess to close the dialog
    } catch (error) {
      console.error("Failed to submit module:", error);
      toast.error("Failed to create module. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="module-title">Module Title</Label>
        <Input
          id="module-title"
          {...register("title", {
            required: "Title is required",
            maxLength: {
              value: 100,
              message: "Title cannot exceed 100 characters",
            },
          })}
          placeholder="e.g., Getting Started with React"
          className={`border-gray-300 ${errors.title ? "border-red-500" : ""}`}
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="module-description">Description</Label>
        <Textarea
          id="module-description"
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 500,
              message: "Description cannot exceed 500 characters",
            },
          })}
          placeholder="Brief description of what this module covers"
          rows={3}
          className={`border-gray-300 ${
            errors.description ? "border-red-500" : ""
          }`}
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
       <div className="flex justify-end space-x-4 pt-4">
       
          <Button
            type="button"
            onClick={() => reset()}
           className="bg-black hover:bg-primary-700 text-white disabled:opacity-50"
          >
            Cancel
          </Button>
       
        <Button
          type="submit"
          className="bg-black hover:bg-primary-700 text-white disabled:opacity-50">
          {isSubmitting ? "Submitting..." : "Create Module"}
        </Button>
      </div>
      <Toaster/>
    </form>
  );
}
