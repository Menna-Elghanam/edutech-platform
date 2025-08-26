import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { CourseContentService } from "@/lib/services/course-content-service";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { ProgressService } from "@/lib/services/progress-service";
import { LessonContent } from "./lesson-content";
import { LessonNavigation } from "./lesson-navigation";
import Link from "next/link";

interface LessonPageProps {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Check enrollment
  const isEnrolled = await EnrollmentService.isUserEnrolled(session.user.id, id);
  if (!isEnrolled) {
    redirect(`/courses/${id}?error=not-enrolled`);
  }

  // Get course and lesson data
  const courseWithContent = await CourseContentService.getCourseWithContent(id);
  if (!courseWithContent) {
    notFound();
  }

  // Find the lesson and its context
  let currentLesson = null;
  let currentSection = null;
  let lessonIndex = -1;
  let sectionIndex = -1;

  for (let si = 0; si < courseWithContent.sections.length; si++) {
    const section = courseWithContent.sections[si];
    for (let li = 0; li < section.lessons.length; li++) {
      const lesson = section.lessons[li];
      if (lesson.id === lessonId) {
        currentLesson = lesson;
        currentSection = section;
        lessonIndex = li;
        sectionIndex = si;
        break;
      }
    }
    if (currentLesson) break;
  }

  if (!currentLesson || !currentSection) {
    notFound();
  }

  // Get lesson progress
  const isCompleted = await ProgressService.isLessonCompleted(session.user.id, lessonId);

  // Find previous and next lessons
  const allLessons = courseWithContent.sections.flatMap(section => section.lessons);
  const currentLessonGlobalIndex = allLessons.findIndex(l => l.id === lessonId);
  const previousLesson = currentLessonGlobalIndex > 0 ? allLessons[currentLessonGlobalIndex - 1] : null;
  const nextLesson = currentLessonGlobalIndex < allLessons.length - 1 ? allLessons[currentLessonGlobalIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/courses/${id}/learn`}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Course
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{currentLesson.title}</h1>
              <p className="text-sm text-gray-600">
                {courseWithContent.title} • Section {sectionIndex + 1}: {currentSection.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Lesson Status */}
        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <span className="text-green-800 font-medium">Lesson Completed</span>
            </div>
          </div>
        )}

        {/* Main Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
            {currentLesson.description && (
              <p className="text-gray-600">{currentLesson.description}</p>
            )}
            {currentLesson.duration && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>⏱️ {currentLesson.duration} minutes</span>
              </div>
            )}
          </div>

          <LessonContent 
            lesson={currentLesson}
            courseId={id}
            isCompleted={isCompleted}
          />
        </div>

        {/* Navigation */}
        <LessonNavigation
          courseId={id}
          currentLessonId={lessonId}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}