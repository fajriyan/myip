import { useEffect, useRef, useState } from "react";
import { Page } from "../../components/Layout";

const DOWNLOAD_URL = "/testfiles/5MB.bin";
const UPLOAD_URL = "https://postman-echo.com/post";
const UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const steps = [
  "Klik tombol Start test",
  "Unduhan diukur dari file uji 5 MB",
  "Unggahan diproses lewat request POST ke endpoint echo",
];

const formatValue = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toFixed(2);
  return value;
};

const formatResultTimestamp = (isoString) => {
  if (!isoString) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
};

const buildResultPayload = ({
  downloadSpeed,
  uploadSpeed,
  latency,
  status,
  completedAt,
}) => ({
  app: "IPV Speed Test",
  status,
  completedAt: completedAt ?? new Date().toISOString(),
  metrics: {
    downloadMbps: downloadSpeed,
    uploadMbps: uploadSpeed,
    latencyMs: latency,
  },
});

const buildResultText = (payload) =>
  [
    "IPV Speed Test Result",
    `Completed: ${formatResultTimestamp(payload.completedAt)}`,
    `Status: ${payload.status || "—"}`,
    `Download: ${formatValue(payload.metrics.downloadMbps)} Mbps`,
    `Upload: ${formatValue(payload.metrics.uploadMbps)} Mbps`,
    `Latency: ${formatValue(payload.metrics.latencyMs)} ms`,
  ].join("\n");

const downloadTextFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

