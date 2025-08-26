// lib/services/course-service.ts
import { prisma } from "@/lib/prisma";
import type { Course, CreateCourseData, PaginatedCourses } from "@/types/course";
import { Prisma } from "@prisma/client";

type CourseWithCreator = Prisma.CourseGetPayload<{
  include: {
    creator: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

export class CourseService {
  private static readonly DEFAULT_INCLUDE = {
    creator: {
      select: {
        name: true,
        email: true,
      },
    },
  } as const;

  // NEW: Get courses for admin dashboard with content status
  static async getAdminCourses(creatorId: string): Promise<Course[]> {
    try {
      const courses = await prisma.course.findMany({
        where: { creatorId },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          ...this.DEFAULT_INCLUDE,
          sections: {
            select: {
              id: true,
              _count: {
                select: { lessons: true }
              }
            }
          }
        }
      });

      return courses.map(course => ({
        ...course,
        // Add computed fields for admin dashboard
        sectionsCount: course.sections?.length || 0,
        lessonsCount: course.sections?.reduce((acc, section) => acc + section._count.lessons, 0) || 0,
      })) as Course[];
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);
      throw new Error("Failed to fetch courses");
    }
  }

  static async getPaginatedCourses(
    page: number = 1,
    limit: number = 4,
    search?: string,
    level?: string
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;

    try {
      const where: Prisma.CourseWhereInput = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (level) {
        where.level = level as Prisma.EnumLevelFilter;
      }

      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
          include: this.DEFAULT_INCLUDE,
        }),
        prisma.course.count({ where }),
      ]);

      return {
        courses: courses as Course[],
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page,
      };
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      throw new Error("Failed to fetch courses");
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
        include: this.DEFAULT_INCLUDE,
      });

      return newCourse as Course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error("A course with this title already exists");
        }
        if (error.code === 'P2003') {
          throw new Error("Invalid creator ID");
        }
      }
      
      console.error("Failed to create course:", error);
      throw new Error("Failed to create course");
    }
  }

  static async getCourseById(courseId: string): Promise<Course | null> {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: this.DEFAULT_INCLUDE,
      });

      return course as Course | null;
    } catch (error) {
      console.error("Failed to fetch course:", error);
      throw new Error("Failed to fetch course");
    }
  }

  static async updateCourse(
    courseId: string,
    data: Partial<CreateCourseData>
  ): Promise<Course> {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const updateData: Prisma.CourseUpdateInput = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail || '';
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.level !== undefined) updateData.level = data.level;

      const course = await prisma.course.update({
        where: { id: courseId },
        data: updateData,
        include: this.DEFAULT_INCLUDE,
      });

      return course as Course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Course not found");
        }
      }
      
      console.error("Failed to update course:", error);
      throw new Error("Failed to update course");
    }
  }

  static async deleteCourse(courseId: string): Promise<void> {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      await prisma.course.delete({
        where: { id: courseId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Course not found");
        }
      }
      
      console.error("Failed to delete course:", error);
      throw new Error("Failed to delete course");
    }
  }

  static async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    try {
      const courses = await prisma.course.findMany({
        where: { featured: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.DEFAULT_INCLUDE,
      });

      return courses as Course[];
    } catch (error) {
      console.error("Failed to fetch featured courses:", error);
      return [];
    }
  }

  // NEW: Check if course has content (for admin dashboard)
  static async getCourseContentStatus(courseId: string) {
    try {
      const courseWithSections = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              lessons: true
            }
          }
        }
      });

      if (!courseWithSections) return null;

      const sectionsCount = courseWithSections.sections.length;
      const lessonsCount = courseWithSections.sections.reduce(
        (acc, section) => acc + section.lessons.length, 0
      );

      return {
        hasContent: sectionsCount > 0 && lessonsCount > 0,
        sectionsCount,
        lessonsCount,
        isEmpty: sectionsCount === 0
      };
    } catch (error) {
      console.error("Failed to get course content status:", error);
      return null;
    }
  }

  // EXISTING METHODS (keeping your original logic)
  static async getCoursesByCreator(
    creatorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedCourses> {
    const skip = (page - 1) * limit;

    try {
      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where: { creatorId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: this.DEFAULT_INCLUDE,
        }),
        prisma.course.count({ where: { creatorId } }),
      ]);

      return {
        courses: courses as Course[],
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        currentPage: page,
      };
    } catch (error) {
      console.error("Failed to fetch courses by creator:", error);
      return {
        courses: [],
        totalPages: 0,
        totalCount: 0,
        currentPage: 1,
      };
    }
  }
}