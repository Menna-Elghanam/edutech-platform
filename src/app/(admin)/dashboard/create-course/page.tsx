import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateCourseForm } from "./create-course-form";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New Course</h1>
                <p className="text-slate-600 mt-1">Build engaging educational content for your students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="p-8">
            <CreateCourseForm />
          </div>
        </div>
      </div>
    </div>
  );
}