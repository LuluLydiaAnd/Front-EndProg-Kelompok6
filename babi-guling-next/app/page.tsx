import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Gallery />
      <Faq />
      <Contact />
    </>
  );
}