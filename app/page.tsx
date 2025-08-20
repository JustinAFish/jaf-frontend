"use client";
import HomeSidebar from "@/components/homeSidebar";
import HomeHero from "@/components/homeHero";
import HomeAbout from "@/components/homeAbout";
import HomeSkills from "@/components/homeSkills";
import HomeExperience from "@/components/homeExperience";
import HomeContact from "@/components/homeContact";
import HomeAwardsEdu from "@/components/homeAwardsEdu";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background text-white pt-16">
      {/* Sidebar */}
      <HomeSidebar />

      {/* Main Content */}
      <main className="ml-36 md:ml-64 flex-1">
        {/* Hero Section */}
        <HomeHero />

        {/* About Section */}
        <HomeAbout />

        {/* Skills Section */}
        <HomeSkills />

        {/* Experience Section */}
        <HomeExperience />

        {/* Awards and Certifications Section */}
        <HomeAwardsEdu />

        {/* Contact Section */}
        <HomeContact />

        {/* Footer */}
        <footer className="py-8 text-center text-paragraph bg-background">
          <p>© {new Date().getFullYear()} Justin Fish. All Rights Reserved.</p>
        </footer>
      </main>

      {/* Script for changing text */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const titles = ["Full Stack Data Scientist", "Product Owner", "Solution Architect"];
          let index = 0;
          const changingText = document.getElementById('changing-text');
          
          // Check if element exists before using it
          if (changingText) {
            setInterval(() => {
              index = (index + 1) % titles.length;
              changingText.style.opacity = '0';
              
              setTimeout(() => {
                changingText.textContent = titles[index];
                changingText.style.opacity = '1';
              }, 500);
            }, 3000);
          } else {
            console.warn('Element with ID "changing-text" not found');
          }
        });
      `,
        }}
      />

      {/* Script for active section highlighting */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const sections = document.querySelectorAll('section');
          const navLinks = document.querySelectorAll('nav a');
          
          window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
              const sectionTop = section.offsetTop;
              const sectionHeight = section.clientHeight;
              
              if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
              }
            });
            
            navLinks.forEach(link => {
              link.classList.remove('bg-card', 'text-primary');
              
              if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('bg-card', 'text-primary');
              }
            });
          });
        });
      `,
        }}
      />
    </div>
  );
}
