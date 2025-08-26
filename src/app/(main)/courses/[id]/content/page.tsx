import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { CourseContentService } from "@/lib/services/course-content-service";
import { CourseService } from "@/lib/services/course-service";
import { CourseContentBuilder } from "./course-content-builder";
import { saveCourseContent } from "./actions";
import Link from "next/link";

interface CourseContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseContentPage({ params }: CourseContentPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard?error=access-denied");
  }

  const course = await CourseService.getCourseById(id);
  
  if (!course) {
    notFound();
  }

  if (course.creatorId !== session.user.id) {
    redirect("/dashboard?error=access-denied");
  }

  const courseWithContent = await CourseContentService.getCourseWithContent(id);
  
  const initialSections = courseWithContent?.sections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description || '',
    lessons: section.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || undefined,
      type: lesson.type,
    }))
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (sections: any[]) => {
    "use server";
    return saveCourseContent(id, sections);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Course Content Builder</h1>
                <p className="text-sm text-gray-600">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href={`/courses/${id}`}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Preview Course
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <CourseContentBuilder
          courseId={id}
          courseName={course.title}
          initialSections={initialSections}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}