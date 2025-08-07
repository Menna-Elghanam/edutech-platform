import { prisma } from "@/lib/prisma";
import type { Course, CreateCourseData, PaginatedCourses } from "@/types/course";

export class CourseService {
  static async getPaginatedCourses(page: number = 1, limit: number = 3): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    
    try {
      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          skip,
          take: limit,
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
            creator: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }) as Promise<Course[]>,
        prisma.course.count()
      ]);

      return {
        courses,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page
      };
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return {
        courses: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      };
    }
  }

  static async createCourse(data: CreateCourseData): Promise<Course> {
    try {
      const newCourse = await prisma.course.create({
        data: {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail || '',
          featured: data.featured,
          duration: data.duration,
          price: data.price,
          level: data.level,
          rating: 4.5, 
          studentsCount: 0, 
          creatorId: data.creatorId,
        },
        include: {
          creator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }) as Course;

      return newCourse;
    } catch (error) {
      console.error("Failed to create course:", error);
      throw new Error("Failed to create course");
    }
  }

  static async getCourseById(courseId: string): Promise<Course | null> {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          creator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }) as Course | null;

      return course;
    } catch (error) {
      console.error("Failed to fetch course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async updateCourse(courseId: string, data: Partial<CreateCourseData>): Promise<Course> {
    try {
      const course = await prisma.course.update({
        where: { id: courseId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail || '' }),
          ...(data.featured !== undefined && { featured: data.featured }),
        },
        include: {
          creator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }) as Course;

      return course;
    } catch (error) {
      console.error("Failed to update course:", error);
      throw new Error("Failed to update course");
    }
  }

  static async deleteCourse(courseId: string): Promise<void> {
    try {
      await prisma.course.delete({
        where: { id: courseId }
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
      throw new Error("Failed to delete course");
    }
  }

  static async searchCourses(query: string, page: number = 1, limit: number = 10): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    
    try {
      const where = {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } }
        ]
      };

      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
            creator: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }) as Promise<Course[]>,
        prisma.course.count({ where })
      ]);

      return {
        courses,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page
      };
    } catch (error) {
      console.error("Failed to search courses:", error);
      return {
        courses: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      };
    }
  }

  static async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    try {
      const courses = await prisma.course.findMany({
        where: { featured: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }) as Course[];

      return courses;
    } catch (error) {
      console.error("Failed to fetch featured courses:", error);
      return [];
    }
  }

  static async getCoursesByCreator(creatorId: string, page: number = 1, limit: number = 10): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;
    
    try {
      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where: { creatorId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            creator: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }) as Promise<Course[]>,
        prisma.course.count({ where: { creatorId } })
      ]);

      return {
        courses,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page
      };
    } catch (error) {
      console.error("Failed to fetch courses by creator:", error);
      return {
        courses: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1
      };
    }
  }
}