"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmationContent() {
  const params = useSearchParams();
  const name = params.get("name") || "Seller";
  const address = params.get("address") || "your property";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Submission Received 🎉
        </h1>
        <p className="text-gray-700">
          Thanks <span className="font-semibold">{name}</span>, we are
          evaluating your property at{" "}
          <span className="font-semibold">{address}</span>. Our team will review
          your submission and get in touch with you shortly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
