'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { Course, useCreateCourseMutation, useUpdateCourseMutation } from '@/redux/features/course/course';

interface CourseFormProps {
  initialData?: Partial<Course>;
  courseId?: string;
  onSuccess?: () => void; // Callback to close modal
}

interface FormData {
  title: string;
  description: string;
  price: number;
  thumbnail: FileList | null;
}

export default function CourseForm({ initialData, courseId, onSuccess }: CourseFormProps) {
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      thumbnail: null,
    },
  });

  const onSubmitForm: SubmitHandler<FormData> = async (data) => {
    setErrorMessage(null);
    try {
      if (initialData && courseId) {
        // Update course
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', String(data.price));
        if (data.thumbnail?.[0]) {
          formData.append('thumbnail', data.thumbnail[0]);
        }
        await updateCourse({ id: courseId, data: formData }).unwrap();
      } else {
        // Create course
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', String(data.price));
        if (data.thumbnail?.[0]) {
          formData.append('thumbnail', data.thumbnail[0]);
        } else {
          throw new Error('Thumbnail is required for new courses');
        }
        await createCourse(formData).unwrap();
      }
      reset();
      onSuccess?.(); // Close modal on success
    } catch (err) {
      console.error('Failed to submit course:', err);
      setErrorMessage( 'Failed to submit course. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          aria-invalid={errors.title ? 'true' : 'false'}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          rows={3}
          aria-invalid={errors.description ? 'true' : 'false'}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price cannot be negative' },
              valueAsNumber: true,
            })}
            aria-invalid={errors.price ? 'true' : 'false'}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            {...register('thumbnail', {
              required: initialData ? false : 'Thumbnail is required',
            })}
            aria-invalid={errors.thumbnail ? 'true' : 'false'}
            className={errors.thumbnail ? 'border-red-500' : ''}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
          )}
          {initialData?.thumbnail && (
            <img
              src={initialData.thumbnail}
              alt="Current thumbnail"
              className="w-16 h-16 object-cover rounded mt-2"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          className="hover:bg-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : initialData ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}