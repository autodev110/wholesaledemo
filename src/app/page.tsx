"use client";
import { useRouter } from "next/navigation";
import Card from "./components/Card";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl font-bold">Wanting to sell? Get a free quote.</h1>
        <button
          className="mt-6 px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold"
          onClick={() => router.push("/form")}
        >
          Click Here
        </button>
      </section>

      <div className="grid gap-6 py-12 max-w-3xl mx-auto">
        <Card title="Who We Are" text="Experienced wholesalers helping sellers move fast." />
        <Card title="Mission" text="Fair offers, quick closings, stress-free process." />
        <Card title="Testimonials" text="‘They closed in 14 days, amazing experience!’ – Sarah J." />
      </div>
    </div>
  );
}
