import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useClientInfo, useIpGeolocation } from "../../hooks/global";
import { Page } from "../../components/Layout";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const dash = (x) => (x === undefined || x === null || x === "" ? "—" : x);

const Row = ({ label, children, mono = true }) => (
  <div className="flex items-baseline justify-between gap-6 py-3">
    <dt className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-muted">
      {label}
    </dt>
    <dd
      className={`text-right text-sm text-ink ${mono ? "font-mono" : ""} break-words`}
    >
      {children}
    </dd>
  </div>
);

const Spec = ({ label, children }) => (
  <div className="border-t border-line pt-3">
    <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
      {label}
    </div>
    <div className="mt-1 font-mono text-sm text-ink break-words">
      {children}
    </div>
  </div>
);

const Bone = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-line/70 ${className}`} />
);

const Section = ({ title, children, className = "" }) => (
  <section className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
    <h2 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);

const Home = () => {
  const { data, loading, error } = useIpGeolocation();
  const { data: client, loading: loadClient } = useClientInfo();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = data?.ip ? `IP ${data.ip} | IPVIEW` : "IPVIEW";
  }, [data?.ip]);

  const copy = () => {
    navigator.clipboard?.writeText(data.ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const carrier = data?.network?.carriers?.[0];
  const location = [
    data?.location?.city,
    data?.location?.principalSubdivision,
    data?.location?.countryName,
  ].filter(Boolean);

  const privacy = [
    {
      label: "Proxy / VPN",
      clean: !(data?.security?.isProxy || data?.security?.isVpn),
      value: data?.security?.isProxy
        ? "Proxy terdeteksi"
        : data?.security?.isVpn
          ? "VPN terdeteksi"
          : "Tidak terdeteksi",
    },
    {
      label: "Jaringan Tor",
      clean: !data?.security?.isTor,
      value: data?.security?.isTor ? "Aktif" : "Tidak aktif",
    },
    {
      label: "Anonimitas",
      clean: !data?.security?.isHosting,
      value: data?.security?.isHosting
        ? "IP server hosting"
        : "IP publik pengguna",
    },
  ];

  if (error) {
    return (
      <Page>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
          <h1 className="text-2xl font-medium tracking-tight">
            Gagal memuat data IP
          </h1>
          <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
            {error}. API mungkin sedang membatasi permintaan. Coba muat ulang
            halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 active:translate-y-px"
          >
            Muat ulang
          </button>
        </div>
      </Page>
    );
  }

  const busy = loading || loadClient;

  return (
    <Page>
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                IP publik Anda
              </span>
            </div>

            {busy ? (
              <>
                <Bone className="mt-5 h-12 w-full max-w-md sm:h-16" />
                <Bone className="mt-4 h-4 w-64" />
              </>
            ) : (
              <>
                <p className="rise mt-5 font-mono text-3xl leading-none tracking-tight text-ink sm:text-5xl lg:text-[4.25rem]">
                  {data?.ip}
                </p>
                <p className="rise rise-1 mt-4 text-sm text-muted">
                  {location.length
                    ? location.join(", ")
                    : "Lokasi tidak diketahui"}
                </p>
              </>
            )}

            <p className="rise rise-1 mt-6 max-w-[52ch] text-base leading-relaxed text-muted">
              Alamat IP, lokasi, dan operator yang sedang Anda gunakan, dibaca
              langsung dari browser.
            </p>

            <div className="rise rise-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/speed-test"
                className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 active:translate-y-px"
              >
                Speed test
              </Link>
              <button
                onClick={copy}
                disabled={busy || !data?.ip}
                className="rounded-xl border border-line px-5 py-3 text-sm text-ink transition-colors hover:bg-surface active:translate-y-px disabled:opacity-50"
              >
                {copied ? "Tersalin" : "Copy IP"}
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h3 className="text-sm font-medium text-ink">Jaringan</h3>
              <dl className="mt-2 divide-y divide-line">
                <Row label="Registry">{dash(data?.network?.registry)}</Row>
                <Row label="Organisasi">
                  {dash(data?.network?.organisation)}
                </Row>
                <Row label="BGP prefix">{dash(data?.network?.bgpPrefix)}</Row>
                <Row label="Rentang IP">
                  {dash(data?.network?.bgpPrefixNetworkAddress)} –{" "}
                  {dash(data?.network?.bgpPrefixLastAddress)}
                </Row>
                <Row label="Total alamat">
                  {dash(data?.network?.totalAddresses)}
                </Row>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-line">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {privacy.map((p) => (
            <div key={p.label} className="py-4 sm:px-6 sm:first:pl-0">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {p.label}
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-ink">
                <span
                  className={`size-1.5 rounded-full ${p.clean ? "bg-accent" : "bg-warn"}`}
                />
                {busy ? <Bone className="h-4 w-28" /> : p.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <div className="isolate overflow-hidden rounded-2xl border border-line">
            {busy ? (
              <Bone className="h-[320px] w-full rounded-none" />
            ) : data?.location?.latitude && data?.location?.longitude ? (
              <MapContainer
                center={[data.location.latitude, data.location.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-[320px] w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[data.location.latitude, data.location.longitude]}
                >
                  <Popup>
                    {[
                      data.location?.localityName,
                      data.location?.principalSubdivision,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-sm text-muted">
                Lokasi tidak tersedia
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-5">
          <h2 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
            Perangkat Anda
          </h2>
          <p className="mt-2 text-sm text-muted">
            Diperayai langsung dari user agent browser.
          </p>
          <dl className="mt-6 divide-y divide-line border-t border-line">
            {busy ? (
              <>
                <Row label="Perangkat">
                  <Bone className="ml-auto h-4 w-28" />
                </Row>
                <Row label="Sistem operasi">
                  <Bone className="ml-auto h-4 w-24" />
                </Row>
                <Row label="Browser">
                  <Bone className="ml-auto h-4 w-32" />
                </Row>
              </>
            ) : (
              <>
                <Row label="Perangkat" mono={false}>
                  {dash(client?.device)}
                </Row>
                <Row label="Sistem operasi" mono={false}>
                  {dash(client?.os)}
                </Row>
                <Row label="Browser">
                  {[client?.family, client?.versionMajor]
                    .filter(Boolean)
                    .join(" ")}
                </Row>
                <Row label="Seluler">{client?.isMobile ? "Ya" : "Tidak"}</Row>
              </>
            )}
          </dl>

          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
              User agent
            </div>
            {busy ? (
              <Bone className="mt-2 h-12 w-full" />
            ) : (
              <p className="mt-2 rounded-xl bg-surface p-3 font-mono text-xs leading-relaxed text-muted">
                {client?.userAgentRaw}
              </p>
            )}
          </div>

          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Bahasa
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {busy ? (
                <>
                  <Bone className="h-7 w-14" />
                  <Bone className="h-7 w-20" />
                </>
              ) : (
                client?.userLanguages?.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-xs text-ink"
                  >
                    {lang}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Section title="Operator Anda" className="pb-16 md:pb-24">
        {busy ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Spec key={i} label="—">
                <Bone className="h-4 w-24" />
              </Spec>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
            <Spec label="ASN">{dash(carrier?.asn)}</Spec>
            <Spec label="Nomor ASN">{dash(carrier?.asnNumeric)}</Spec>
            <Spec label="Organisasi">{dash(carrier?.organisation)}</Spec>
            <Spec label="Nama">{dash(carrier?.name)}</Spec>
            <Spec label="Registry">{dash(carrier?.registry)}</Spec>
            <Spec label="Negara">{dash(carrier?.registeredCountryName)}</Spec>
            <Spec label="Total IPv4">{dash(carrier?.totalIpv4Addresses)}</Spec>
            <Spec label="Peringkat">{dash(carrier?.rankText)}</Spec>
          </div>
        )}
      </Section>

      <section className="border-t border-line py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
            Jalur operator
          </h2>
          <p className="mt-2 text-sm text-muted">
            Rantai jaringan yang dilalui dari operator Anda ke server tujuan.
          </p>

          {busy ? (
            <div className="mt-6 flex gap-4 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <Bone key={i} className="h-36 w-64 shrink-0" />
              ))}
            </div>
          ) : data?.network?.viaCarriers?.length ? (
            <ul className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              {data.network.viaCarriers.map((hop, i) => (
                <li
                  key={`${hop.asn}-${i}`}
                  className="w-64 shrink-0 snap-start rounded-2xl border border-line bg-surface p-5"
                >
                  <div className="font-mono text-xs text-muted">
                    hop {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 font-mono text-lg text-ink">
                    {dash(hop.asn)}
                  </div>
                  <div className="mt-1 text-sm text-ink">{dash(hop.name)}</div>
                  <div className="mt-2 text-xs leading-relaxed text-muted">
                    {dash(hop.organisation)}
                  </div>
                  <div className="mt-3 border-t border-line pt-3 font-mono text-xs text-muted">
                    {dash(hop.registeredCountry)} · {dash(hop.rankText)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-muted">
              Jalur operator tidak dilaporkan untuk koneksi ini.
            </p>
          )}
        </div>
      </section>
    </Page>
  );
};

export default Home;
