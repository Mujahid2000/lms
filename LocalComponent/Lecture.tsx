'use client';
import { Lecture } from "@/app/admin/courses/[id]/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useCreateLectureMutation, useUpdateLectureMutation } from "@/redux/features/lecture/lecture";

type Inputs = {
  moduleId: string;
  title: string;
  duration: number;
  videoUrl: string;
  notes: FileList;
};

interface LectureFormProps {
  moduleId: string;
  initialData?: Lecture;
  onSuccess?: () => void;
  refe?: () => void;
}

export default function LectureForm({ moduleId, initialData, onSuccess, refe }: LectureFormProps) {
  const [createLecture] = useCreateLectureMutation();
  const [updateLecture] = useUpdateLectureMutation();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: {
      moduleId: initialData?.moduleId || moduleId,
      title: initialData?.title || "",
      duration: initialData?.duration || 0,
      videoUrl: initialData?.videoUrl || "",
      notes: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      setEditMode(true);
      reset({
        moduleId: initialData.moduleId || moduleId,
        title: initialData.title || "",
        duration: initialData.duration || 0,
        videoUrl: initialData.videoUrl || "",
        notes: undefined,
      });
    } else {
      setEditMode(false);
      reset({
        moduleId: moduleId,
        title: "",
        duration: 0,
        videoUrl: "",
        notes: undefined,
      });
    }
    // Removed onSuccess?.() from here to prevent dialog closing on mount
  }, [initialData, reset, moduleId]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("moduleId", moduleId);
    formData.append("title", data.title);
    formData.append("duration", String(data.duration));
    formData.append("videoUrl", data.videoUrl);

    if (data.notes && data.notes.length > 0) {
      for (let i = 0; i < data.notes.length; i++) {
        formData.append("notes", data.notes[i]);
      }
    }

    try {
      let response;
      if (editMode && initialData?._id) {
        response = await updateLecture({ lectureId: initialData._id, lecture: formData }).unwrap();
        toast.success("Lecture updated successfully!");
      } else {
        response = await createLecture(formData).unwrap();
        toast.success("Lecture created successfully!");
      }
      onSuccess?.(); // Close dialog on successful submission
      refe?.()
    } catch (err) {
      console.error("Error:", err);
      toast.error(`Failed to ${editMode ? "update" : "create"} lecture. Please try again.`);
    }
  };

  if (!isFormVisible) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Lecture Title</Label>
          <Input
            id="title"
            {...register("title", { required: true })}
            placeholder="e.g., What is React?"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_duration">Video Duration</Label>
          <Input
            {...register("duration", { required: true })}
            type="number"
            id="video_duration"
            placeholder="video duration"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Lecture Notes</Label>
        <Input {...register("notes")} id="notes" type="file" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video_url">Video URL</Label>
        <Input
          id="video_url"
          {...register("videoUrl", { required: true })}
          placeholder="https://example.com/video.mp4"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">{editMode ? "Update Lecture" : "Create Lecture"}</Button>
      </div>
      <Toaster />
    </form>
  );
}