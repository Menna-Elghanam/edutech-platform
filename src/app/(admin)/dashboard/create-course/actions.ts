"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseService } from "@/lib/services/course-service";
import { CreateCourseSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = {
  success?: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
  courseId?: string;
  courseName?: string;
};

function extractFormData(formData: FormData) {
  const price = formData.get("price") as string;
  const parsedPrice = price ? parseFloat(price) : 0;
  
  if (isNaN(parsedPrice)) {
    throw new Error("Invalid price format");
  }

  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    thumbnail: formData.get("thumbnail") as string,
    featured: formData.get("featured") === "on",
    duration: formData.get("duration") as string,
    price: parsedPrice,
    level: formData.get("level") as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
  };
}

export async function createCourse(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Please sign in to create a course." };
    }

    if (session.user.role !== "ADMIN") {
      return { error: "Only admins can create courses." };
    }

    const rawData = extractFormData(formData);
    const validatedData = CreateCourseSchema.parse(rawData);

    const newCourse = await CourseService.createCourse({
      ...validatedData,
      creatorId: session.user.id,
    });

    revalidatePath("/courses");
    revalidatePath("/dashboard");
    
    return { 
      success: true, 
      courseId: newCourse.id,
      courseName: newCourse.title 
    };

  } catch (error) {
    console.error("Create course error:", error);

    if (error instanceof z.ZodError) {
      const validationErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          validationErrors[issue.path[0] as string] = issue.message;
        }
      });
      return { validationErrors };
    }

    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return { error: "A course with this title already exists." };
      }
    }

    return { error: "Failed to create course. Please try again." };
  }
}