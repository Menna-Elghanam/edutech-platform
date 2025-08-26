"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/services/progress-service";
import { revalidatePath } from "next/cache";

export type LessonActionState = {
  success?: boolean;
  error?: string;
};

export async function toggleLessonCompletion(
  lessonId: string,
  completed: boolean
): Promise<LessonActionState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Please sign in to track progress." };
    }

    if (completed) {
      await ProgressService.markLessonCompleted(session.user.id, lessonId);
    } else {
      await ProgressService.markLessonIncomplete(session.user.id, lessonId);
    }

    // Revalidate the lesson page and course learning page
    revalidatePath(`/courses/*/learn/${lessonId}`);
    revalidatePath(`/courses/*/learn`);

    return { success: true };

  } catch (error) {
    console.error("Failed to toggle lesson completion:", error);
    
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Failed to update lesson progress." };
  }
}