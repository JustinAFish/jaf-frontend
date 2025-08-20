"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Settings, BookOpen, Mail } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function HomeSidebar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>(
    typeof window !== "undefined" ? window.location.hash || "#home" : "#home"
  );
  const [mounted, setMounted] = useState(false);
  
  const navItems = useMemo(() => [
    { href: "#home", icon: Home, label: "Home" },
    { href: "#about", icon: User, label: "About" },
    { href: "#skills", icon: Settings, label: "Skills" },
    { href: "#resume", icon: BookOpen, label: "Resume" },
    { href: "#contact", icon: Mail, label: "Contact" }
  ], []);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on the home page and after mounting
    if (pathname !== "/" || !mounted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0
      }
    );

    // Safely observe all sections
    const cleanup = () => {
      navItems.forEach(({ href }) => {
        const sectionId = href.replace("#", "");
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };

    // Wait for a brief moment to ensure DOM is ready
    const timer = setTimeout(() => {
      navItems.forEach(({ href }) => {
        const sectionId = href.replace("#", "");
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    // Handle click events on nav items
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link?.getAttribute("href")?.startsWith("#")) {
        const sectionId = link.getAttribute("href") || "#home";
        setActiveSection(sectionId);
      }
    };

    document.addEventListener("click", handleNavClick);

    return () => {
      cleanup();
      clearTimeout(timer);
      document.removeEventListener("click", handleNavClick);
    };
  }, [pathname, navItems, mounted]);

  // Reset active section when returning to home page
  useEffect(() => {
    if (pathname === "/" && mounted) {
      const hash = window.location.hash || "#home";
      setActiveSection(hash);
    }
  }, [pathname, mounted]);

  // Prevent hydration issues
  if (!mounted) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-36 md:w-64 bg-foreground/50 backdrop-blur-sm border-r border-border/50 p-6">
        <div className="flex flex-col items-center mb-8 pt-16">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 mb-4">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/JAF_Photo.jpg"
                alt="Profile Picture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white">Justin Fish</h3>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <div
              key={href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground"
            >
              <Icon size={20} />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-36 md:w-64 bg-foreground/50 backdrop-blur-sm border-r border-border/50 p-6">
      <div className="flex flex-col items-center mb-8 pt-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 mb-4">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/JAF_Photo.jpg"
              alt="Profile Picture"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white">Justin Fish</h3>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === "/" && activeSection === href;
          const linkClassName = `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-card/50 group relative overflow-hidden ${
            isActive
              ? "bg-primary/20 text-primary border-l-4 border-primary translate-y-[-2px]"
              : "text-muted-foreground hover:text-white border-l-4 border-transparent"
          }`;
          
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                if (pathname !== "/") {
                  e.preventDefault();
                  window.location.href = `/${href}`;
                }
              }}
              className={linkClassName}
            >
              <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="transition-transform duration-200 group-hover:translate-x-1">{label}</span>
              {isActive && (
                <div className="absolute inset-y-0 right-0 w-1 bg-primary rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}