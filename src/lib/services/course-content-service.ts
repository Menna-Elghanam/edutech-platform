// lib/services/course-content-service.ts
import { prisma } from "@/lib/prisma";
import type { 
  Section, 
  Lesson, 
  CreateSectionData, 
  CreateLessonData,
  CourseWithContent 
} from "@/types/course-content";
import { Prisma } from "@prisma/client";

export class CourseContentService {
  // Get course with all its sections and lessons
  static async getCourseWithContent(courseId: string): Promise<CourseWithContent | null> {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          creator: {
            select: { name: true, email: true }
          },
          sections: {
            orderBy: { order: 'asc' },
            include: {
              lessons: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      return course as CourseWithContent | null;
    } catch (error) {
      console.error("Failed to fetch course with content:", error);
      throw new Error("Failed to fetch course content");
    }
  }

  // Create a new section
  static async createSection(data: CreateSectionData): Promise<Section> {
    try {
      const order = data.order ?? await this.getNextSectionOrder(data.courseId);

      const section = await prisma.section.create({
        data: {
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          order
        }
      });

      return section as Section;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error("Invalid course ID");
        }
        if (error.code === 'P2002') {
          throw new Error("Section order conflict");
        }
      }
      
      console.error("Failed to create section:", error);
      throw new Error("Failed to create section");
    }
  }

  // Update an existing section
  static async updateSection(sectionId: string, data: Partial<CreateSectionData>): Promise<Section> {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }

    try {
      const section = await prisma.section.update({
        where: { id: sectionId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.order !== undefined && { order: data.order })
        }
      });

      return section as Section;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Section not found");
        }
      }
      
      console.error("Failed to update section:", error);
      throw new Error("Failed to update section");
    }
  }

  // Delete a section (and all its lessons)
  static async deleteSection(sectionId: string): Promise<void> {
    if (!sectionId) {
      throw new Error("Section ID is required");
    }

    try {
      await prisma.section.delete({
        where: { id: sectionId }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Section not found");
        }
      }
      
      console.error("Failed to delete section:", error);
      throw new Error("Failed to delete section");
    }
  }

  // Create a new lesson
  static async createLesson(data: CreateLessonData): Promise<Lesson> {
    try {
      const order = data.order ?? await this.getNextLessonOrder(data.sectionId);

      const lesson = await prisma.lesson.create({
        data: {
          title: data.title,
          description: data.description,
          content: data.content,
          videoUrl: data.videoUrl,
          duration: data.duration,
          type: data.type,
          sectionId: data.sectionId,
          order
        }
      });

      return lesson as Lesson;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error("Invalid section ID");
        }
        if (error.code === 'P2002') {
          throw new Error("Lesson order conflict");
        }
      }
      
      console.error("Failed to create lesson:", error);
      throw new Error("Failed to create lesson");
    }
  }

  // Update an existing lesson
  static async updateLesson(lessonId: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    try {
      const lesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.type && { type: data.type }),
          ...(data.order !== undefined && { order: data.order })
        }
      });

      return lesson as Lesson;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Lesson not found");
        }
      }
      
      console.error("Failed to update lesson:", error);
      throw new Error("Failed to update lesson");
    }
  }

  // Delete a lesson
  static async deleteLesson(lessonId: string): Promise<void> {
    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    try {
      await prisma.lesson.delete({
        where: { id: lessonId }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error("Lesson not found");
        }
      }
      
      console.error("Failed to delete lesson:", error);
      throw new Error("Failed to delete lesson");
    }
  }

  // Helper: Get next section order number
  private static async getNextSectionOrder(courseId: string): Promise<number> {
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' }
    });

    return (lastSection?.order ?? 0) + 1;
  }

  // Helper: Get next lesson order number
  private static async getNextLessonOrder(sectionId: string): Promise<number> {
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    });

    return (lastLesson?.order ?? 0) + 1;
  }

  // Bulk save all content (for the content builder form)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async saveAllContent(courseId: string, sections: any[]): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Get existing sections
        const existingSections = await tx.section.findMany({
          where: { courseId },
          include: { lessons: true }
        });

        const processedSectionIds: string[] = [];

        // Process each section
        for (let i = 0; i < sections.length; i++) {
          const sectionData = sections[i];
          let sectionId: string;

          if (sectionData.id && existingSections.some(s => s.id === sectionData.id)) {
            // Update existing section
            const updatedSection = await tx.section.update({
              where: { id: sectionData.id },
              data: {
                title: sectionData.title,
                description: sectionData.description,
                order: i + 1
              }
            });
            sectionId = updatedSection.id;
          } else {
            // Create new section
            const newSection = await tx.section.create({
              data: {
                title: sectionData.title,
                description: sectionData.description,
                courseId,
                order: i + 1
              }
            });
            sectionId = newSection.id;
          }

          processedSectionIds.push(sectionId);

          // Process lessons for this section
          const existingLessons = existingSections
            .find(s => s.id === sectionId)?.lessons || [];
          const processedLessonIds: string[] = [];

          for (let j = 0; j < sectionData.lessons.length; j++) {
            const lessonData = sectionData.lessons[j];
            let lessonId: string;

            if (lessonData.id && existingLessons.some(l => l.id === lessonData.id)) {
              // Update existing lesson
              const updatedLesson = await tx.lesson.update({
                where: { id: lessonData.id },
                data: {
                  title: lessonData.title,
                  description: lessonData.description,
                  content: lessonData.content,
                  videoUrl: lessonData.videoUrl,
                  duration: lessonData.duration,
                  type: lessonData.type,
                  order: j + 1
                }
              });
              lessonId = updatedLesson.id;
            } else {
              // Create new lesson
              const newLesson = await tx.lesson.create({
                data: {
                  title: lessonData.title,
                  description: lessonData.description,
                  content: lessonData.content,
                  videoUrl: lessonData.videoUrl,
                  duration: lessonData.duration,
                  type: lessonData.type,
                  sectionId,
                  order: j + 1
                }
              });
              lessonId = newLesson.id;
            }

            processedLessonIds.push(lessonId);
          }

          // Delete lessons no longer present
          const lessonsToDelete = existingLessons
            .filter(l => !processedLessonIds.includes(l.id))
            .map(l => l.id);

          if (lessonsToDelete.length > 0) {
            await tx.lesson.deleteMany({
              where: { id: { in: lessonsToDelete } }
            });
          }
        }

        // Delete sections no longer present
        const sectionsToDelete = existingSections
          .filter(s => !processedSectionIds.includes(s.id))
          .map(s => s.id);

        if (sectionsToDelete.length > 0) {
          await tx.section.deleteMany({
            where: { id: { in: sectionsToDelete } }
          });
        }
      });
    } catch (error) {
      console.error("Failed to save all content:", error);
      throw new Error("Failed to save course content");
    }
  }
}