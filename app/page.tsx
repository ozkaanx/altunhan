import { Header } from "@/components/shared/header";
import Hero from "@/components/shared/hero";
import Navbar from "@/components/shared/navbar";
import AboutExperience from "@/components/shared/experience";
import Accommodation from "@/components/shared/accommodation";
import LocationReviews from "@/components/shared/locationReviews";
import Footer from "@/components/shared/footer";



export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <main>
        <Hero />
        <AboutExperience />
        <Accommodation />
        <LocationReviews />
      </main>
      <Footer />
    </>
  );
}
