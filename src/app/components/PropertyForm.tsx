// /src/app/form/page.tsx
"use client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";

export default function PropertyForm() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const recaptchaRef = useRef<ReCAPTCHA>(null); // ⬅ Disabled temporarily
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

  // ✅ Require captcha before submitting
  if (!captchaToken) {
    alert("Please complete the captcha before submitting.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/submitForm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, captcha: captchaToken }),
    });

    if (res.ok) {
      router.push(
        `/form/confirmation?name=${encodeURIComponent(
          formData.name
        )}&address=${encodeURIComponent(formData.address || "")}`
      );
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
      setLoading(false);
    }
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Something went wrong. Please try again.");
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen bg-[#001429] py-10">
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          />

          <input
            type="text"
            name="address"
            placeholder="Address (House Number, Street)"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          />

          <input
            type="text"
            name="apartment"
            placeholder="Apartment / Suite (Optional)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
            />
          </div>

          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-500"
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

        {/* Key Appraisal Questions */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-900 mb-2">
            Key Appraisal Questions
          </legend>

          <label className="block text-gray-700 mb-1">Age of Roof</label>
          <select
            name="roof_age"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Less than 5 years</option>
            <option>5–10 years</option>
            <option>10–20 years</option>
            <option>Over 20 years / Don’t know</option>
          </select>

          <label className="block text-gray-700 mb-1">Sewer Type</label>
          <select
            name="sewer_type"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Public Sewer</option>
            <option>On-lot Sewage</option>
          </select>

          <label className="block text-gray-700 mb-1"> 
            Any foundational issues? (describe)
          </label>
          <textarea
            name="foundation"
            placeholder="Describe any foundational issues"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />


            <label className="block text-gray-700 mb-1">
            Electrical Issues? (describe)
            </label>
            <textarea
            name="electrical"
            placeholder="Describe any electrical issues"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            />

          <label className="block text-gray-700 mb-1">
            Plumbing condition? (describe)
          </label>
          <textarea
            name="plumbing_condition"
            placeholder="Plumbing Condition description"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="block text-gray-700 mb-1">
            Heating Fuel & Type
          </label>
          <select
            name="heating_fuel"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Oil Heat</option>
            <option>Gas Heat</option>
            <option>Coal Heat</option>
            <option>Electric Heat</option>
            <option>Heat Pump</option>
            <option>Geothermal Heat</option>
            <option>none</option> {/*new*/}
          </select>

          <label className="block text-gray-700 mb-1">
            Cooling Fuel & Type
          </label>
          <select
            name="cooling_fuel"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Window units</option>
            <option>Central Air</option>
            <option>Mini Splits</option>
            <option>Geothermal Cooling</option>
            <option>none</option> {/*new*/}
          </select>

            <label className="block text-gray-700 mb-1">
            Describe any recent renovations or upgrades
            </label>
          <textarea
            name="renovations"
            placeholder="Describe recent renovations or upgrades"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

            <label className="block text-gray-700 mb-1">
            Enter the property size in sqft
            </label>
          <input
            type="number"
            name="sqft"
            placeholder="Square Footage"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
           <label className="block text-gray-700 mb-1">
            Enter the property's acreage
            </label>
          <input /*new*/
            type="number"
            name="acreage"
            placeholder="property size in acres"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
            <label className="block text-gray-700 mb-1">
            Describe the plumbing condition
            </label>
          <textarea 
            name="plumbing_condition"
            placeholder="Plumbing Condition description"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

            <label className="block text-gray-700 mb-1">
            Enter the number of bedrooms
            </label>
          <input
            type="number"
            name="beds"
            placeholder="Bedrooms"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

            <label className="block text-gray-700 mb-1">
            Enter the number of Bathrooms (e.g., 1.5)
            </label>
          <input
            type="number"
            step="0.5"
            name="baths"
            placeholder="Bathrooms (e.g., 1.5)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
             <label className="block text-gray-700 mb-1">
             Year Built
            </label>
           <input /*new*/
            type="number"
            name="yearbuilt"
            placeholder="year built"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

            <label className="block text-gray-700 mb-1">
            How many floors, basement, attic etc
            </label>
          <input
            type="text"
            name="number_of_floors"
            placeholder="Number of Floors"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="block text-gray-700 mb-1">Occupancy Status</label>
          <select
            name="occupancy"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Owner-occupied</option>
            <option>Tenant</option>
            <option>Vacant</option>
          </select>
        </fieldset>

        {/* Financial Section */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-900 mb-2">
            Financial Information
          </legend>

          <label className="block text-gray-700 mb-1">
            Any money owed on the property?
          </label>
          <select
            name="money_owed"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <input
            type="number"
            name="owed_taxes"
            placeholder="Taxes Owed ($)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="number"
            name="owed_liens"
            placeholder="Liens Owed ($)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="number"
            name="owed_mortgage"
            placeholder="Mortgage Balance ($)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="text"
            name="timeline"
            placeholder="Timeline to Sell (e.g., ASAP, 3 months)"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </fieldset>

        {/* Google reCAPTCHA */}
        <div className="flex justify-center">
        <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} 
            onChange={(token) => setCaptchaToken(token)}
        />
        </div>


        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading} // Only disabled while submitting
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              !loading
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
