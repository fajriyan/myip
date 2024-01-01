// const axios = require("axios");

import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const request = await fetch(import.meta.env.VITE_BASE_URL);
    const response = await request.json();
    setData(response);
    return response;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900 */}

      {/* text-white min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900 via-indigo-950 to-slate-900 */}
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900 via-indigo-950 to-slate-900">
        <div className="container mx-auto py-7">
          <div className="h-40 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg flex rounded-md overflow-hidden p-4">
            <div className="w-[60%] ">
              <h1>What is my IP address?</h1>
              <p className="text-3xl font-bold">{data.ip}</p>
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
            <div className="w-[40%]">
              <h2 className="font-medium">Network Used</h2>
              <div className="">
                <div className="flex gap-2">
                  Registry :<p>{data.network?.registry}</p>
                </div>
                <div className="flex gap-2">
                  Organization :<p>{data.network?.organisation}</p>
                </div>
                <div className="flex gap-2">
                  IP : <p>{data.network?.bgpPrefix}</p> ({" "}
                  <p>{data.network?.totalAddresses}</p>)
                </div>

                <div className="flex gap-2">
                  <p>{data.network?.bgpPrefixNetworkAddress}</p> -
                  <p>{data.network?.bgpPrefixLastAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
