import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateCourseForm } from "./create-course-form";

export default async function CreateCoursePage() {
  // Server-side auth check
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard?error=access-denied");
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      <CreateCourseForm />
    </div>
  );
}