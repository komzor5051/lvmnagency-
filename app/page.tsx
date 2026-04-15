"use client";

import { useState } from "react";
import type { TabId } from "@/components/landing/PillSwitcher";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProofBar } from "@/components/landing/ProofBar";
import { BizPanel } from "@/components/landing/BizPanel";
import { EmpPanel } from "@/components/landing/EmpPanel";
import { CtaSection } from "@/components/landing/CtaSection";
import { ChatSection } from "@/components/landing/ChatSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabId>("biz");

  return (
    <>
      <LandingNav />
      <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />
      <ProofBar />
      {activeTab === "biz" ? <BizPanel /> : <EmpPanel />}
      <CtaSection activeTab={activeTab} />
      <ChatSection />
      <LandingFooter />
    </>
  );
}
