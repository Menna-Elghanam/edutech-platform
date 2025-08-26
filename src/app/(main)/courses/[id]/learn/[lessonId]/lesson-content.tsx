"use client";

import { useState } from "react";
import type { Lesson } from "@/types/course-content";

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const [videoError, setVideoError] = useState(false);

  const renderTextContent = () => (
    <div className="prose max-w-none">
      {lesson.content ? (
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {lesson.content}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No content available for this lesson yet.</p>
        </div>
      )}
    </div>
  );

  const renderVideoContent = () => {
    if (!lesson.videoUrl) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎥</div>
          <p>No video available for this lesson yet.</p>
        </div>
      );
    }

    // Check if it's a YouTube URL and convert to embed
    let embedUrl = lesson.videoUrl;
    if (lesson.videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = lesson.videoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (lesson.videoUrl.includes('youtu.be/')) {
      const videoId = lesson.videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return (
      <div className="space-y-4">
        {!videoError ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title={lesson.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setVideoError(true)}
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">Unable to load video</p>
              <a 
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Watch on external site →
              </a>
            </div>
          </div>
        )}

        {/* Text content below video if available */}
        {lesson.content && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Lesson Notes</h3>
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {lesson.content}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuizContent = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">❓</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Quiz Coming Soon</h3>
      <p className="text-gray-600 mb-6">
        Interactive quiz functionality will be available in a future update.
      </p>
      {lesson.content && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Quiz Instructions</h4>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg text-left max-w-2xl mx-auto">
            {lesson.content}
          </div>
        </div>
      )}
    </div>
  );

  const renderAssignmentContent = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">📝</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Assignment</h3>
      <p className="text-gray-600 mb-6">
        Complete the assignment described below to continue.
      </p>
      {lesson.content && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Assignment Instructions</h4>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg text-left max-w-2xl mx-auto">
            {lesson.content}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return renderVideoContent();
      case 'QUIZ':
        return renderQuizContent();
      case 'ASSIGNMENT':
        return renderAssignmentContent();
      case 'TEXT':
      default:
        return renderTextContent();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}