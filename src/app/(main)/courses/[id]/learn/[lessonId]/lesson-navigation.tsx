"use client";

import { useState, useTransition } from "react";
import { toggleLessonCompletion } from "./actions";
import Link from "next/link";
import type { Lesson } from "@/types/course-content";

interface LessonNavigationProps {
  courseId: string;
  currentLessonId: string;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  isCompleted: boolean;
}

export function LessonNavigation({ 
  courseId, 
  currentLessonId, 
  previousLesson, 
  nextLesson, 
  isCompleted 
}: LessonNavigationProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleToggleComplete = () => {
    startTransition(async () => {
      try {
        setError("");
        const result = await toggleLessonCompletion(currentLessonId, !completed);
        
        if (result.error) {
          setError(result.error);
        } else {
          setCompleted(!completed);
        }
      } catch (error) {
        setError("Failed to update lesson progress");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Mark Complete Button */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Lesson Progress</h3>
            <p className="text-gray-600">
              {completed ? "You've completed this lesson" : "Mark as complete when you're done"}
            </p>
          </div>
          <button
            onClick={handleToggleComplete}
            disabled={isPending}
            className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              completed
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {completed ? 'Unmarking...' : 'Marking...'}
              </span>
            ) : (
              completed ? 'Mark as Incomplete' : 'Mark as Complete'
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            {previousLesson ? (
              <Link
                href={`/courses/${courseId}/learn/${previousLesson.id}`}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 group"
              >
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Previous Lesson</div>
                  <div className="font-medium">{previousLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="p-2 rounded-full bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm">First Lesson</div>
                </div>
              </div>
            )}
          </div>

          <Link
            href={`/courses/${courseId}/learn`}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Course Overview
          </Link>

          <div>
            {nextLesson ? (
              <Link
                href={`/courses/${courseId}/learn/${nextLesson.id}`}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 group"
              >
                <div>
                  <div className="text-sm text-gray-500 text-right">Next Lesson</div>
                  <div className="font-medium">{nextLesson.title}</div>
                </div>
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <div>
                  <div className="text-sm text-right">Last Lesson</div>
                </div>
                <div className="p-2 rounded-full bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}