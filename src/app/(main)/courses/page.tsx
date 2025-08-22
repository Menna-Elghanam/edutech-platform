import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseCard } from "@/components/courses/CourseCard";
import { redirect } from "next/navigation";
import { CourseService } from "@/lib/services/course-service";
import { PaginationComponent } from "@/components/pagination-component";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { Suspense } from "react";
import type { Course } from "@/types/course";

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    level?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const params = await searchParams;

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>

        <CourseSearch />

        <Suspense key={JSON.stringify(params)} fallback={<LoadingSkeleton variant="card" count={8} />}>
          <CoursesContent searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function CoursesContent({ searchParams }: { searchParams: { page?: string; search?: string; level?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const { search, level } = searchParams;

  const { courses, totalPages, totalCount } = await CourseService.getPaginatedCourses(page, 4, search, level);
  const hasFilters = Boolean(search || level);

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">
            {search ? 'Search Results' : 'All Courses'}
          </h2>
          {search && (
            <p className="text-muted-foreground text-sm mt-1">
              Found {totalCount} courses for &ldquo;{search}&ldquo;
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 sm:mt-0">
          <span className="font-medium">{totalCount} courses</span>
          {totalPages > 1 && <span>Page {page} of {totalPages}</span>}
        </div>
      </div>

      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="border-t pt-6">
            <PaginationComponent 
              currentPage={page} 
              totalPages={totalPages} 
              basePath="/courses"
              searchParams={searchParams} 
              className="mt-0"
            />
          </div>
        </>
      ) : (
        <EmptyState
          title={hasFilters ? 'No courses found' : 'No courses available'}
          description={
            hasFilters 
              ? 'Try adjusting your search criteria or clear the filters to see more results.'
              : 'We are working hard to bring you amazing courses. Check back soon!'
          }
          action={hasFilters ? { label: 'Clear all filters', href: '/courses' } : undefined}
        />
      )}
    </div>
  );
}