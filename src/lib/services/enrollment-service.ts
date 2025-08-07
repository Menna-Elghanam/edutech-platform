import { prisma } from "@/lib/prisma";

export interface UserEnrollment {
  id: string;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    level: string;
    rating: number;
    creator: {
      name: string | null;
    } | null;
  };
}

export class EnrollmentService {
  static async enrollUser(userId: string, courseId: string) {
    try {
      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (existingEnrollment) {
        throw new Error("Already enrolled in this course");
      }

      // Create enrollment and update course student count
      const [enrollment] = await prisma.$transaction([
        prisma.enrollment.create({
          data: {
            userId,
            courseId
          }
        }),
        prisma.course.update({
          where: { id: courseId },
          data: {
            studentsCount: {
              increment: 1
            }
          }
        })
      ]);

      return enrollment;
    } catch (error) {
      console.error("Failed to enroll user:", error);
      throw error;
    }
  }

  static async unenrollUser(userId: string, courseId: string) {
    try {
      // Remove enrollment and update course student count
      await prisma.$transaction([
        prisma.enrollment.delete({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          }
        }),
        prisma.course.update({
          where: { id: courseId },
          data: {
            studentsCount: {
              decrement: 1
            }
          }
        })
      ]);
    } catch (error) {
      console.error("Failed to unenroll user:", error);
      throw error;
    }
  }

  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });
      return !!enrollment;
    } catch (error) {
      console.error("Failed to check enrollment:", error);
      return false;
    }
  }

  static async getUserEnrollments(userId: string): Promise<UserEnrollment[]> {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              creator: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return enrollments;
    } catch (error) {
      console.error("Failed to get user enrollments:", error);
      return [];
    }
  }
}