// import komponen image dari next.js
import Image from "next/image";

// tipe data untuk tombol navigasi pada banner
type Widget = {
  label: string;
  href: string;
  icon: string;
  highlight?: boolean;
};

// daftar tombol yang ditampilkan pada banner
const widgets: Widget[] = [
  { label: "FAQ", href: "#faq", icon: "bx bx-help-circle" },
  { label: "Contact", href: "#kontak", icon: "bx bx-envelope", highlight: true },
];

// komponen banner sebagai bagian pembuka halaman utama
export default function Banner() {
  return (
    <section id="home" className="banner-section">
      <div className="container">
        <div className="row align-items-center g-4">
          {/* menampilkan teks pengenalan babi guling */}
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
              Hidangan tradisional Bali berupa babi muda utuh yang diisi bumbu{" "}
              <em>base genep</em>, lalu dipanggang sambil diputar di atas bara
              api hingga matang merata. Menjadi bagian dari upacara adat,
              ritual keagamaan, hingga perayaan besar masyarakat Bali.
            </p>

            {/* menampilkan tombol navigasi ke faq dan kontak */}
            <div className="banner-widgets">
              {widgets.map((w) => (
                <a
                  key={w.label}
                  href={w.href}
                  className={
                    "widget-btn" +
                    (w.highlight ? " widget-highlight" : "")
                  }
                >
                  <i className={w.icon}></i> {w.label}
                </a>
              ))}
            </div>
          </div>

          {/* menampilkan ilustrasi babi guling di sisi banner */}
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