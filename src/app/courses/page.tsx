import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseCard } from "@/components/CourseCard";
import { redirect } from "next/navigation";
import { CourseService } from "@/lib/services/course-service";
import { PaginationComponent } from "@/components/pagination-component";
import type { Course } from "@/types/course";

interface CoursesPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const { courses, totalPages, totalCount } = await CourseService.getPaginatedCourses(page, 4);

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-7xl mx-auto">
        <div className=" mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Welcome back, {session.user.name}</p>
        </div>

        {/* Courses Grid Container */}
        <div >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
            <span className="text-sm text-gray-500">{totalCount} courses</span>
          </div>

          {courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {courses.map((course: Course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center">
                <PaginationComponent 
                  currentPage={page} 
                  totalPages={totalPages} 
                  basePath="/courses"
                  className="mt-0"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Courses Available</h3>
              <p className="text-gray-600">
                We are working hard to bring you amazing courses. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}