import React from "react";
import sack from "../../assets/grain-sack.svg"; // you can use a placeholder or custom SVG icon

export default function About() {
  return (
    <div className="min-h-screen w-full bg-[#fff6e5] text-[#3d2e1e] px-6 py-20 font-['Nunito']">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-[#b0413e] leading-tight tracking-wide">
            Welcome to <span className="text-[#91c788]">Grainly</span>
          </h1>
          <p className="text-lg text-[#4a3b2a]">
            Grainly is your modern daalpasal — delivering pure, local, and lab-tested pulses, lentils and beans
            from Nepal’s fertile lands to your kitchen.
          </p>

          <div className="bg-[#fff] shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold text-[#3d2e1e] mb-2">📌 What Makes Us Different?</h2>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Direct-from-farm:</strong> No middlemen, fair pricing to farmers.</li>
              <li><strong>100% Lab-Tested:</strong> No chemicals. Just grains, naturally.</li>
              <li><strong>Hyperlocal Delivery:</strong> Freshly packed pulses at your door in 24hr.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={sack}
            alt="Grain sack illustration"
            className="w-64 md:w-80 animate-float"
          />
        </div>
      </div>

      {/* Values */}
      <div className="mt-24 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {[
          {
            title: "🌿 Sustainability",
            desc: "Sourced with care. Packed in biodegradable pouches.",
          },
          {
            title: "🫘 Variety",
            desc: "From Chana to Moong, we offer 20+ pulses under one platform.",
          },
          {
            title: "🧡 Transparency",
            desc: "We tell you where your dal came from. Literally.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-[#b0413e] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-700 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div className="mt-28 text-center">
        <h2 className="text-3xl font-bold text-[#4a3b2a] mb-4">🥣 Eat Clean. Cook Local. Trust Grainly.</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Whether you're making daal-bhaat, chana curry, or traditional soups — Grainly ensures
          your ingredients are authentic, clean, and full of nutrients. We’re not a store. We’re a grain movement.
        </p>
      </div>
    </div>
  );
}
