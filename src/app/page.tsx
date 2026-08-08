import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";
import UpcomingEvents from "../components/UpcomingEvents";
import MembershipBenefits from "../components/MembershipBenefits";
import PerformSection from "../components/PerformSection";
import Founder from "../components/Founder";
import CommunitySection from "@/components/CommunitySection";
import Sponsors from "../components/Sponsors";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyUs />
      <UpcomingEvents />
      <MembershipBenefits />
      <CommunitySection />
      <PerformSection />
      <Founder />
      <Sponsors />
      <Feedback />
      <Footer />
    </>
  );
}