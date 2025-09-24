"use client";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";

export default function PropertyForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the captcha before submitting.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/submitForm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, captcha: captchaToken }),
    });

    if (res.ok) {
      router.push(
        `/form/confirmation?name=${encodeURIComponent(
          formData.name
        )}&address=${encodeURIComponent(formData.address)}`
      );
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 py-10">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-300"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Property Intake Form
        </h2>

        {/* Seller Info */}
        <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900 mb-2">
            Seller Information (Required)
        </legend>
        <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
            type="text"
            name="address"
            placeholder="Property Address"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <label className="block text-gray-700">
            Upload Property Photos
            <input
            type="file"
            name="photo"
            multiple
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-600"
            />
        </label>
        </fieldset>

        {/* Appraisal Questions */}
        <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900 mb-2">
            Key Appraisal Questions
        </legend>

        <div>
            <label className="block text-gray-700 mb-1">Age of Roof</label>
            <select
            name="roof_age"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Less than 5 years</option>
            <option>5–10 years</option>
            <option>10–20 years</option>
            <option>Over 20 years / Don’t know</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">Any foundational issues?</label>
            <select
            name="foundation"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">Electrical Issues?</label>
            <select
            name="electrical"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">Plumbing Status</label>
            <select
            name="plumbing"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>No issues</option>
            <option>Leaks / water damage</option>
            <option>Old pipes (lead, etc.)</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">
            HVAC (Heating/Cooling) System Condition
            </label>
            <select
            name="hvac"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Less than 5 years</option>
            <option>5–10 years</option>
            <option>10–20 years</option>
            <option>Over 20 years / Don’t know</option>
            <option>Not working properly</option>
            </select>
        </div>

        <div>
            <label className="block text-gray-700 mb-1">
            Any recent renovations or upgrades?
            </label>
            <textarea
            name="renovations"
            placeholder="Describe any upgrades (e.g., kitchen remodel, new floors)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-3 gap-4">
            <input
            type="number"
            name="sqft"
            placeholder="Square Footage"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
            type="number"
            name="beds"
            placeholder="Bedrooms"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
            type="number"
            name="baths"
            placeholder="Bathrooms"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
        </div>

        <div>
            <label className="block text-gray-700 mb-1">Occupancy Status</label>
            <select
            name="occupancy"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Owner-occupied</option>
            <option>Tenant</option>
            <option>Vacant</option>
            </select>
        </div>
        </fieldset>

        {/* Ownership & Debt */}
        <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900 mb-2">
            Ownership & Financial Situation
        </legend>
        <div>
            <label className="block text-gray-700 mb-1">
            Any money owed on the property?
            </label>
            <select
            name="money_owed"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <input
            type="number"
            name="owed_taxes"
            placeholder="Taxes Owed ($)"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
            type="number"
            name="owed_liens"
            placeholder="Liens Owed ($)"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
            type="number"
            name="owed_mortgage"
            placeholder="Mortgage Balance ($)"
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
        </div>
        </fieldset>

        {/* Optional Fields */}
        <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900 mb-2">
            Optional Information
        </legend>
        <input
            type="number"
            name="asking_price"
            placeholder="Asking Price ($)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
            type="text"
            name="timeline"
            placeholder="Timeline to Sell (e.g., ASAP, 3 months)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        </fieldset>


        {/* Captcha */}
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={!captchaToken}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              captchaToken
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Submit Property
          </button>
        </div>
      </form>

      {/* ✅ Loading Popup with Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Please wait...
              </h2>
              <p className="text-gray-600">
                System is processing your submission.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
