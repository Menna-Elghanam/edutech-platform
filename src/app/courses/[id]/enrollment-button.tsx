"use client";

import { useState } from "react";
import { enrollInCourse, unenrollFromCourse } from "./actions";

interface EnrollmentButtonProps {
  courseId: string;
  isEnrolled: boolean;
  disabled?: boolean;
}

export function EnrollmentButton({ courseId, isEnrolled, disabled = false }: EnrollmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [error, setError] = useState("");

  const handleEnrollment = async () => {
    setLoading(true);
    setError("");

    try {
      const result = enrolled 
        ? await unenrollFromCourse(courseId)
        : await enrollInCourse(courseId);

      if (result.error) {
        setError(result.error);
      } else {
        setEnrolled(!enrolled);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (disabled) {
    return null; // Don't show for admins
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleEnrollment}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          enrolled
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          enrolled ? "Unenrolling..." : "Enrolling..."
        ) : (
          enrolled ? "Unenroll from Course" : "Enroll in Course"
        )}
      </button>
    </div>
  );
}