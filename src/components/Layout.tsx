
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Admin Access Button - Only visible in development or for admin users */}
      <div className="fixed bottom-4 right-4 z-50">
        <a 
          href="/admin" 
          className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm"
          title="Admin Panel"
        >
          Admin
        </a>
      </div>
    </div>
  );
};

export default Layout;
