import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-6">
        <h2 className="text-2xl text-center font-semibold text-gray-200 mb-4">
          Privacy Policy
        </h2>
        <p className="text-gray-400">
          Welcome to GyaanHub! Your privacy is important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our knowledge-sharing platform. By accessing
          or using GyaanHub, you agree to the practices described in this
          Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Information We Collect
        </h2>
        <h3 className="text-xl font-medium text-gray-200 mt-4">
          1. Information You Provide to Us
        </h3>
        <ul className="list-disc pl-5 text-gray-400">
          <li>
            <strong>Account Information:</strong> When you sign up, we collect
            your name, email address, and other details you provide.
          </li>
          <li>
            <strong>Content Submissions:</strong> Any articles, comments, or
            other content you share.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-gray-200 mt-4">
          2. Information We Collect Automatically
        </h3>
        <ul className="list-disc pl-5 text-gray-400">
          <li>
            <strong>Device Information:</strong> Includes IP address, browser
            type, and operating system.
          </li>
          <li>
            <strong>Usage Data:</strong> Details about how you use GyaanHub,
            such as pages viewed and actions taken.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-gray-200 mt-4">
          3. Cookies and Tracking Technologies
        </h3>
        <p className="text-gray-400">
          We use cookies to improve your experience and analyze usage patterns.
          You can control cookies through your browser settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc pl-5 text-gray-400">
          <li>To provide and improve our platform.</li>
          <li>
            To communicate with you about updates, features, and promotions.
          </li>
          <li>To ensure the security of our platform.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Sharing Your Information
        </h2>
        <p className="text-gray-400">
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul className="list-disc pl-5 text-gray-400">
          <li>
            <strong>Service Providers:</strong> Third parties that help us
            operate GyaanHub.
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required by law or to
            protect our platform.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Your Rights
        </h2>
        <ul className="list-disc pl-5 text-gray-400">
          <li>Access, correct, or delete your personal information.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Request data portability where applicable.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Data Security
        </h2>
        <p className="text-gray-400">
          We implement robust security measures to protect your data. However,
          no system is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Changes to This Policy
        </h2>
        <p className="text-gray-400">
          We may update this Privacy Policy from time to time. Changes will be
          notified through our platform or email.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Contact Us
        </h2>
        <p className="text-gray-400">
          If you have any questions, email us at:{" "}
          <a
            href="mailto:admin@gyaanhub.io"
            className="text-blue-400 hover:underline"
          >
            admin@gyaanhub.io
          </a>
        </p>
      </section>
    </div>
  );
};

export default page;
