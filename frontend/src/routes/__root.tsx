import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ONN Bikes — Bike Rental in Pune" },
      { name: "description", content: "Rent bikes in Pune at lowest prices. Starting from ₹119/day. Daily, weekly & monthly rentals with doorstep delivery." },
      { name: "author", content: "ONN Bikes" },
      { property: "og:title", content: "ONN Bikes — Bike Rental in Pune" },
      { property: "og:description", content: "Rent bikes in Pune at lowest prices. Hourly, daily, weekly & monthly plans." },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏍️</text></svg>",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <FooterSection />
      </div>
      <Toaster />
    </AuthProvider>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">ONN</span>
          <span className="text-sm text-gray-500 hidden sm:inline">Bikes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Home</Link>
          <a href="#bikes" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Bikes</a>
          <a href="#services" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Services</a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">How It Works</a>
          <a href="#faqs" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">FAQs</a>
          {user ? (
            <div className="flex items-center gap-2 ml-4">
              <Link to="/bookings">
                <Button variant="ghost" size="sm" className="text-sm">My Bookings</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={signOut} className="text-sm">Sign out</Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-sm">Sign in</Button>
            </Link>
          )}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path strokeLinecap="round" d="M4 6h16" />
                <path strokeLinecap="round" d="M4 12h16" />
                <path strokeLinecap="round" d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="#bikes" className="block text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Bikes</a>
          <a href="#services" className="block text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#how-it-works" className="block text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#faqs" className="block text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
          {user ? (
            <>
              <Link to="/bookings" className="block text-sm font-medium text-orange-500" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block text-sm font-medium text-gray-500">Sign out</button>
            </>
          ) : (
            <Link to="/auth" className="block text-sm font-medium text-orange-500" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}

function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-2xl font-bold text-orange-500">ONN</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              ONN Bikes redefines how you rent. Hourly, daily, weekly, or monthly — choose what fits your life. Flexible bike rentals for every need, every rider, every budget.
            </p>
            <div className="flex gap-3 mt-4">
              {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors" aria-label={social}>
                  <span className="text-xs">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Policies</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Cities we serve</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Electric Bike</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Scooter Rental</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Tariff Plans</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Locality</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Landmarks</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Partner with Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+918432780780" className="hover:text-orange-400 transition-colors">+91 8432780780</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@onnbikes.com" className="hover:text-orange-400 transition-colors">support@onnbikes.com</a>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500">Download the app</p>
              <div className="flex gap-2">
                <span className="inline-block px-3 py-1.5 bg-gray-800 rounded text-xs">App Store</span>
                <span className="inline-block px-3 py-1.5 bg-gray-800 rounded text-xs">Play Store</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          Copyright © 2026 ONN Bikes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
