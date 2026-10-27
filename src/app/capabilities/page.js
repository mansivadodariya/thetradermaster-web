import React from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import Capabilities from "@/rendering/home/capabilities";
import BreakoutDetection from "@/rendering/home/breakoutDetection";
import AiAnalyst from "@/rendering/home/aiAnalyst";

export const metadata = {
  title: "Platform Capabilities | ChronosX",
  description: "Explore the ChronosX 4-tool trading cockpit, real-time breakout detection, and live AI market analysis.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', paddingTop: '60px' }}>
        <Capabilities />
        <BreakoutDetection />
        <AiAnalyst />
      </main>
      <Footer />
    </>
  );
}
