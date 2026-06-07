import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-12 text-slate-300">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-6 text-center">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-sm text-slate-400 leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        <p className="text-slate-300">
          Last Updated: June 7, 2026
        </p>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">1. Introduction</h2>
          <p>
            Welcome to Package Pal. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <a href="mailto:sagarkashyap.cc@gmail.com" className="text-sky-400 hover:underline">Email</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">2. Information We Collect</h2>
          <p className="mb-2">
            We collect information that you voluntarily provide to us when you perform package searches, input API keys, or contact us.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Package Search Queries:</strong> The queries, programming languages, and packages searched.</li>
            <li><strong>Gemini API Keys:</strong> If provided, API keys are processed entirely client-side inside your browser local storage or memory. They are never sent to or stored on our servers.</li>
            <li><strong>Log Files:</strong> Like most websites, we collect standard log files. These include IP addresses, browser type, Internet Service Provider (ISP), referring/exit pages, and number of clicks. This information is used for analyzing trends and system security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">3. Google AdSense & Third-Party Advertising Cookies</h2>
          <p className="mb-2">
            We display advertisements using Google AdSense. Google, as a third-party vendor, uses cookies to serve ads on our site.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">aboutads.info</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">4. Cookies and Web Beacons</h2>
          <p>
            Package Pal uses cookies to store information about visitors' preferences, to record user-specific information on which pages the user accesses or visits, and to personalize or customize our web page content based on visitors' browser type or other information that the visitor sends via their browser.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">5. How to Disable Cookies</h2>
          <p>
            You can choose to disable cookies through your individual browser options. More detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-2">6. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
