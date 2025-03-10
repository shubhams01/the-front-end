import React from "react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-6">
        <h2 className="text-2xl text-center font-semibold text-gray-200 mb-4">
          Terms of Service
        </h2>
        <p className="text-gray-400">
          Welcome to Gyaanhub! By using our platform, you agree to the terms and
          conditions outlined below. Please read them carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Using Gyaanhub
        </h2>
        <ul className="list-disc pl-5 text-gray-400">
          <li>
            Ensure you use the content responsibly and adhere to our guidelines.
          </li>
          <li>
            Content is posted by Gyaanhub administrators and is intended for
            educational and informational purposes only.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Content Ownership
        </h2>
        <p className="text-gray-400">
          All content on Gyaanhub is owned by Gyaanhub and its licensors. You
          may not copy, reproduce, or distribute content without prior
          permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Prohibited Activities
        </h2>
        <ul className="list-disc pl-5 text-gray-400">
          <li>Misusing content or distributing it without authorization.</li>
          <li>Engaging in harmful, offensive, or illegal activities.</li>
          <li>Attempting unauthorized access to the platform or its data.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Termination
        </h2>
        <p className="text-gray-400">
          We reserve the right to suspend or terminate access to the platform
          for violations of these terms or other policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Limitation of Liability
        </h2>
        <p className="text-gray-400">
          Gyaanhub is provided "as is" without warranties of any kind. We are
          not responsible for any damages arising from your use of the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Changes to These Terms
        </h2>
        <p className="text-gray-400">
          We may update these Terms of Service from time to time. Changes will
          be notified through our platform or email.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-200 mb-2">
          Contact Us
        </h2>
        <p className="text-gray-400">
          If you have any questions, email us at:
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

export default TermsOfService;
