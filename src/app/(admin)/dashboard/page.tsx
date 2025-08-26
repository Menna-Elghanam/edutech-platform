import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseService } from "@/lib/services/course-service";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/?error=access-denied");
  }

  const courses = await CourseService.getAdminCourses(session.user.id);

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => (c.sectionsCount || 0) > 0 && (c.lessonsCount || 0) > 0).length,
    draftCourses: courses.filter(c => (c.sectionsCount || 0) > 0 && (c.lessonsCount || 0) === 0).length,
    emptyCourses: courses.filter(c => (c.sectionsCount || 0) === 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your courses</p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200/80 p-6">
            <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.totalCourses}</div>
            <div className="text-sm text-gray-500">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200/80 p-6">
            <div className="text-2xl font-semibold text-green-600 mb-1">{stats.publishedCourses}</div>
            <div className="text-sm text-gray-500">Published</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200/80 p-6">
            <div className="text-2xl font-semibold text-orange-500 mb-1">{stats.draftCourses}</div>
            <div className="text-sm text-gray-500">Draft</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200/80 p-6">
            <div className="text-2xl font-semibold text-gray-400 mb-1">{stats.emptyCourses}</div>
            <div className="text-sm text-gray-500">Empty</div>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-lg border border-gray-200/80">
          <div className="px-6 py-4 border-b border-gray-200/80">
            <h2 className="text-lg font-medium text-gray-900">Courses</h2>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-lg bg-gray-100 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses</h3>
              <p className="text-gray-500 text-sm">You havent created any courses yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/80">
              {courses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CourseRow({ course }: { course: any }) {
  const sectionsCount = course.sectionsCount || 0;
  const lessonsCount = course.lessonsCount || 0;
  
  let status = 'Empty';
  let statusColor = 'bg-gray-100 text-gray-600';
  
  if (sectionsCount > 0 && lessonsCount > 0) {
    status = 'Published';
    statusColor = 'bg-green-100 text-green-600';
  } else if (sectionsCount > 0) {
    status = 'Draft';
    statusColor = 'bg-orange-100 text-orange-600';
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-gray-900">{course.title}</h3>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${statusColor}`}>
              {status}
            </span>
            {course.featured && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-600">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="font-medium text-gray-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
            <span>{course.level}</span>
            <span>{sectionsCount} sections</span>
            <span>{lessonsCount} lessons</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {sectionsCount === 0 ? (
            <Link
              href={`/courses/${course.id}/content`}
              className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Add Content
            </Link>
          ) : (
            <Link
              href={`/courses/${course.id}/content`}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Edit Content
            </Link>
          )}
          
          <Link
            href={`/courses/${course.id}`}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}