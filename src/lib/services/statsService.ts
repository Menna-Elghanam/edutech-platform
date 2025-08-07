import { prisma } from "@/lib/prisma";

import { PlatformStats } from "@/types/course";
import { Role } from "@prisma/client";

export class StatsService {
  static async getPlatformStats(): Promise<PlatformStats> {
    try {
      const [
        totalCourses,
        totalStudents,
        totalInstructors,
        avgRatingResult
      ] = await Promise.all([
        // Total courses
        prisma.course.count(),
        
        // Total students 
        prisma.user.count({
          where: { role: Role.STUDENT }
        }),
        
        // Total instructors (users who have created courses)
        prisma.user.count({
          where: { 
            courses: {
              some: {}
            }
          }
        }),
        
        // Average rating across all courses
        prisma.course.aggregate({
          _avg: {
            rating: true
          }
        })
      ]);

      return {
        totalCourses,
        totalStudents,
        totalInstructors,
        averageRating: avgRatingResult._avg.rating || 0
      };
    } catch (error) {
      console.error("Failed to fetch platform stats:", error);
      return {
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        averageRating: 0
      };
    }
  }
}