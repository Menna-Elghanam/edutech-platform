"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CourseSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'all');
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      
      if (search.trim()) params.set('search', search.trim());
      if (level !== 'all') params.set('level', level);
      
      const url = params.toString() ? `/courses?${params.toString()}` : '/courses';
      router.push(url);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, level, router]);

  const clearFilters = () => {
    setSearch('');
    setLevel('all');
    router.push('/courses');
  };

  const hasFilters = search || level !== 'all';

  return (
    <div className="bg-card rounded-lg border p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="sm:w-auto w-full">
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: &ldquo;{search}&ldquo;
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                className="h-auto p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {level !== 'all' && (
            <Badge variant="outline" className="gap-1">
              Level: {level.toLowerCase()}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLevel('all')}
                className="h-auto p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}