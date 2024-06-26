import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const skeleton = [1, 2, 3];

  const getData = async () => {
    const request = await fetch(
      import.meta.env.VITE_URL + import.meta.env.VITE_GHOST
    );
    const response = await request.json();
    setLoading(false);
    setData(response);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Helmet>
        <title>What is my IP | IPVIEW</title>
        <meta
          name="description"
          content="Aplikasi Simple untuk mengetahui IP Public yang digunakan, dan informasi didalamnya"
        />
        <link rel="canonical" href="https://ipview.pages.dev/" />
      </Helmet>

      <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900 via-indigo-950 to-slate-900">
        <div className="container mx-auto py-7 px-3 md:px-0">
          <div className="md:h-40 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg flex flex-wrap rounded-md overflow-hidden p-4">
            <div className="w-[100%] md:w-[60%]">
              <h1>Apa IP Address Publik saya?</h1>
              <p className="text-3xl font-bold">
                {data.ip || "Loading IP Address.."}
              </p>
              <div className="mt-3">
                <h2>Lokasi Sekarang :</h2>
                <p className="-mt-1 font-medium">
                  {data.location?.localityName +
                    ", " +
                    data.location?.city +
                    ", " +
                    data.location?.principalSubdivision}
                </p>
              </div>
            </div>
            <div className="w-[100%] mt-4 md:mt-0 md:w-[40%]">
              <h2 className="font-medium">Jaringan yang Digunakan</h2>
              <div className="">
                <div className="flex gap-2">
                  Registry :<p>{data.network?.registry || "undefined"}</p>
                </div>
                <div className="flex gap-2">
                  Organization :
                  <p>{data.network?.organisation || "undefined"}</p>
                </div>
                <div className="flex gap-2">
                  IP : <p>{data.network?.bgpPrefix || "undefined"}</p> ({" "}
                  <p>{data.network?.totalAddresses || "undefined"}</p>)
                </div>

                <div className="flex gap-2">
                  <p>{data.network?.bgpPrefixNetworkAddress || "undefined"}</p>{" "}
                  -<p>{data.network?.bgpPrefixLastAddress || "undefined"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg flex rounded-md overflow-hidden p-4">
            <div className="w-full">
              <h2 className="font-semibold text-lg">Operator yg dipakai</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-700 text-sm">
                  <thead className="text-left">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        asn & numeric
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        organisation
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        name
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registry
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registered country
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        total Ipv4
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank Text
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500">
                    <>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].asn || "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].organisation ||
                            "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].name || "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].registry || "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].registeredCountryName ||
                            "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].totalIpv4Addresses ||
                            "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].rank || "undefined"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].rankText || "undefined"}
                        </td>
                      </tr>
                    </>
                  </tbody>
                </table>
              </div>
              <h2 className="font-semibold text-lg mt-4">Jalur Operator</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-700 text-sm">
                  <thead className="text-left">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        no
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        asn & numeric
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        organisation
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        name
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registry
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registered country
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        total Ipv4
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank Text
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-purple-500">
                    {loading
                      ? skeleton.map((e) => (
                          <tr key={Math.random(20)} className="animate-pulse">
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              <div class="h-4 bg-gray-300/90 rounded"></div>
                            </td>
                          </tr>
                        ))
                      : data.network?.viaCarriers.map((vca, index) => (
                          <tr key={Math.random(20)}>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.asn + " | " + vca.asnNumeric}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.organisation}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.registry}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.registeredCountryName +
                                " (" +
                                vca.registeredCountry +
                                ")"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.totalIpv4Addresses}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.rank}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                              {vca.rankText}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-md overflow-hidden p-4">
            <p className="text-sm">
              Jika kalian terbantu dengan project ini tolong dukung dengan
              memberi stars di github.
            </p>
            <div className="flex mt-2 gap-2">
              <a
                className="github-button"
                href="https://github.com/fajriyan/myip"
                data-color-scheme="no-preference: dark; light: dark_high_contrast; dark: dark_dimmed;"
                data-icon="octicon-star"
                data-size="large"
                aria-label="Star fajriyan/myip on GitHub"
              >
                Star
              </a>
              <a
                className="github-button"
                href="https://github.com/fajriyan"
                data-color-scheme="no-preference: dark; light: dark_high_contrast; dark: dark_dimmed;"
                data-size="large"
                aria-label="Follow @fajriyan on GitHub"
              >
                Follow @fajriyan
              </a>
              <a
                className="github-button"
                href="https://github.com/fajriyan/myip/issues"
                data-color-scheme="no-preference: dark; light: dark_high_contrast; dark: dark_dimmed;"
                data-icon="octicon-issue-opened"
                data-size="large"
                aria-label="Issue fajriyan/myip on GitHub"
              >
                Issue
              </a>
              <a href="https://saweria.co/fajriyan" className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-award"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"></path>
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"></path>
                </svg>
                Dukung
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
