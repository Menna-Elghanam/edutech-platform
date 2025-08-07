
import { CourseService } from "@/lib/services/course-service";
import { StatsService } from "@/lib/services/statsService";
import HomePage from "@/components/HomePage";

export default async function Home() {
  const [featuredCourses, stats] = await Promise.all([
    CourseService.getFeaturedCourses(6),
    StatsService.getPlatformStats()
  ]);

  return (
    <HomePage 
      featuredCourses={featuredCourses} 
      stats={stats} 
    />
  );
}