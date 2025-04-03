import React from "react";

export default function FAQs() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h1>

      <div className="mt-4 space-y-4">
        {/* FAQ 1 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" defaultChecked /> 
          <div className="collapse-title text-lg font-medium">
            What is Green Gauge?
          </div>
          <div className="collapse-content">
            <p>Green Gauge helps you track and analyze your carbon footprint by using your financial data or manually entering your expenses.</p>
          </div>
        </div>

        {/* FAQ 2 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            How does Green Gauge calculate my footprint?
          </div>
          <div className="collapse-content">
            <p>We use industry-standard carbon emission factors to estimate your environmental impact based on your spending habits.</p>
          </div>
        </div>

        {/* FAQ 3 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Can I manually enter my data?
          </div>
          <div className="collapse-content">
            <p>Yes! You can either upload a PDF of your transactions or use our manual calculator to input your expenses.</p>
          </div>
        </div>

        {/* FAQ 4 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Where can I see my past reports?
          </div>
          <div className="collapse-content">
            <p>All your past calculations and uploads are stored in the <strong>Reports</strong> section, where you can view detailed results.</p>
          </div>
        </div>

        {/* FAQ 5 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            What can I do to reduce my footprint?
          </div>
          <div className="collapse-content">
            <p>We provide personalized sustainability goals based on your footprint, such as reducing meat consumption, carpooling, and supporting eco-friendly brands.</p>
          </div>
        </div>

        {/* FAQ 6 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            What categories does Green Gauge analyze?
          </div>
          <div className="collapse-content">
            <p>Green Gauge looks at five main categories: transportation, electricity, food, retail, and waste. Each one is assessed using emissions data to calculate your environmental impact.</p>
          </div>
        </div>

        {/* FAQ 7 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            How accurate is the data used?
          </div>
          <div className="collapse-content">
            <p>We use emission factors from verified databases and peer-reviewed research. Our backend is regularly updated to reflect the most accurate carbon metrics available.</p>
          </div>
        </div>

        {/* FAQ 8 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Is my data safe?
          </div>
          <div className="collapse-content">
            <p>Yes. Green Gauge uses a secure MySQL database and encrypted connections to store and manage your data responsibly.</p>
          </div>
        </div>

        {/* FAQ 9 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            What makes Green Gauge different from other footprint calculators?
          </div>
          <div className="collapse-content">
            <p>Green Gauge combines a modern, user-friendly design with personalized suggestions and habit tracking—features that are missing in many existing calculators.</p>
          </div>
        </div>

        {/* FAQ 10 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Can I track my progress over time?
          </div>
          <div className="collapse-content">
            <p>Yes! Green Gauge allows you to view your footprint history and see how your habits improve or change over time in the Reports section.</p>
          </div>
        </div>

        {/* FAQ 11 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Do I need to create an account to use Green Gauge?
          </div>
          <div className="collapse-content">
            <p>No account is needed to try out the calculator. However, creating an account allows you to save your data, track progress, and access past reports.</p>
          </div>
        </div>

        {/* FAQ 12 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            How often should I update my data?
          </div>
          <div className="collapse-content">
            <p>We recommend updating your data at least once a month to get the most accurate and meaningful results over time. Frequent updates give you better recommendations!</p>
          </div>
        </div>

        {/* FAQ 13 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            What file types can I upload?
          </div>
          <div className="collapse-content">
            <p>Currently, Green Gauge supports PDF uploads of bank or transaction statements. We’re working on supporting other formats in future updates.</p>
          </div>
        </div>

        {/* FAQ 14 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            What do the ratings mean?
          </div>
          <div className="collapse-content">
            <p>Your carbon score is compared against national averages to give you a rating. Lower scores mean your impact is lower, and the rating will reflect that positively!</p>
          </div>
        </div>

        {/* FAQ 15 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Can I use Green Gauge outside the U.S.?
          </div>
          <div className="collapse-content">
            <p>Green Gauge currently uses emission factors based on U.S. data, but we’re working to add international support. You can still manually input values from other countries.</p>
          </div>
        </div>

        {/* FAQ 16 */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" /> 
          <div className="collapse-title text-lg font-medium">
            Who created Green Gauge?
          </div>
          <div className="collapse-content">
            <p>Green Gauge was created by a team of students from Montclair State University as part of a research initiative to bridge tech and environmental awareness.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
