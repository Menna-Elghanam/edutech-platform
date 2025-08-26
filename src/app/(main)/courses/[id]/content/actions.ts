"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseContentService } from "@/lib/services/course-content-service";
import { CourseService } from "@/lib/services/course-service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const LessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(1).optional(),
  type: z.enum(['TEXT', 'VIDEO', 'QUIZ', 'ASSIGNMENT']),
});

const SectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional(),
  lessons: z.array(LessonSchema),
});

const ContentSchema = z.object({
  sections: z.array(SectionSchema)
});

export async function saveCourseContent(
  courseId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[]
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Please sign in." };
    }

    if (session.user.role !== "ADMIN") {
      return { error: "Access denied." };
    }

    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      return { error: "Course not found." };
    }

    if (course.creatorId !== session.user.id) {
      return { error: "You don't have permission to edit this course." };
    }

    const validatedData = ContentSchema.parse({ sections });

    // Check for empty sections
    const emptySections = validatedData.sections.filter(s => s.lessons.length === 0);
    if (emptySections.length > 0) {
      return { error: "All sections must have at least one lesson." };
    }

    // Check for lessons without titles
    for (const section of validatedData.sections) {
      const emptyLessons = section.lessons.filter(l => !l.title.trim());
      if (emptyLessons.length > 0) {
        return { error: `All lessons in "${section.title}" must have titles.` };
      }
    }

    await CourseContentService.saveAllContent(courseId, validatedData.sections);

    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/content`);
    revalidatePath("/courses");
    revalidatePath("/dashboard");

    return { success: true };

  } catch (error) {
    console.error("Save course content error:", error);

    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Failed to save course content." };
  }
}