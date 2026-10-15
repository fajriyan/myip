import { Link } from "react-router-dom";

export const Header = () => (
  <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
      <Link to="/" className="font-mono text-sm tracking-tight text-ink">
        IPVIEW
      </Link>
      <div className="flex items-center gap-1">
        <Link
          to="/speed-test"
          className="rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink active:translate-y-px"
        >
          Speed test
        </Link>
        <a
          href="https://github.com/fajriyan/myip"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-ink active:translate-y-px"
        >
          GitHub
        </a>
      </div>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>IPVIEW — data lokasi dari BigDataCloud.</span>
      <a
        href="https://github.com/fajriyan/myip"
        target="_blank"
        rel="noreferrer"
        className="transition-colors hover:text-ink"
      >
        github.com/fajriyan/myip
      </a>
    </div>
  </footer>
);

export const Page = ({ children }) => (
  <div className="min-h-dvh bg-bg text-ink">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);
