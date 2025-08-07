import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UsersIcon, BookOpenIcon, CheckCircleIcon, StarIcon, ArrowRightIcon } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import type { Course } from "@/types/course";
import type { PlatformStats } from "@/types/course";

interface HomePageProps {
    featuredCourses: Course[];
    stats: PlatformStats;
}

export default function HomePage({ featuredCourses, stats }: HomePageProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                {/* <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" /> */}

                <div className="relative container mx-auto px-6 md:px-8 lg:px-12 py-24 md:py-32 lg:py-40">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                            Join 10,000+ learners worldwide
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                            Learn skills that
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> matter</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl leading-relaxed">
                            Master in-demand skills with expert-led courses designed for the modern learner. Start your journey today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-4 text-lg">
                                <Link href="/courses" className="flex items-center">
                                    Start Learning
                                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="ghost" className="text-white border-white/20 hover:bg-white/10 px-8 py-4 text-lg">
                                <Link href="/about">How it works</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 md:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Trusted by learners worldwide
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Join a growing community of ambitious professionals advancing their careers
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { value: stats.totalCourses.toLocaleString(), label: "Expert Courses" },
                            { value: stats.totalStudents.toLocaleString(), label: "Active Students" },
                            { value: stats.totalInstructors, label: "Industry Experts" },
                            { value: stats.averageRating.toFixed(1), label: "Average Rating", hasIcon: true }
                        ].map((stat, index) => (
                            <div key={index} className="group text-center bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                                    {stat.value}
                                    {stat.hasIcon && <StarIcon className="inline w-8 h-8 text-amber-400 fill-current ml-2" />}
                                </div>
                                <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Featured Courses Section */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-6 md:px-8 lg:px-12">
                    <div className="max-w-3xl mb-16">
                        <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-sm font-medium mb-6">
                            Featured Content
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            Popular courses this month
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Hand-picked courses from our expert instructors, loved by thousands of students worldwide.
                        </p>
                    </div>

                    {/* Smaller grid for course cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50">
                            <Link href="/courses" className="flex items-center">
                                View All Courses
                                <ArrowRightIcon className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28 bg-slate-50">
                <div className="container mx-auto px-6 md:px-8 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            Everything you need to succeed
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            We ve built the perfect learning environment with tools and features designed for modern education.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                                <BookOpenIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Expert Instructors
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                Learn from industry professionals with years of experience and proven track records.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 group-hover:bg-green-200 transition-colors duration-200">
                                <CheckCircleIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Hands-on Projects
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                Build real-world projects that showcase your skills and enhance your portfolio.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 group-hover:bg-purple-200 transition-colors duration-200">
                                <UsersIcon className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                Learning Community
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                Connect with fellow learners, share experiences, and grow together in our supportive community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                {/* <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" /> */}

                <div className="relative container mx-auto px-6 md:px-8 lg:px-12 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Ready to level up your skills?
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                            Join thousands of students who have transformed their careers with our comprehensive courses.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-4 text-lg">
                                <Link href="/register" className="flex items-center">
                                    Get Started Free
                                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="ghost" className="text-white border-white/20 hover:bg-white/10 px-8 py-4 text-lg">
                                <Link href="/courses">Browse Courses</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}



