"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [stars, setStars] = useState<number[]>([]);

  // Generate random stars for a parallax effect
  useEffect(() => {
    const starArray = Array.from({ length: 50 }, (_, i) => i);
    setStars(starArray);
  }, []);

  return (
    <div className="landing-container">
      {/* Background Animated Stars */}
      <div className="stars">
        {stars.map(star =>
          <div
            key={star}
            className="star"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="glass-card">
        <h1 className="landing-title">Choose Your Assessment</h1>
        <p className="landing-subtitle">
          A futuristic approach to water sector evaluation
        </p>

        {/* Buttons */}
        <div className="button-container">
          <button
            className="neon-button"
            onClick={() => router.push("/national-level/datacollection")}
          >
            🌍 National Level Assessment
          </button>
          <button
            className="neon-button"
            onClick={() => router.push("/survey")}
          >
            🏢 Organizational Level Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
