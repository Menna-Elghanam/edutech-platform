
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Optional: Add custom logic here
    console.log("Protected route accessed:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Admin-only routes
        if (
          pathname.startsWith("/dashboard/create-course") ||
          pathname.startsWith("/dashboard/admin") 
          
        ) {
          return token?.role === "ADMIN";
        }

        // General protected routes - require any authenticated user
        if (
          pathname.startsWith("/courses") ||
          pathname.startsWith("/profile")
        ) {
          return !!token;
        }

        // Public routes
        return true;
      },
    },
    pages: {
      signIn: "/login", // Redirect 
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/profile/:path*",
  ],
};