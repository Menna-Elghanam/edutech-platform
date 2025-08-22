"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCourse } from "./actions";

const initialState = { success: false, error: '', validationErrors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? "Creating..." : "Create Course"}
    </button>
  );
}

export function CreateCourseForm() {
  const [state, formAction] = useActionState(createCourse, initialState);

  return (
    <>
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
          Course created successfully!
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Course Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Course title"
            />
            {state.validationErrors?.title && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Duration *
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 6 weeks, 3 months"
            />
            {state.validationErrors?.duration && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.duration}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Course description"
          />
          {state.validationErrors?.description && (
            <p className="text-red-500 text-sm mt-1">{state.validationErrors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">
            Thumbnail URL
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {state.validationErrors?.thumbnail && (
            <p className="text-red-500 text-sm mt-1">{state.validationErrors.thumbnail}</p>
          )}
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (USD) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue="0"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0 for free"
            />
            {state.validationErrors?.price && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              Difficulty Level *
            </label>
            <select
              id="level"
              name="level"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            {state.validationErrors?.level && (
              <p className="text-red-500 text-sm mt-1">{state.validationErrors.level}</p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              name="featured"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Featured Course</span>
          </label>
        </div>

        <SubmitButton />
      </form>
    </>
  );
}