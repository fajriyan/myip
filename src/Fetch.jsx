import React, { useEffect, useState } from "react";

const Fetch = () => {
  const [dataSurat, setSurat] = useState([]);

  const getAPIsurat = async () => {
    const ResponAPI1 = await fetch(import.meta.env.VITE_BASE_URL);
    const dataAPI1 = await ResponAPI1.json();
    setSurat(dataAPI1);
    console.log(dataAPI1);
  };

  useEffect(() => {
    getAPIsurat();
  }, []);

  return <div>{dataSurat.ip}</div>;
};

export default Fetch;
