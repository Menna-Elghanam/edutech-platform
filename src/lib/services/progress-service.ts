import { prisma } from "@/lib/prisma";

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessedLessonId?: string;
}

export interface LessonProgressData {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

export class ProgressService {
  // Mark a lesson as completed
  static async markLessonCompleted(userId: string, lessonId: string) {
    try {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          completed: true,
          completedAt: new Date()
        },
        create: {
          userId,
          lessonId,
          completed: true,
          completedAt: new Date()
        }
      });
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
      throw new Error("Failed to update lesson progress");
    }
  }

  // Mark a lesson as incomplete
  static async markLessonIncomplete(userId: string, lessonId: string) {
    try {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          completed: false,
          completedAt: null
        },
        create: {
          userId,
          lessonId,
          completed: false,
          completedAt: null
        }
      });
    } catch (error) {
      console.error("Failed to mark lesson as incomplete:", error);
      throw new Error("Failed to update lesson progress");
    }
  }

  // Get progress for a specific course
  static async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress> {
    try {
      // Get all sections and lessons for the course
      const sections = await prisma.section.findMany({
        where: { courseId },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });

      // Get all lesson IDs
      const allLessons = sections.flatMap(section => section.lessons);
      const lessonIds = allLessons.map(lesson => lesson.id);

      // Get progress for these lessons
      const progressRecords = await prisma.lessonProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessonIds }
        }
      });

      // Calculate progress
      const totalLessons = allLessons.length;
      const completedLessons = progressRecords.filter(p => p.completed).length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Find last completed lesson
      const lastCompletedProgress = progressRecords
        .filter(p => p.completed && p.completedAt)
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0];

      return {
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage,
        lastAccessedLessonId: lastCompletedProgress?.lessonId
      };
    } catch (error) {
      console.error("Failed to get course progress:", error);
      throw new Error("Failed to get course progress");
    }
  }

  // Get progress for specific lessons
  static async getLessonsProgress(userId: string, lessonIds: string[]): Promise<LessonProgressData[]> {
    try {
      const progressRecords = await prisma.lessonProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessonIds }
        }
      });

      return lessonIds.map(lessonId => {
        const progress = progressRecords.find(p => p.lessonId === lessonId);
        return {
          lessonId,
          completed: progress?.completed || false,
          completedAt: progress?.completedAt || undefined
        };
      });
    } catch (error) {
      console.error("Failed to get lessons progress:", error);
      throw new Error("Failed to get lessons progress");
    }
  }

  // Check if a specific lesson is completed
  static async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    try {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        }
      });

      return progress?.completed || false;
    } catch (error) {
      console.error("Failed to check lesson progress:", error);
      return false;
    }
  }

  // Get user's enrolled courses with progress
  static async getUserCoursesProgress(userId: string) {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: true
        }
      });

      const coursesWithProgress = [];
      
      for (const enrollment of enrollments) {
        const progress = await this.getCourseProgress(userId, enrollment.courseId);
        coursesWithProgress.push({
          ...enrollment,
          progress
        });
      }

      return coursesWithProgress;
    } catch (error) {
      console.error("Failed to get user courses progress:", error);
      return [];
    }
  }
}