const createUploadBlob = (sizeBytes) => {
  const chunk = new Uint8Array(64 * 1024);
  for (let i = 0; i < chunk.length; i += 1) {
    chunk[i] = i % 251;
  }

  const parts = [];
  let remaining = sizeBytes;

  while (remaining > 0) {
    const sliceSize = Math.min(chunk.length, remaining);
    parts.push(chunk.subarray(0, sliceSize));
    remaining -= sliceSize;
  }

  return new Blob(parts, { type: "application/octet-stream" });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pingTest = async (signal) => {
  const startedAt = performance.now();

  try {
    const response = await fetch(`${DOWNLOAD_URL}?ping=${Date.now()}`, {
      cache: "no-store",
      method: "HEAD",
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      const response = await fetch(`${DOWNLOAD_URL}?ping=${Date.now()}`, {
        cache: "no-store",
        signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (response.body) {
        await response.body.cancel().catch(() => {});
      } else {
        await response.arrayBuffer();
      }
    } else {
      throw error;
    }
  }

  return performance.now() - startedAt;
};

const downloadTest = async (onProgress, signal) => {
  const startedAt = performance.now();
  const response = await fetch(`${DOWNLOAD_URL}?download=${Date.now()}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const totalBytesHeader = response.headers.get("content-length");
  const totalBytes = totalBytesHeader ? Number(totalBytesHeader) : null;

  if (!response.body) {
    const buffer = await response.arrayBuffer();
    const elapsed = (performance.now() - startedAt) / 1000;
    return (buffer.byteLength * 8) / elapsed / (1024 * 1024);
  }

  const reader = response.body.getReader();
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;

    if (totalBytes && typeof onProgress === "function") {
      onProgress(Math.min(100, Math.round((received / totalBytes) * 100)));
    }
  }

  const elapsed = (performance.now() - startedAt) / 1000;
  return (received * 8) / elapsed / (1024 * 1024);
};

const SpeedTestPage = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [latency, setLatency] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("Siap menjalankan test.");
  const [isTesting, setIsTesting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [completedAt, setCompletedAt] = useState(null);

  const downloadAbortRef = useRef(null);
  const uploadAbortRef = useRef(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    return () => {
      downloadAbortRef.current?.abort();
      uploadAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    document.title = "Speed Test | IPV";
  }, []);

  const reset = () => {
    downloadAbortRef.current?.abort();
    uploadAbortRef.current?.abort();
    downloadAbortRef.current = null;
    uploadAbortRef.current = null;
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setLatency(null);
    setDownloadProgress(0);
    setUploadProgress(0);
    setStatus("Siap menjalankan test.");
    setIsTesting(false);
    setLastUpdated("");
    setCompletedAt(null);
  };

  const runFullTest = async () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    downloadAbortRef.current?.abort();
    uploadAbortRef.current?.abort();

    const downloadController = new AbortController();
    const uploadController = new AbortController();
    downloadAbortRef.current = downloadController;
    uploadAbortRef.current = uploadController;

    setIsTesting(true);
    setStatus("Menjalankan latency test...");
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setLatency(null);
    setDownloadProgress(0);
    setUploadProgress(0);
    setLastUpdated("");
    setCompletedAt(null);

    try {
      const pings = [];
      for (let i = 0; i < 3; i += 1) {
        pings.push(await pingTest(downloadController.signal));
        if (runIdRef.current !== runId) return;
        await wait(120);
      }

      const avgLatency =
        pings.reduce((sum, item) => sum + item, 0) / pings.length;
      setLatency(avgLatency);

      setStatus("Mengukur download...");
      const downloadMbps = await downloadTest((progress) => {
        if (runIdRef.current === runId) setDownloadProgress(progress);
      }, downloadController.signal);

      if (runIdRef.current !== runId) return;
      setDownloadSpeed(downloadMbps);
      setDownloadProgress(100);

      await wait(180);

      setStatus("Mengukur upload...");
      const startedAt = performance.now();
      const uploadMbps = await new Promise((resolve, reject) => {
        const blob = createUploadBlob(UPLOAD_SIZE_BYTES);
        const xhr = new XMLHttpRequest();

        xhr.open("POST", UPLOAD_URL, true);
        xhr.timeout = 20000;

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const percent = Math.round((event.loaded / event.total) * 100);
          const elapsed = (performance.now() - startedAt) / 1000;
          const mbps =
            elapsed > 0 ? (event.loaded * 8) / elapsed / (1024 * 1024) : null;

          if (runIdRef.current === runId) {
            setUploadProgress(percent);
            if (Number.isFinite(mbps)) {
              setUploadSpeed(mbps);
            }
          }
        };

        xhr.onload = () => {
          const elapsed = (performance.now() - startedAt) / 1000;
          if (xhr.status >= 200 && xhr.status < 300 && elapsed > 0) {
            resolve((blob.size * 8) / elapsed / (1024 * 1024));
            return;
          }
          reject(new Error(`HTTP ${xhr.status}`));
        };

        xhr.onerror = () => reject(new Error("Network / CORS error"));
        xhr.ontimeout = () => reject(new Error("Timeout"));

        uploadController.signal.addEventListener("abort", () => xhr.abort(), {
          once: true,
        });

        xhr.send(blob);
      });

      if (runIdRef.current !== runId) return;
      setUploadSpeed(uploadMbps);
      setUploadProgress(100);
      setStatus("Test selesai.");
      setLastUpdated(new Date().toLocaleTimeString("id-ID"));
    } catch (error) {
      if (error?.name === "AbortError") {
        setStatus("Test dibatalkan.");
      } else {
        setStatus(
          error?.message
            ? `Gagal: ${error.message}`
            : "Gagal menjalankan test.",
        );
      }
    } finally {
      if (runIdRef.current === runId) {
        setIsTesting(false);
      }
    }
  };

  const stopTest = () => {
    downloadAbortRef.current?.abort();
    uploadAbortRef.current?.abort();
    setStatus("Test dihentikan.");
    setIsTesting(false);
  };

  const getResultPayload = () =>
    buildResultPayload({
      downloadSpeed,
      uploadSpeed,
      latency,
      status,
      completedAt,
    });

  const getResultFilename = (payload) => {
    const stamp = payload.completedAt
      ? new Date(payload.completedAt).toISOString().replace(/[:.]/g, "-")
      : "result";

    return `ipv-speed-test-${stamp}.json`;
  };

  const copyResult = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setStatus("Clipboard tidak tersedia di browser ini.");
      return;
    }

    const payload = getResultPayload();

    try {
      await navigator.clipboard.writeText(buildResultText(payload));
      setStatus("Hasil disalin ke clipboard.");
    } catch {
      setStatus("Gagal menyalin hasil.");
    }
  };

  const shareResult = async () => {
    const payload = getResultPayload();
    const text = buildResultText(payload);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "IPV Speed Test Result",
          text,
        });
        setStatus("Hasil dibagikan.");
        return;
      } catch {
        setStatus("Berbagi dibatalkan.");
        return;
      }
    }

    await copyResult();
  };

  const downloadResult = () => {
    const payload = getResultPayload();
    const filename = getResultFilename(payload);

    downloadTextFile(
      filename,
      JSON.stringify(payload, null, 2),
      "application/json",
    );
    setStatus("Hasil diunduh.");
  };

  return (
    <Page>
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                Internet speed check
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-medium leading-none tracking-tight sm:text-5xl">
              Speed test
            </h1>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">
              Mengukur latensi, unduhan, dan unggahan langsung dari browser ke
              server uji.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isTesting ? (
                <button
                  type="button"
                  onClick={stopTest}
                  className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 active:translate-y-px"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={runFullTest}
                  className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 active:translate-y-px"
                >
                  Start test
                </button>
              )}

              <button
                type="button"
                onClick={reset}
                disabled={isTesting}
                className="rounded-xl border border-line px-5 py-3 text-sm text-ink transition-colors hover:bg-surface active:translate-y-px disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-sm font-medium">Status</h2>
              <div className="mt-3 flex items-start gap-2">
                <span
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${status.startsWith("Gagal") ? "bg-warn" : "bg-accent"}`}
                />
                <p className="font-mono text-sm text-ink">{status}</p>
              </div>
              <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
                {lastUpdated
                  ? `Terakhir selesai pada ${lastUpdated}`
                  : "Belum ada hasil pada sesi ini."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 border-y border-line px-4 py-10 sm:px-6 md:grid-cols-12 md:py-14">
        <div className="md:col-span-7">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
            Unduhan
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-mono text-5xl leading-none tracking-tight sm:text-6xl">
              {formatValue(downloadSpeed)}
            </span>
            <span className="pb-1 text-sm text-muted">Mbps</span>
          </div>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-accent transition-[width] duration-200"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            File uji 5 MB dari server ini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:col-span-5 md:grid-cols-2 md:gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Unggahan
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-mono text-3xl leading-none tracking-tight">
                {formatValue(uploadSpeed)}
              </span>
              <span className="pb-0.5 text-sm text-muted">Mbps</span>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-accent transition-[width] duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Latensi
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-mono text-3xl leading-none tracking-tight">
                {formatValue(latency)}
              </span>
              <span className="pb-0.5 text-sm text-muted">ms</span>
            </div>
            <p className="mt-5 text-sm text-muted">Rata-rata tiga ping.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 md:gap-12 md:py-20">
        <div className="md:col-span-7">
          <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
            Hasil
          </h2>
          <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface p-5 font-mono text-xs leading-relaxed text-muted">
            {buildResultText(getResultPayload())}
          </pre>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shareResult}
              className="rounded-xl border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface active:translate-y-px"
            >
              Share
            </button>
            <button
              type="button"
              onClick={copyResult}
              className="rounded-xl border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface active:translate-y-px"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={downloadResult}
              className="rounded-xl border border-line px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface active:translate-y-px"
            >
              Download JSON
            </button>
          </div>
        </div>

        <div className="md:col-span-5">
          <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
            Cara pakai
          </h2>
          <ol className="mt-6 divide-y divide-line border-t border-line">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4 py-4">
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-ink">{step}</span>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 text-sm font-medium">Catatan teknis</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li>Unduhan memakai file uji di folder public.</li>
            <li>Unggahan memakai endpoint echo, jadi bisa terkena CORS.</li>
            <li>Jika unggahan gagal, hasil lain tetap ditampilkan.</li>
          </ul>
        </div>
      </div>
    </Page>
  );
};

export default SpeedTestPage;
