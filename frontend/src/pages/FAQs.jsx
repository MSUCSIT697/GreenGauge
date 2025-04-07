import React, { useState } from "react";

const faqs = [
  {
    question: "What is Green Gauge?",
    answer:
      "Green Gauge helps you track and analyze your carbon footprint by using your financial data or manually entering your expenses.",
  },
  {
    question: "How do I add Green Gauge to my mobile Home Screen?",
    answer: (
      <div className="space-y-4">
        <div>
          <strong>iPhone (Safari):</strong>
          <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
            <li>Open Safari and navigate to our website.</li>
            <li>
              Tap the <strong>Share</strong> icon (the square with the upward arrow).
            </li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
            <li>Rename it if you'd like, then tap <strong>Add</strong>.</li>
          </ol>
        </div>
        <div>
          <strong>Android (Chrome):</strong>
          <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
            <li>Open Chrome and navigate to our website.</li>
            <li>
              Tap the <strong>three-dot</strong> menu (top-right corner).
            </li>
            <li>Select <strong>Add to Home Screen</strong>.</li>
            <li>You can rename the shortcut and then tap <strong>Add</strong>.</li>
          </ol>
        </div>
        <p className="italic text-gray-500">
          Your shortcut will use the Green Gauge logo as the icon!
        </p>
      </div>
    ),
  },
  {
    question: "How does Green Gauge calculate my footprint?",
    answer:
      "We use industry-standard carbon emission factors to estimate your environmental impact based on your spending habits.",
  },
  {
    question: "Can I manually enter my data?",
    answer:
      "Yes! You can either upload a PDF of your transactions or use our manual calculator to input your expenses.",
  },
  {
    question: "Where can I see my past reports?",
    answer:
      "All your past calculations and uploads are stored in the Reports section, where you can view detailed results.",
  },
  {
    question: "What can I do to reduce my footprint?",
    answer:
      "We provide personalized sustainability goals based on your footprint, such as reducing meat consumption, carpooling, and supporting eco-friendly brands.",
  },
  {
    question: "What categories does Green Gauge analyze?",
    answer:
      "Green Gauge looks at five main categories: transportation, electricity, food, retail, and waste. Each one is assessed using emissions data to calculate your environmental impact.",
  },
  {
    question: "How accurate is the data used?",
    answer:
      "We use emission factors from verified databases and peer-reviewed research. Our backend is regularly updated to reflect the most accurate carbon metrics available.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Green Gauge uses a secure MySQL database and encrypted connections to store and manage your data responsibly.",
  },
  {
    question: "What makes Green Gauge different from other footprint calculators?",
    answer:
      "Green Gauge combines a modern, user-friendly design with personalized suggestions and habit tracking—features that are missing in many existing calculators.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes! Green Gauge allows you to view your footprint history and see how your habits improve or change over time in the Reports section.",
  },
  {
    question: "Do I need to create an account to use Green Gauge?",
    answer:
      "No account is needed to try out the calculator. However, creating an account allows you to save your data, track progress, and access past reports.",
  },
  {
    question: "How often should I update my data?",
    answer:
      "We recommend updating your data at least once a month to get the most accurate and meaningful results over time. Frequent updates give you better recommendations!",
  },
  {
    question: "What file types can I upload?",
    answer:
      "Currently, Green Gauge supports PDF uploads of bank or transaction statements. We’re working on supporting other formats in future updates.",
  },
  {
    question: "What do the ratings mean?",
    answer:
      "Your carbon score is compared against national averages to give you a rating. Lower scores mean your impact is lower, and the rating will reflect that positively!",
  },
  {
    question: "Can I use Green Gauge outside the U.S.?",
    answer:
      "Green Gauge currently uses emission factors based on U.S. data, but we’re working to add international support. You can still manually input values from other countries.",
  },
  {
    question: "Who created Green Gauge?",
    answer:
      "Green Gauge was created by a team of students from Montclair State University as part of a research initiative to bridge tech and environmental awareness.",
  },
];

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h1>

      <div className="mt-4 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div key={index} className="rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggle(index)}
                className="w-full text-left bg-base-200 text-lg font-medium p-4 rounded-t-xl"
              >
                {faq.question}
              </button>

              <div
                className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white border-[5px] border-t-0 border-base-200 rounded-b-xl px-4 py-6 flex items-center">
                  <div className="text-gray-800 w-full text-base space-y-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}