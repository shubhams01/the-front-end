import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h- w-dvw bg-gray-900 text-gray-300 flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-white mt-2 mb-8">
        Privacy Policy
      </h1>
      <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-2xl p-8 md:p-12">
        <section className="mb-8">
          <p className="text-gray-400 text-lg leading-relaxed">
            Welcome to Gyaanhub! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform. By accessing or using Gyaanhub, you agree to the practices described in this Privacy Policy.
          </p>
        </section>

        {sections.map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {section.title}
            </h2>
            {section.content.map((text, i) => (
              <p key={i} className="text-gray-400 mb-4 text-lg leading-relaxed hyphens-auto">
                {text}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 text-lg">
            If you have any questions, email us at:
            <a href="mailto:admin@gyaanhub.io" className="text-blue-400 hover:underline ml-1">
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
    title: "Information We Collect",
    content: [
      "We collect information you provide to us, such as name, email, and account details.",
      "We also collect data automatically, including device information, IP address, and usage analytics."
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and improve our platform.",
      "To communicate with you about updates, features, and promotions.",
      "To ensure the security of our platform."
    ]
  },
  {
    title: "Sharing Your Information",
    content: [
      "We do not sell your personal information.",
      "We may share your information with service providers and legal authorities when required."
    ]
  },
  {
    title: "Your Rights",
    content: [
      "You can access, correct, or delete your personal information.",
      "You may opt-out of marketing communications.",
      "You can request data portability where applicable."
    ]
  },
  {
    title: "Data Security",
    content: [
      "We implement robust security measures to protect your data.",
      "However, no system is completely secure, and we cannot guarantee absolute security."
    ]
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      "Changes will be notified through our platform or email."
    ]
  }
];

export default PrivacyPolicy;