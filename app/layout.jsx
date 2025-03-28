import { Inter } from 'next/font/google'
import "./globals.css";
import { QueryClientProvider } from "@/components/query-client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NavBar } from '@/components/navbar';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Bloggy",
  description: "Write and Share Your Stories.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased w-screen h-screen relative flex justify-center`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster/>
          <QueryClientProvider>
            <div className="max-w-7xl h-full w-full relative px-2 flex flex-col">
              <NavBar />
              {children}
            </div>
          </QueryClientProvider>
        </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
