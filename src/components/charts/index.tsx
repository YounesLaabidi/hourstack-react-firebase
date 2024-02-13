import { useState } from "react";
import Daily from "./Daily";

export default function Chart() {
  const [chart, setChart] = useState("daily");
  return (
    <>
      <h2 className="font-bold text-3xl text-center mb-5">Charts</h2>
      <Daily />
    </>
  );
}
