"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HomeContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          recipient: "JustinAnthonyFish@gmail.com",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-16">
      <Card className="group relative border border-blue-500/30 hover:border-blue-400 bg-gradient-to-br from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        </div>
        <CardHeader>
          <h2 className="text-4xl font-bold mb-8 text-header">Contact Me</h2>
          <p className="text-xl text-paragraph mb-2">
            I&apos;m currently open to new opportunities and collaborations.
            Feel free to reach out if you&apos;d like to discuss potential
            opportunities
          </p>
        </CardHeader>
        <CardContent className="px-8 relative z-10">
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-paragraph mb-2">
                    Your Name / Organisation
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 bg-card border border-card-foreground rounded focus:outline-none focus:border-primary text-white"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-paragraph mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 bg-card border border-card-foreground rounded focus:outline-none focus:border-primary text-white"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-paragraph mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full p-3 bg-card border border-card-foreground rounded focus:outline-none focus:border-primary text-white resize-none"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={`px-8 py-3 bg-primary text-foreground hover:bg-primary/90 transition-colors rounded font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <p className="text-green-500 mt-2">
                  Your message has been sent successfully!
                </p>
              )}

              {submitStatus === "error" && (
                <p className="text-red-500 mt-2">
                  Failed to send message. Please try again later.
                </p>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
