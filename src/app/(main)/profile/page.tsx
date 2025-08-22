import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { BookOpen } from "lucide-react";
import Link from "next/link";


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const enrollments = await EnrollmentService.getUserEnrollments(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 mb-4">Welcome back, {session.user.name}!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{enrollments.length}</div>
              <div className="text-sm text-gray-600">Enrolled Courses</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">{session.user.role}</div>
              <div className="text-sm text-gray-600">Account Type</div>
            </div>
            <div className="text-center p-4">
              {/* <div className="text-2xl font-bold text-purple-600">
                {new Date(session.user.createdAt || Date.now()).getFullYear()}
              </div> */}
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          
          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <EnrolledCourseCard 
                  key={enrollment.id} 
                  enrollment={enrollment} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 mb-4">
                Start learning by enrolling in your first course!
              <Link 
                href="/courses"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}