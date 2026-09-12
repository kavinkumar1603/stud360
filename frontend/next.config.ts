import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL || 'https://hcmgypmdtbvvkctphnpw.supabase.co',
    NEXT_SUPABASE_ANON_KEY: process.env.NEXT_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWd5cG1kdGJ2dmtjdHBobnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMDEyNDYsImV4cCI6MjEwMTc3NzI0Nn0.Y55rUAC-3cDMN8FgkUg3L0n9wtOaLUHg7vyVuBAzjMk',
  },
  async rewrites() {
    const rawBackend = process.env.BACKEND_URL || process.env.NEXT_API_URL || 'https://stud360.onrender.com';
    const backendUrl = rawBackend.replace(/\/api\/?$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
