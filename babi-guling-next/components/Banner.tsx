import Image from "next/image";

type Widget = {
  label: string;
  href: string;
  icon: string;
  highlight?: boolean;
};

const widgets: Widget[] = [
  { label: "Galeri Foto", href: "#galeri", icon: "bx bx-image-alt" },
  { label: "Info & Resep", href: "#tabNav", icon: "bx bx-book-open" },
  { label: "Artikel & Info", href: "#postingan", icon: "bx bx-news" },
  { label: "Resto Favorit", href: "#resto", icon: "bx bxs-store-alt", highlight: true },
];

export default function Banner() {
  return (
    <section id="home" className="banner-section">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="banner-eyebrow">SEJAK RIBUAN TAHUN • WARISAN KULINER BALI</p>
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

            <div className="banner-widgets">
              {widgets.map((w) => (
                <a
                  key={w.label}
                  href={w.href}
                  className={"widget-btn" + (w.highlight ? " widget-highlight" : "")}
                >
                  <i className={w.icon}></i> {w.label}
                </a>
              ))}
            </div>
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
