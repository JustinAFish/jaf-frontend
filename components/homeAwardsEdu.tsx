import { Card, CardHeader } from "./ui/card";

export default function HomeAbout() {
  return (
    <section id="about" className="py-20 px-16 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          className={`group relative border backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 rounded-xl flex flex-col`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          </div>
          <CardHeader className="flex-1 flex flex-col">
            <h2 className="text-4xl font-bold text-header text-center mb-8">
              Awards and Certifications
            </h2>
            <ul className="space-y-4 text-xl text-paragraph list-disc pl-6 flex-1">
              <li>
                2025 MCA Technology Consultant of the Year Finalist (Winner
                announced November 2025)
              </li>
              <li>
                AWS Certifications: Certified Solutions Architect - Associate,
                Generative AI Essentials
              </li>
              <li>
                Microsoft Certified: Develop Generative AI solutions with Azure
                OpenAI Service
              </li>
              <li>Google Cloud Certified: Professional Data Engineer</li>
              <li>Professional Scrum Master™ I</li>
              <li>Professional Scrum Product Owner™ I</li>
              <li>Databricks Lakehouse Fundamentals</li>
            </ul>
          </CardHeader>
        </Card>

        <Card
          className={`group relative border backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 rounded-xl flex flex-col`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          </div>
          <CardHeader className="flex-1 flex flex-col">
            <div className="text-center flex-1 flex flex-col justify-center space-y-6">
              <h3 className="text-lg text-paragraph">
                Stellenbosch University
              </h3>
              <h2 className="text-4xl font-bold text-header">
                Bachelor of Engineering (Mechanical) (Honours)
              </h2>
              <h3 className="text-2xl text-header">
                Dean&apos;s Merit (Top 10% of the class)
              </h3>
              <h3 className="text-2xl text-header">
                Golden Key member (Top 15% in all of Engineering)
              </h3>
              <h3 className="text-2xl text-header">1st Class</h3>
            </div>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
