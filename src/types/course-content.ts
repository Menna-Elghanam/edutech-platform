// types/course-content.ts
import { LessonType } from "@prisma/client";
import type { Course } from "./course";

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  type: LessonType;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSectionData {
  title: string;
  description?: string;
  courseId: string;
  order?: number;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  type: LessonType;
  sectionId: string;
  order?: number;
}

export interface CourseWithContent extends Course {
  sections: (Section & {
    lessons: Lesson[];
  })[];
}

// For the course content form
export interface CourseContentFormData {
  sections: {
    id?: string;
    title: string;
    description?: string;
    lessons: {
      id?: string;
      title: string;
      description?: string;
      content?: string;
      videoUrl?: string;
      duration?: number;
      type: LessonType;
    }[];
  }[];
}