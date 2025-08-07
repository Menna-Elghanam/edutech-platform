"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseService } from "@/lib/services/course-service";
import { CreateCourseSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ActionState = {
  success?: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
};

export async function createCourse(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    // Extract form data
    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      thumbnail: formData.get("thumbnail") as string,
      featured: formData.get("featured") === "on",
      duration: formData.get("duration") as string,
      price: parseFloat(formData.get("price") as string),
      level: formData.get("level") as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    };

    const validatedData = CreateCourseSchema.parse(raw);

    await CourseService.createCourse({
      ...validatedData,
      creatorId: session.user.id,
    });

    revalidatePath("/courses");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      return { validationErrors };
    }

    console.error("Server error:", error);
    return { error: "Failed to create course. Please try again." };
  }

  redirect("/courses");
}