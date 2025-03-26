import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-white mt-2 mb-8">
        Terms of Service
      </h1>
      <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-2xl p-8 md:p-12">
        <section className="mb-8">
          <p className="text-gray-400 text-lg leading-relaxed">
            Welcome to Gyaanhub! By using our platform, you agree to the terms
            and conditions outlined below. Please read them carefully.
          </p>
        </section>

        {sections.map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {section.title}
            </h2>
            {section.content.map((text, i) => (
              <p
                key={i}
                className="text-gray-400 mb-4 text-lg leading-relaxed hyphens-auto"
              >
                {text}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 text-lg">
            If you have any questions, email us at:
            <a
              href="mailto:admin@gyaanhub.io"
              className="text-blue-400 hover:underline ml-1"
            >
              admin@gyaanhub.io
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "Using Gyaanhub",
    content: [
      "Ensure you use the content responsibly and adhere to our guidelines.",
      "Content is posted by Gyaanhub administrators and is intended for educational and informational purposes only.",
    ],
  },
  {
    title: "Content Ownership",
    content: [
      "All content on Gyaanhub is owned by Gyaanhub and its licensors. You may not copy, reproduce, or distribute content without prior permission.",
    ],
  },
  {
    title: "Prohibited Activities",
    content: [
      "Misusing content or distributing it without authorization.",
      "Engaging in harmful, offensive, or illegal activities.",
      "Attempting unauthorized access to the platform or its data.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We reserve the right to suspend or terminate access to the platform for violations of these terms or other policies.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Gyaanhub is provided 'as is' without warranties of any kind. We are not responsible for any damages arising from your use of the platform.",
    ],
  },
  {
    title: "Changes to These Terms",
    content: [
      "We may update these Terms of Service from time to time. Changes will be notified through our platform or email.",
    ],
  },
];

export default TermsOfService;
