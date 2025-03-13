import React from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white shadow-md">
            <nav className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">
                  <Link href="/">
                    Arrow
                  </Link>
                </div>
                
                <div className="hidden md:flex space-x-6">
                  <Link href="/map" className="hover:text-gray-300 transition duration-200">
                    Map
                  </Link>
                  <Link href="/match" className="hover:text-gray-300 transition duration-200">
                    Match
                  </Link>
                  <Link href="/event-finder" className="hover:text-gray-300 transition duration-200">
                    Event Finder
                  </Link>
                  <Link href="/login" className="hover:text-gray-300 transition duration-200">
                    Login
                  </Link>
                  <Link href="/register" className="hover:text-gray-300 transition duration-200">
                    Register
                  </Link>
                  <Link href="/profile" className="hover:text-gray-300 transition duration-200">
                    Profile
                  </Link>
                </div>
              </div>

            </nav>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>Made with  by <a href="https://github.com/msavoiu">Madeline Savoiu</a></p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}