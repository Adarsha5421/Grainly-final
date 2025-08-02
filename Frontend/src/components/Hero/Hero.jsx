import React from "react";
import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#fdfaf5] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Grainly Lentils Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* Soft Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#fdfaf5]/90 to-transparent z-10" />

      {/* Right-Aligned Text */}
      <div className="relative z-20 flex justify-end items-start h-full px-6 sm:px-10 md:px-20 mt-[2.5in]">
        <div className="max-w-xl text-right space-y-5 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#5C3A1E] leading-tight tracking-tight">
            Nourish Naturally.
            <br />
            Choose Grainly.
          </h1>
          <p className="text-lg md:text-xl text-[#8C6E54] font-light leading-relaxed">
            Handpicked lentils, beans, and pulses from Nepal’s finest farms to your kitchen. <br className="hidden md:block" />
            Purity, delivered with care.
          </p>
        </div>
      </div>
    </div>
  );
}
