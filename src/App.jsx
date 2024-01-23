// const axios = require("axios");

import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const request = await fetch(
      import.meta.env.VITE_URL + import.meta.env.VITE_GHOST
    );
    const response = await request.json();
    setData(response);
  };

  useEffect(() => {
    getData();
  }, []);
  // console.log(data);
  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900 via-indigo-950 to-slate-900">
        <div className="container mx-auto py-7 px-3 md:px-0">
          <div className="md:h-40 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg flex flex-wrap rounded-md overflow-hidden p-4">
            <div className="w-[100%] md:w-[60%]">
              <h1>What is my IP address?</h1>
              <p className="text-3xl font-bold">
                {data.ip || "API Error | 404"}
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
              <h2 className="font-medium">Network Used</h2>
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
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-purple-700 text-sm">
                  <thead class="text-left">
                    <tr>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        asn & numeric
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        organisation
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        name
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registry
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registered country
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        total Ipv4
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank Text
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-purple-500">
                    <>
                      <tr>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].asn || "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].organisation ||
                            "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].name || "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].registry || "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].registeredCountryName ||
                            "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].totalIpv4Addresses ||
                            "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].rank || "undefined"}
                        </td>
                        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                          {data.network?.carriers?.[0].rankText || "undefined"}
                        </td>
                      </tr>
                    </>
                  </tbody>
                </table>
              </div>
              <h2 className="font-semibold text-lg mt-4">Jalur Operator</h2>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-purple-700 text-sm">
                  <thead class="text-left">
                    <tr>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        no
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        asn & numeric
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        organisation
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        name
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registry
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        registered country
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        total Ipv4
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank
                      </th>
                      <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        rank Text
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-purple-500">
                    {data.network?.viaCarriers.map((vca, index) => (
                      <>
                        <tr>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-900">
                            {index + 1}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.asn + " | " + vca.asnNumeric}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.organisation}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.name}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.registry}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.registeredCountryName +
                              " (" +
                              vca.registeredCountry +
                              ")"}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.totalIpv4Addresses}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.rank}
                          </td>
                          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                            {vca.rankText}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
