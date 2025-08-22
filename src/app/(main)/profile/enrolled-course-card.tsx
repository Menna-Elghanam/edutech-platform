import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { UserEnrollment } from "@/lib/services/enrollment-service";

interface EnrolledCourseCardProps {
  enrollment: UserEnrollment;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course } = enrollment;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'text-green-600 bg-green-100';
      case 'INTERMEDIATE': return 'text-yellow-600 bg-yellow-100';
      case 'ADVANCED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200">
        {/* Course Image */}
        <div className="aspect-video overflow-hidden">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 font-semibold">No Image</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
              {course.level?.charAt(0) + course.level?.slice(1).toLowerCase() || 'Beginner'}
            </span>
          </div>

          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            by {course.creator?.name || 'Anonymous'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span>{course.rating?.toFixed(1) || '4.5'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Enrolled {new Date(enrollment.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}