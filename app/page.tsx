"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [stars, setStars] = useState<
    { top: number; left: number; duration: number }[]
  >([]);

  // Generate random stars for a parallax effect
  useEffect(() => {
    const starArray = Array.from({ length: 50 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 3
    }));
    setStars(starArray);
  }, []);

  return (
    <div className="landing-container">
      {/* Background Animated Stars */}
      <div className="stars">
        {stars.map((star, index) =>
          <div
            key={index}
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
          A web-based platform for assessing water supply and sanitation data
          systems maturity at national and organizational levels. It evaluates
          the data value pipeline, covering data collection, ownership, flow,
          quality, and use.
        </p>

        {/* Buttons Section */}
        <div className="button-container">
          <div
            className="assessment-card"
            onClick={() => router.push("/national-level/datacollection")}
          >
            <h2 className="assessment-title">🌍 National Level Assessment</h2>
            <p className="assessment-description">
              A tool used to map the national enabling environment for WSS data
              systems. It involves assessing policies, processes, and
              initiatives at the national level.
            </p>
          </div>

          <div
            className="assessment-card"
            onClick={() => router.push("/survey")}
          >
            <h2 className="assessment-title">
              🏢 Organizational Level Assessment
            </h2>
            <p className="assessment-description">
              A tool for organizations to evaluate national and internal data
              system environments, mapping internal tools, systems, and flows
              while assessing their effectiveness in practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
