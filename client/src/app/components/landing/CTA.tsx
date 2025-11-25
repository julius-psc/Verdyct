import Image from "next/image";
import bg from "../../../../public/assets/illustrations/hero-bg.png";

export default function CTA() {
  return (
    <section className="w-full py-24 flex justify-center items-center">
      <div className="w-[90%] rounded-3xl px-16 py-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <Image
          src={bg}
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
        <div className="relative z-10">
          <h2 className="text-6xl font-bold text-white mb-8 tracking-tight">
            Validate. Predict. Launch.
          </h2>
          <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-base hover:bg-gray-50 transition-colors shadow-lg">
            Start building
          </button>
        </div>
      </div>
    </section>
  );
}
