import type React from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const FaqItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => (
  <details className="group border-b border-gray-300 py-4">
    <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
      <span>{question}</span>
      <span className="transition-transform transform group-open:rotate-45">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-labelledby="faq-icon-title"
        >
          <title id="faq-icon-title">Toggle FAQ</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </span>
    </summary>
    <div className="mt-4 text-[#1E3A2B]/80">{answer}</div>
  </details>
);

const FAQ: React.FC<{ faqs: FAQ[] }> = async ({ faqs }) => {
  // Sort by order field, default to 0 if not set
  const sortedFAQs = [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="bg-[#D0D6C9] py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide">
            Frequently Asked Questions
          </h2>
        </div>
        <div>
          {sortedFAQs.map((faq) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
