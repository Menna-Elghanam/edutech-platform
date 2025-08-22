import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Target, 
  Lightbulb, 
  Award, 
  Globe,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  MapPin,
  Coffee,
  Rocket,
  Star,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  years: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  metric?: string;
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AboutPage: React.FC = () => {
  const companyMilestones: Milestone[] = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a simple mission: make education accessible to everyone",
      metric: "2 founders"
    },
    {
      year: "2021",
      title: "First 1K Students",
      description: "Reached our first milestone of 1,000 active learners",
      metric: "1K+ students"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to serve students across 25+ countries",
      metric: "25+ countries"
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Launched AI-powered personalized learning paths",
      metric: "95% satisfaction"
    },
    {
      year: "2024",
      title: "Major Growth",
      description: "Reached 50K+ students and 1000+ courses",
      metric: "50K+ learners"
    }
  ];

  const coreValues: Value[] = [
    {
      title: "Student-First",
      description: "Every decision we make starts with asking: 'How does this help our students learn better?'",
      icon: <Heart className="h-6 w-6 text-red-500" />
    },
    {
      title: "Continuous Innovation",
      description: "We're always pushing boundaries to create better learning experiences through technology.",
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />
    },
    {
      title: "Inclusive Excellence",
      description: "Quality education should be accessible to everyone, regardless of background or circumstances.",
      icon: <Users className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Authentic Impact",
      description: "We measure success by the real-world impact we create in our students' lives and careers.",
      icon: <Target className="h-6 w-6 text-green-500" />
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former high school teacher turned EdTech entrepreneur. Believes technology can solve education's biggest challenges.",
      image: "/api/placeholder/150/150",
      years: "4 years"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer who left big tech to build meaningful learning experiences that actually work.",
      image: "/api/placeholder/150/150",
      years: "4 years"
    },
    {
      name: "Dr. Emma Rodriguez",
      role: "Head of Learning Science",
      bio: "PhD in Educational Psychology. Spent 10+ years researching how people learn best in digital environments.",
      image: "/api/placeholder/150/150",
      years: "3 years"
    },
    {
      name: "David Kim",
      role: "VP of Product",
      bio: "Design leader obsessed with creating intuitive experiences. Former Airbnb designer who joined our mission.",
      image: "/api/placeholder/150/150",
      years: "2 years"
    }
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - More Personal & Story-Driven */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-indigo-100">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Our Story</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            We are Building the
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Future of Learning
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Started in a small coffee shop in 2020, we have grown into a global platform 
            that is helped over 50,000 students transform their careers through technology education.
          </p>


        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a global education platform - here is how we got here.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {companyMilestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <div className={`flex items-center gap-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <Calendar className="h-4 w-4 text-indigo-600" />
                          <Badge variant="outline" className="text-indigo-600 border-indigo-200">{milestone.year}</Badge>
                        </div>
                        <CardTitle className="text-xl text-gray-900">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        {milestone.metric && (
                          <div className="text-2xl font-bold text-indigo-600">{milestone.metric}</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - More Authentic */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <Rocket className="h-12 w-12 mb-6 text-white/90" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-white/90 leading-relaxed mb-6">
                    We exist to democratize access to high-quality tech education. 
                    Every student deserves the opportunity to build a thriving career in technology, 
                    regardless of where they start.
                  </p>
                  <div className="flex items-center text-white/80">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span className="text-sm">Accessible • Practical • Career-Focused</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why We Do This</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Traditional education was not keeping up with the pace of technology. 
                Students were graduating with outdated skills, unable to land the jobs they wanted.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We saw an opportunity to bridge this gap by creating practical, 
                industry-relevant courses that actually prepare students for real-world careers.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-World Skills</h4>
                    <p className="text-gray-600 text-sm">Curriculum designed with input from industry professionals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Career Support</h4>
                    <p className="text-gray-600 text-sm">Job placement assistance and career coaching included</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Flexible Learning</h4>
                    <p className="text-gray-600 text-sm">Study at your own pace, from anywhere in the world</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Modern Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These are not just words on a wall. They are the principles that guide every decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group bg-white/70 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - More Personal */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Humans Behind the Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are educators, engineers, and dreamers who believe technology can make learning better for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-1">{member.name}</CardTitle>
                      <CardDescription className="text-indigo-600 font-medium text-sm mb-2">
                        {member.role}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Coffee className="h-3 w-3" />
                        <span>With us for {member.years}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Want to join our mission?</p>
            <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
              View Open Positions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Culture & Values in Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Built Different</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We are not just another EdTech company. We are a team of passionate educators 
                and technologists who actually care about student outcomes.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/20 rounded-lg p-2 mt-1">
                    <Shield className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Privacy-First</h4>
                    <p className="text-gray-400 text-sm">Your data is yours. We do not sell it, share it, or use it for ads.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 rounded-lg p-2 mt-1">
                    <Heart className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Student Success</h4>
                    <p className="text-gray-400 text-sm">95% of our graduates land jobs within 6 months of completing their program.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-500/20 rounded-lg p-2 mt-1">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Always Improving</h4>
                    <p className="text-gray-400 text-sm">We ship new features and improvements every week based on student feedback.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Student Support</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-sm text-gray-400">Platform Uptime</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white mb-1">1:10</div>
                    <div className="text-sm text-gray-400">Teacher Ratio</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-3xl font-bold text-white mb-1">50+</div>
                    <div className="text-sm text-gray-400">Industry Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - More Personal */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of students who have already transformed their careers. 
            Your future in tech starts with a single step.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2">
              Start Learning Today
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-colors duration-200">
              Talk to Our Team
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            Questions? Email us at hello@edutech.com or schedule a free consultation
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;