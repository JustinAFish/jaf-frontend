/**
 * ExampleQuestions component - Provides categorized example questions for users.
 * Features:
 * - Floating panel with categorized questions
 * - Clear visual hierarchy with dividers
 * - Accent divider under main title
 * - Right-aligned with the lightbulb button
 * - Click-to-send functionality
 * - Visual grouping for related questions
 *
 * Used within ChatInput to provide quick access to example questions.
 */
import React from "react";

interface ExampleQuestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionClick: (question: string) => void;
}

interface QuestionCategory {
  title: string;
  questions: {
    text: string;
    isSequence?: boolean;
    sequenceNumber?: number;
  }[];
}

export function ExampleQuestions({
  isOpen,
  onClose,
  onQuestionClick,
}: ExampleQuestionsProps) {
  // Declare what example questions to ask
  const questionCategories: QuestionCategory[] = [
    {
      title: "Test the chat with common queries",
      questions: [
        {
          text: "What makes Justin a good fit for my business?",
        },
        {
          text: "Provide examples of successful client deliveries?",
        },
        {
          text: "What are Justin's unique selling points that will drive value for my organisation?",
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to handle clicks outside */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Examples Panel*/}
      <div
        style={{ zIndex: 39 }}
        className="absolute bottom-full right-0 mb-2 w-96 animate-fadeIn"
      >
        <div className="card bg-card/95 backdrop-blur-lg border border-border/50 shadow-xl">
          <div className="p-5">
            {/* Main title with larger text and red divider */}
            <div className="border-b-2 border-primary/30 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-primary">
                Example Questions
              </h2>
            </div>

            {/* Map categories from questionCategories */}
            <div className="space-y-6">
              {questionCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="animate-fadeIn" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                  <div className="space-y-3">
                    <div className="mb-3">
                      <h4 className="text-white font-medium text-lg">
                        {category.title}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {category.questions.map((question, questionIndex) => (
                        <button
                          key={questionIndex}
                          onClick={() => onQuestionClick(question.text)}
                          className={`
                            w-full text-left p-3 rounded-lg text-white
                            hover:bg-primary/5 hover:text-primary transition-all duration-200 text-sm
                            ${question.isSequence ? "pl-8 relative" : ""}
                            hover:shadow-md hover-lift
                          `}
                        >
                          {/* Sequence indicator */}
                          {question.isSequence && (
                            <span className="absolute left-3 text-muted-foreground">
                              {question.sequenceNumber}
                            </span>
                          )}
                          {question.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add divider if not the last category */}
                  {categoryIndex < questionCategories.length - 1 && (
                    <div className="my-4 border-t border-border/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
