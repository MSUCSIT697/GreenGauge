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
      </div>
    </div>
  );
}
