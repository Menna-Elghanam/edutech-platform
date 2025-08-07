"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EnrollmentService } from "@/lib/services/enrollment-service";
import { revalidatePath } from "next/cache";

export type EnrollmentState = {
  success?: boolean;
  error?: string;
};

export async function enrollInCourse(courseId: string): Promise<EnrollmentState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Please log in to enroll in courses" };
    }

    await EnrollmentService.enrollUser(session.user.id, courseId);
    
    // Revalidate pages to show updated enrollment status
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/courses');
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Enrollment failed:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to enroll in course" 
    };
  }
}

export async function unenrollFromCourse(courseId: string): Promise<EnrollmentState> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { error: "Please log in to manage enrollments" };
    }

    await EnrollmentService.unenrollUser(session.user.id, courseId);
    
    revalidatePath(`/courses/${courseId}`);
    revalidatePath('/courses');
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error("Unenrollment failed:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to unenroll from course" 
    };
  }
}