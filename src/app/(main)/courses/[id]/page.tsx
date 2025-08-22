// import { prisma } from "@/lib/prisma";

// type Props = {
//   params: { id: string };
// };

// export default async function CourseDetailPage({ params }: Props) {
//   const course = await prisma.course.findUnique({
//     where: { id: params.id },
//   });

//   if (!course) return <div>Course not found.</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-4">
//       <h1 className="text-3xl font-bold">{course.title}</h1>
//       <p>{course.description}</p>
//     </div>
//   );
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseService } from "@/lib/services/course-service";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { EnrollmentButton } from "./enrollment-button";
import { Star, Clock, Users, BookOpen } from "lucide-react";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const course = await CourseService.getCourseById(params.id);

  if (!course) {
    redirect("/courses");
  }

  const isEnrolled = await EnrollmentService.isUserEnrolled(session.user.id, course.id);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'text-green-600 bg-green-100';
      case 'INTERMEDIATE': return 'text-yellow-600 bg-yellow-100';
      case 'ADVANCED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Image */}
            <div className="aspect-video rounded-lg overflow-hidden">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Course Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(course.level || 'BEGINNER')}`}>
                  {course.level || 'Beginner'}
                </span>
                {course.featured && (
                  <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-medium">{course.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-gray-600" size={20} />
                  <span>{course.studentsCount || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-600" size={20} />
                  <span>{course.duration || '6 weeks'}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(course.price || 0)}
                </div>
              </div>



              {/* Enrollment Button */}
              <EnrollmentButton 
                courseId={course.id} 
                isEnrolled={isEnrolled}
                disabled={session.user.role === "ADMIN"} // Admins don't need to enroll
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}