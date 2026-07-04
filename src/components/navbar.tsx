"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import logo from "../assets/logo.png";
import { User, Menu, X, LogOut, LayoutDashboard, UserCircle, ShieldCheck } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admin";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Membership", href: "/membership" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop user dropdown
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = isAdminEmail(user?.email);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close user dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-105">
              <Image
                src={logo}
                alt="The Benaras Beats Logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className={`${cormorant.className} text-2xl font-bold leading-none text-white lg:text-3xl`}>
                The Benaras Beats
              </h1>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-amber-400/80">
                Music for Mind & Soul
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? "text-amber-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-2 left-0 h-[1px] w-full origin-left bg-amber-400 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Desktop: single user icon with dropdown */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              {loading ? (
                <span className="text-sm text-gray-400 animate-pulse">Loading...</span>
              ) : (
                <>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                  >
                    <User size={18} />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-3 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-xl transition-all duration-200 ${
                      userMenuOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {user ? (
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <UserCircle size={16} /> Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/10"
                          >
                            <ShieldCheck size={16} /> Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="mt-1 flex items-center gap-3 rounded-lg border-t border-white/5 px-3 py-2 pt-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-400 transition-colors md:hidden focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu Drawer --- */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />

        {/* Drawer Content */}
        <div className="absolute right-0 top-0 h-full w-64 border-l border-white/10 bg-zinc-950 p-6 pt-20 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-white/5 pb-2">
              Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium uppercase tracking-wider transition-colors ${
                    isActive ? "text-amber-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Actions */}
          <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-4">
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white py-2"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white py-2"
                >
                  <UserCircle size={18} /> Profile
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 text-sm font-medium text-amber-400 py-2"
                  >
                    <ShieldCheck size={18} /> Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex w-full justify-center rounded-lg border border-white/20 px-4 py-2 text-sm text-white transition hover:border-amber-400 hover:text-amber-400"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex w-full justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}