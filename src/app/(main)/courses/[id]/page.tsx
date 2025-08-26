import { notFound } from "next/navigation";
import { CourseContentService } from "@/lib/services/course-content-service";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EnrollmentButton } from "./enrollment-button";
import Link from "next/link";

interface CourseDetailPageProps {
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

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const courseWithContent = await CourseContentService.getCourseWithContent(id);

  if (!courseWithContent) {
    notFound();
  }

  const isOwner = session?.user?.id === courseWithContent.creatorId;
  const isEnrolled = session?.user ? await EnrollmentService.isUserEnrolled(session.user.id, id) : false;
  const hasContent = courseWithContent.sections.length > 0;
  const totalLessons = courseWithContent.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = courseWithContent.sections.reduce(
    (acc, section) => acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + (lesson.duration || 0), 0), 
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      {isOwner && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Dashboard
                </Link>
                <span className="text-sm text-gray-600">Course Preview</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  href={`/courses/${id}/content`}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit Content
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {courseWithContent.featured && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    ⭐ Featured
                  </span>
                )}
                <span className="text-sm text-blue-600 font-medium">
                  {courseWithContent.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {courseWithContent.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {courseWithContent.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  🕐 <span>{courseWithContent.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  👥 <span>{courseWithContent.studentsCount} students</span>
                </div>
                <div className="flex items-center gap-2">
                  ⭐ <span>{courseWithContent.rating} rating</span>
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    ⏱️ <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <span>Created by</span>
                <span className="font-medium">
                  {courseWithContent.creator?.name || courseWithContent.creator?.email}
                </span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-6">
                  {/* {courseWithContent.thumbnail && (
                    <img
                      src={courseWithContent.thumbnail}
                      alt={courseWithContent.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )} */}
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {courseWithContent.price === 0 ? 'Free' : `$${courseWithContent.price}`}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sections:</span>
                    <span className="font-medium">{courseWithContent.sections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  {totalDuration > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total time:</span>
                      <span className="font-medium">{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{courseWithContent.level}</span>
                  </div>
                </div>

                {!isOwner && (
                  <div className="mt-6">
                    {isEnrolled ? (
                      <div className="space-y-3">
                        <Link
                          href={`/courses/${id}/learn`}
                          className="w-full block text-center px-4 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700"
                        >
                          Start Learning
                        </Link>
                        <EnrollmentButton 
                          courseId={id} 
                          isEnrolled={isEnrolled} 
                          disabled={false}
                        />
                      </div>
                    ) : (
                      <EnrollmentButton 
                        courseId={id} 
                        isEnrolled={isEnrolled} 
                        disabled={false}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        {hasContent ? (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            
            <div className="space-y-6">
              {courseWithContent.sections.map((section, sectionIndex) => (
                <div key={section.id} className="border border-gray-200 rounded-lg">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {sectionIndex + 1}. {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      {section.lessons.length} lessons • {' '}
                      {section.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)} min
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {LESSON_TYPE_ICONS[lesson.type]}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {lessonIndex + 1}. {lesson.title}
                            </h4>
                            {lesson.description && (
                              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            )}
                            {lesson.type === 'VIDEO' && lesson.videoUrl && (
                              <a 
                                href={lesson.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                Watch Video →
                              </a>
                            )}
                          </div>
                          {lesson.duration && (
                            <span className="text-sm text-gray-500">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📚
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
              <p className="text-gray-600 mb-6">
                This course doest have any sections or lessons yet.
              </p>
              {isOwner && (
                <Link
                  href={`/courses/${id}/content`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Course Content
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}