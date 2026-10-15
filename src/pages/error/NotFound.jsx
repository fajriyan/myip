import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Page } from "../../components/Layout";

const NotFound = () => {
  useEffect(() => {
    document.title = "Halaman tidak ditemukan | IPVIEW";
  }, []);

  return (
    <Page>
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-6xl flex-col items-start justify-center gap-4 px-4 py-24 sm:px-6">
        <span className="font-mono text-sm text-muted">404</span>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Halaman tidak ditemukan.
        </h1>
        <p className="max-w-[52ch] text-base leading-relaxed text-muted">
          Alamat yang kamu buka tidak ada di IPVIEW.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 active:translate-y-px"
        >
          Kembali ke beranda
        </Link>
      </div>
    </Page>
  );
};

export default NotFound;
