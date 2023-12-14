"use client";

import dynamic from "next/dynamic";

const Thingy = dynamic(() => import("../components/Thingy"), { ssr: false });
function App() {
  return <Thingy></Thingy>;
}

export default App;
