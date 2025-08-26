import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { CourseContentService } from "@/lib/services/course-content-service";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { ProgressService } from "@/lib/services/progress-service";
import Link from "next/link";

interface LearnPageProps {
  params: Promise<{
    id: string;
  }>;
}

const LESSON_TYPE_ICONS = {
  TEXT: "📄",
  VIDEO: "🎥", 
  QUIZ: "❓",
  ASSIGNMENT: "📝",
};

export default async function LearnPage({ params }: LearnPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Check if user is enrolled
  const isEnrolled = await EnrollmentService.isUserEnrolled(session.user.id, id);
  if (!isEnrolled) {
    redirect(`/courses/${id}?error=not-enrolled`);
  }

  const courseWithContent = await CourseContentService.getCourseWithContent(id);
  if (!courseWithContent) {
    notFound();
  }

  // Get progress data
  const courseProgress = await ProgressService.getCourseProgress(session.user.id, id);
  const allLessons = courseWithContent.sections.flatMap(section => section.lessons);
  const lessonIds = allLessons.map(lesson => lesson.id);
  const lessonsProgress = await ProgressService.getLessonsProgress(session.user.id, lessonIds);

  // Find next lesson to take
  const nextLesson = allLessons.find(lesson => {
    const progress = lessonsProgress.find(p => p.lessonId === lesson.id);
    return !progress?.completed;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Course Details
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{courseWithContent.title}</h1>
                <p className="text-sm text-gray-600">
                  {courseProgress.completedLessons} of {courseProgress.totalLessons} lessons completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {courseProgress.progressPercentage}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${courseProgress.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Continue Learning Section */}
        {nextLesson && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Continue Learning</h2>
            <p className="text-blue-800 mb-4">
              Pick up where you left off with your next lesson
            </p>
            <Link
              href={`/courses/${id}/learn/${nextLesson.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue: {nextLesson.title}
            </Link>
          </div>
        )}

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {courseWithContent.sections.map((section, sectionIndex) => {
              const sectionLessons = section.lessons;
              const sectionProgress = sectionLessons.map(lesson => 
                lessonsProgress.find(p => p.lessonId === lesson.id)?.completed || false
              );
              const completedInSection = sectionProgress.filter(Boolean).length;
              
              return (
                <div key={section.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sectionIndex + 1}. {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-gray-600 mt-1">{section.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {completedInSection}/{sectionLessons.length} lessons
                    </div>
                  </div>

                  <div className="space-y-3 ml-4">
                    {sectionLessons.map((lesson, lessonIndex) => {
                      const progress = lessonsProgress.find(p => p.lessonId === lesson.id);
                      const isCompleted = progress?.completed || false;
                      
                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${id}/learn/${lesson.id}`}
                          className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              isCompleted 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {isCompleted ? '✓' : lessonIndex + 1}
                            </div>
                            
                            <span className="text-lg">
                              {LESSON_TYPE_ICONS[lesson.type]}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h4 className={`font-medium ${isCompleted ? 'text-gray-700' : 'text-gray-900'}`}>
                              {lesson.title}
                            </h4>
                            {lesson.description && (
                              <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            {lesson.duration && (
                              <span>{lesson.duration} min</span>
                            )}
                            {isCompleted && (
                              <span className="text-green-600 font-medium">Completed</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Completion */}
        {courseProgress.progressPercentage === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Congratulations! 
            </h3>
            <p className="text-green-800 mb-4">
              You have completed all lessons in this course!
            </p>
            <Link
              href={`/courses/${id}`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Course Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}