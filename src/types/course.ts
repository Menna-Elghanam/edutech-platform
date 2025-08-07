import { Level } from "@prisma/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  featured: boolean;
  duration: string;
  price: number;
  rating: number;
  studentsCount: number;
  level:Level;
  createdAt: Date;
  creatorId: string | null;
  creator?: {
    name: string | null;
    email: string;
  } | null;
}

export interface CreateCourseData {
  title: string;
  description: string;
  thumbnail?: string;
  featured: boolean;
  duration: string;
  price: number;
  level:Level;
  creatorId: string;
}

export interface PaginatedCourses {
  courses: Course[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export interface PlatformStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  averageRating: number;
}