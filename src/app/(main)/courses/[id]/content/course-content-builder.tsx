"use client";

import { useState, useTransition } from "react";
import { LessonType } from "@prisma/client";

const LESSON_TYPES = [
  { value: 'TEXT' as LessonType, label: 'Text Lesson' },
  { value: 'VIDEO' as LessonType, label: 'Video Lesson' },
  { value: 'QUIZ' as LessonType, label: 'Quiz' },
  { value: 'ASSIGNMENT' as LessonType, label: 'Assignment' },
];

interface Section {
  id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  type: LessonType;
}

interface CourseContentBuilderProps {
  courseId: string;
  courseName: string;
  initialSections?: Section[];
  onSave: (sections: Section[]) => Promise<{ success?: boolean; error?: string }>;
}

export function CourseContentBuilder({ 
  courseId, 
  courseName, 
  initialSections = [], 
  onSave 
}: CourseContentBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addSection = () => {
    setSections(prev => [...prev, {
      title: '',
      description: '',
      lessons: []
    }]);
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (index: number) => {
    if (confirm('Delete this section and all its lessons?')) {
      setSections(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addLesson = (sectionIndex: number) => {
    setSections(prev => prev.map((section, i) => 
      i === sectionIndex 
        ? {
            ...section,
            lessons: [...section.lessons, {
              title: '',
              description: '',
              content: '',
              type: 'TEXT' as LessonType
            }]
          }
        : section
    ));
  };

  const updateLesson = (
    sectionIndex: number, 
    lessonIndex: number, 
    field: keyof Lesson, 
    value: string | number | LessonType
  ) => {
    setSections(prev => prev.map((section, i) => 
      i === sectionIndex 
        ? {
            ...section,
            lessons: section.lessons.map((lesson, j) => 
              j === lessonIndex ? { ...lesson, [field]: value } : lesson
            )
          }
        : section
    ));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    if (confirm('Delete this lesson?')) {
      setSections(prev => prev.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              lessons: section.lessons.filter((_, j) => j !== lessonIndex)
            }
          : section
      ));
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await onSave(sections);
        if (result.success) {
          setMessage({ type: 'success', text: 'Content saved successfully!' });
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to save content' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to save content.' });
      }
      
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Content Builder</h1>
          <p className="text-sm text-gray-600">
            {courseName} • {sections.length} sections • {totalLessons} lessons
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {sections.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-500 mb-6">Start building your course by adding sections and lessons</p>
          <button
            onClick={addSection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Your First Section
          </button>
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white border rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Section ${sectionIndex + 1} Title`}
                    value={section.title}
                    onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                    className="flex-1 text-lg font-semibold border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeSection(sectionIndex)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  placeholder="Section Description (optional)"
                  value={section.description || ''}
                  onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="ml-4 space-y-3">
              {section.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="border rounded p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Lesson ${lessonIndex + 1} Title`}
                        value={lesson.title}
                        onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                        className="flex-1 font-medium border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'type', e.target.value as LessonType)}
                        className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {LESSON_TYPES.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeLesson(sectionIndex, lessonIndex)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <textarea
                        placeholder="Lesson Description"
                        value={lesson.description || ''}
                        onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                        rows={2}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      <div className="space-y-2">
                        {lesson.type === 'VIDEO' && (
                          <input
                            type="url"
                            placeholder="Video URL"
                            value={lesson.videoUrl || ''}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'videoUrl', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                        
                        <input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={lesson.duration || ''}
                          onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {lesson.type === 'TEXT' && (
                      <textarea
                        placeholder="Lesson Content"
                        value={lesson.content || ''}
                        onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => addLesson(sectionIndex)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 border-dashed"
              >
                + Add Lesson
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addSection}
          className="flex items-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 border-dashed w-full justify-center"
        >
          + Add Section
        </button>
      </div>
    </div>
  );
}