import type { Course } from "@/types/course";
import Link from "next/link";
import { Star, Users, Clock, TrendingUp } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Format price display
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  // Format students count
  const formatStudentsCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Get level color
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
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100">
        {/* Course Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">IMG</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Level Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Featured Badge */}
          {course.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={10} />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Course Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
            {course.title}
          </h3>
          
          {/* Creator */}
          <p className="text-sm text-gray-600 mb-2">
           {course.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({formatStudentsCount(course.studentsCount)} students)</span>
          </div>

          {/* Course Meta & Price */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{formatStudentsCount(course.studentsCount)}</span>
              </div>
            </div>
            <div className={`text-lg font-bold ${course.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
              {formatPrice(course.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}