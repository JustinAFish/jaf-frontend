"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeSkills() {
  const skillCategories = [
    {
      title: "Data Science",
      color: "blue",
      skills: [
        "Solution Architecture",
        "Machine Learning",
        "Generative AI / LLMs",
        "Deep Learning",
        "Natural Language Processing",
        "Git / Github",
        "Data Storytelling"
      ]
    },
    {
      title: "Programming",
      color: "blue",
      skills: [
        "Python",
        "React / Next.js",
        "SQL",
        "JavaScript / TypeScript",
        "TensorFlow / PyTorch",
        "Cloud Platforms (AWS, Azure, GCP)",
        "Database Design"
      ]
    },
    {
      title: "Product",
      color: "blue",
      skills: [
        "Agile Methodologies",
        "Product Strategy",
        "User Research",
        "Roadmap Development",
        "Stakeholder Management",
        "Product Development",
        "Product Lifecycles"
      ]
    },
    {
      title: "Soft Skills",
      color: "blue",
      skills: [
        "Leadership",
        "Communication",
        "Problem Solving",
        "Adaptability",
        "Decision Making",
        "Building Cohesive Teams", 
        "Multiple Sector Experience"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        card: "bg-gradient-to-br from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800",
        border: "border-blue-500/30 hover:border-blue-400",
        text: "text-blue-400",
        skill: "bg-blue-950/50 hover:bg-blue-800/50 border-blue-500/30 hover:border-blue-400"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="skills" className="py-16 px-4">
      <div className="px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-header">
            Skills
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            return (
              <Card 
                key={index} 
                className={`group relative border ${colors.border} ${colors.card} backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className={`text-2xl font-semibold ${colors.text}`}>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div 
                        key={skillIndex} 
                        className={`p-3 rounded-lg border ${colors.skill} transform transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg group/skill`}
                      >
                        <p className="text-slate-300 font-medium group-hover/skill:text-white transition-colors">{skill}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}