"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCourse } from "./actions";
import { Level } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Plus, 
  Eye, 
  ArrowRight, 
  Loader2,
  Star,
  DollarSign,
} from "lucide-react";

const initialState = { success: false, error: '', validationErrors: {} };

const LEVEL_OPTIONS = [
  { value: 'BEGINNER' as Level, label: 'Beginner', description: 'No prior experience required' },
  { value: 'INTERMEDIATE' as Level, label: 'Intermediate', description: 'Some basic knowledge expected' },
  { value: 'ADVANCED' as Level, label: 'Advanced', description: 'Solid foundation required' },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Course...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </>
      )}
    </Button>
  );
}

function SuccessCard({ courseId, courseName }: { courseId: string; courseName: string }) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100/50">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Course Created Successfully!</h3>
          <p className="text-slate-600 text-lg">
            <span className="font-semibold text-slate-900">{courseName}</span> is ready for content creation
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl">
            <Link href={`/courses/${courseId}/content`}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course Content
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full border-slate-200 hover:bg-slate-50">
            <Link href={`/courses/${courseId}`}>
              <Eye className="w-4 h-4 mr-2" />
              Preview Course
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="lg" className="w-full text-slate-600 hover:text-slate-900">
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FormField({ 
  label, 
  error, 
  required = false, 
  description,
  children 
}: { 
  label: string; 
  error?: string; 
  required?: boolean; 
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

export function CreateCourseForm() {
  const [state, formAction] = useActionState(createCourse, initialState);

  if (state.success && state.courseId) {
    return <SuccessCard courseId={state.courseId} courseName={state.courseName || "Your Course"} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Course Information</h2>
        <p className="text-slate-600">Provide the basic details about your new course</p>
      </div>

      {/* Error Alert */}
      {state.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 font-medium">{state.error}</p>
          </CardContent>
        </Card>
      )}

      <form action={formAction} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            label="Course Title"
            error={state.validationErrors?.title}
            required
            description="Choose a clear, descriptive title for your course"
          >
            <Input
              name="title"
              placeholder="e.g., Complete Web Development Bootcamp"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Duration"
            error={state.validationErrors?.duration}
            required
            description="How long will it take to complete?"
          >
            <Input
              name="duration"
              placeholder="e.g., 8 weeks, 3 months"
              className="h-11"
            />
          </FormField>
        </div>

        <FormField
          label="Course Description"
          error={state.validationErrors?.description}
          required
          description="Describe what students will learn and achieve"
        >
          <Textarea
            name="description"
            rows={4}
            placeholder="Write a compelling description that explains the value and outcomes of your course..."
            className="resize-none"
          />
        </FormField>

        <FormField
          label="Thumbnail Image URL"
          error={state.validationErrors?.thumbnail}
          description="Add an eye-catching image to represent your course"
        >
          <Input
            name="thumbnail"
            type="url"
            placeholder="https://example.com/course-image.jpg"
            className="h-11"
          />
        </FormField>

        {/* Pricing and Level */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            label="Price"
            error={state.validationErrors?.price}
            required
            description="Set to 0 for a free course"
          >
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                placeholder="0.00"
                className="pl-10 h-11"
              />
            </div>
          </FormField>

          <FormField
            label="Difficulty Level"
            error={state.validationErrors?.level}
            required
          >
            <Select name="level" required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_OPTIONS.map(({ value, label, description }) => (
                  <SelectItem key={value} value={value}>
                    <div className="py-1">
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-slate-500">{description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Featured Course Toggle */}
        <FormField label="Course Visibility">
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
            <Checkbox
              name="featured"
              id="featured"
              className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div className="flex-1">
              <label
                htmlFor="featured"
                className="text-sm font-semibold text-slate-900 cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-blue-600" />
                Featured Course
              </label>
              <p className="text-xs text-slate-600 mt-1">
                Featured courses appear prominently on the platform and get more visibility
              </p>
            </div>
          </div>
        </FormField>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-200">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}