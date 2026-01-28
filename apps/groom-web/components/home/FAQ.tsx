import type React from "react";

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({
  question,
  children,
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
    <div className="mt-4 text-[#1E3A2B]/80">{children}</div>
  </details>
);

const FAQ: React.FC = () => {
  return (
    <section className="bg-[#D0D6C9] py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide">
            Frequently Asked Questions
          </h2>
        </div>
        <div>
          <FaqItem question="Is online therapy effective?">
            Yes, numerous studies have shown that online therapy can be just as
            effective as in-person therapy for a wide range of mental health
            concerns.
          </FaqItem>
          <FaqItem question="How do I choose the right therapist?">
            It's important to find someone you feel comfortable with. We
            recommend booking a free discovery call to see if our approach is
            the right fit for you.
          </FaqItem>
          <FaqItem question="What happens in the first session?">
            The first session is an opportunity for us to get to know each
            other. You can share what's on your mind, and we can explore how we
            might work together.
          </FaqItem>
          <FaqItem question="How long does a therapy session last?">
            Typically, a therapy session lasts for about 50 minutes to an hour,
            but this can be adjusted based on your individual needs and plan.
          </FaqItem>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
