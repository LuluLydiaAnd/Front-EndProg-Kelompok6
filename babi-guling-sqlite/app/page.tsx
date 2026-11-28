// import komponen yang digunakan di halaman utama
import Banner from "@/components/Banner";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";

// halaman utama website
export default function Home() {
  return (
    <>
      <Banner />
      <Gallery />
      <Faq />
      <Contact />
    </>
  );
}