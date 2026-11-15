import Image from "next/image";

export default function Banner() {
  return (
    <section id="home" className="banner-section">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="banner-eyebrow">
              SEJAK RIBUAN TAHUN • WARISAN KULINER BALI
            </p>

            <h1 className="banner-title">
              Secicip Kelezatan
              <br />
              <em>Babi Guling</em>
            </h1>

            <p className="banner-lead">
              Hidangan tradisional Bali berupa babi muda utuh yang diisi bumbu <em>base genep</em>,
              lalu dipanggang sambil diputar di atas bara api hingga matang merata. Menjadi bagian
              dari upacara adat, ritual keagamaan, hingga perayaan besar masyarakat Bali.
            </p>
          </div>

          <div className="col-lg-5 text-center">
            <Image
              src="/Babi_Guling.png"
              alt="Ilustrasi Babi Guling"
              width={320}
              height={320}
              className="banner-img"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
