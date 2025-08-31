import { Card, CardHeader } from "@nextui-org/react";
import { ShineBorder } from "@/components/magicui/shine-border";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CardTitle } from "./ui/card";
import { Icons } from "../public/svg/svgs";

export default function HomeHero() {
  const router = useRouter();

  return (
    <section id="home" className="relative h-screen flex items-center">
      <div className="absolute inset-0 z-0 -mt-8">
        <Image
          src="/data-background.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 px-16 flex flex-col mx-auto">
        <div className="grid md:grid-cols-2 gap-22 w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-bold mb-6 text-primary text-center">
              Justin Fish
            </h1>
            {/* Animated job title */}
            <h2 id="changing-text" className="text-2xl text-white mb-8 text-center transition-opacity duration-500">
              Full Stack Data Scientist
            </h2>
            <Card
              className={`group relative border backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 rounded-xl h-fit w-full max-w-2xl`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-white font-sans leading-relaxed tracking-widest">
                  Innovative strategic leader with a proven track record of
                  leveraging AI to drive business growth
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="text-center mt-12 flex gap-4 justify-center w-full max-w-2xl">
              <a
                href="/data/Justin_Fish_CV_2025.pdf"
                download="Justin_Fish_CV_2025.pdf"
                className="flex-1 px-4 py-3 bg-primary text-foreground text-bold hover:bg-primary/90 transition-colors rounded-lg font-medium flex items-center justify-center"
              >
                Download CV
              </a>
              <a
                onClick={() => router.push("/chat")}
                className="relative inline-flex items-center flex-1"
              >
                <div className="w-full px-1 py-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 rounded-lg shadow-md cursor-pointer">
                  <div className="flex items-center justify-center bg-foreground rounded-lg px-2 py-2 shadow-inner hover:bg-transparent">
                    <Icons.aisparkle />
                    <span className="text-lg text-white">AI Chat</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <a href="https://www.mca.org.uk/awards/finalists-2025/individuals-2025/justin-fish-capgemini-invent" target="_blank" rel="noopener noreferrer">
            <Card className="group relative w-full h-[500px] bg-[#DDDDDD] rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-120 hover:shadow-2xl hover:shadow-primary/20">
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}  />
              <Image
                src="/MCA.png"
                alt="Profile Image"
                fill
                className="object-contain rounded-xl hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-0"></div>
              <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                <h2 className="text-xl font-medium text-black transition-colors duration-300">
                  Technology Consultant of the Year
                </h2>
              </div>
            </Card>
          </a>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">

        </div>
        
        </div> */}
      </div>
    </section>
  );
}
