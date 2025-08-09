# Educational Platform

A modern, full-stack educational platform built with Next.js, TypeScript, and PostgreSQL. This platform provides a comprehensive learning management system with user authentication, course management, and interactive learning features.

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Features

- User authentication and authorization
- Course creation and management
- Interactive learning modules
- Progress tracking and analytics
- Responsive design for all devices
- Advanced search and filtering
- Email notifications
- Modern UI with shadcn/ui components

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.0 or higher)
- npm, yarn, or pnpm
- PostgreSQL (version 12 or higher)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/educational-platform.git
   cd educational-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and update it with your configuration:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/educational_platform"
   
   # NextAuth (if using)
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email (optional)
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-email"
   SMTP_PASSWORD="your-password"
   
   # Other environment variables
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb educational_platform
   ```

   Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   # or if you have migration files
   npx prisma migrate deploy
   ```

   (Optional) Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```

## Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production build**
   ```bash
   npm run build
   npm start
   ```

3. **Database management**
   ```bash
   # View database in Prisma Studio
   npx prisma studio
   
   # Reset database (⚠️ This will delete all data)
   npx prisma migrate reset
   ```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (⚠️ destructive)

# UI Components
npm run ui:add       # Add new shadcn/ui component
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | ✅ |
| `NEXTAUTH_URL` | Base URL for authentication | ✅ |
| `SMTP_HOST` | SMTP server host | ❌ |
| `SMTP_PORT` | SMTP server port | ❌ |
| `SMTP_USER` | SMTP username | ❌ |
| `SMTP_PASSWORD` | SMTP password | ❌ |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push



## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

