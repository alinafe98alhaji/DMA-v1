"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-teal-200 via-blue-500 to-indigo-800 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Logo */}
      <div className="w-60 h-20 mb-10 mt-2 flex justify-center">
        <Image
          src="/images/logo.svg" // Organisation logo
          alt="ESAWAS logo"
          width={240}
          height={200}
          priority
        />
      </div>

      {/* Main Content */}
      <main className="flex mb-28 mt-18 flex-col gap-4 items-center text-center bg-blue-200 bg-opacity-85 p-6 rounded-2xl shadow-2xl max-w-2xl w-full transform hover:scale-[1.01] duration-300 mb-30 mb-9">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-[Inter] font-bold tracking-tight text-blue-700 drop-shadow-md leading-tight mb-4">
          ESAWAS Data Maturity Assessment Tool
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-lg font-[Lato] mb-4">
          The trusted platform for evaluating and enhancing data maturity in the
          water and sanitation sectors for both national and organisational
          levels.
        </p>

        {/* Steps List */}
        <ol className="list-decimal list-inside text-base text-gray-600 max-w-lg space-y-2 text-left mt-4">
          <li>Get started by completing our comprehensive assessment.</li>
          <li>Save your progress and return whenever you need.</li>
          <li>Review insights and contribute to better service delivery.</li>
        </ol>
        <div> </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center mt-8">
          <a
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full py-3 px-8 font-semibold text-lg transition-transform transform hover:scale-105 shadow-lg"
            href="/basicDetails"
          >
            Start Assessment
          </a>
          <a
            className="bg-gray-100 border border-gray-300 text-gray-800 rounded-full py-3 px-8 font-semibold text-lg transition-transform transform hover:scale-105 shadow-md hover:bg-gray-200"
            href="/documentation"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Documentation
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center text-gray-200 mt-8 text-sm">
        <a
          className="flex items-center gap-2 hover:text-teal-200 transition-colors"
          href="https://www.esawas.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit ESAWAS Website →
        </a>
      </footer>
    </div>
  );
}
