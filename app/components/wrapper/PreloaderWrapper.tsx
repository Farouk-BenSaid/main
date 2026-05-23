"use client";

import { useState } from "react";
import Preloader from "../Preloader";

export default function PreloaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? <Preloader onComplete={() => setLoading(false)} /> : children}
    </>
  );
}

// for the first code it rendered the children before the preloader was loaded and it was not visible
// for the second one it rendered the children after the preloader was loaded and it was visible

// FIRST CODE
// "use client";

// import { useEffect, useState } from "react";
// import gsap from "gsap";
// import Preloader from "../Preloader";

// export default function PreloaderWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [ready, setReady] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // only render on client to avoid SSR hydration mismatchs
//   useEffect(() => {
//     const id = requestAnimationFrame(() => setReady(true));
//     return () => cancelAnimationFrame(id);
//   }, []);

//   const handleComplete = () => {
//     gsap.fromTo(
//       "#page-content",
//       {
//         opacity: 0,
//       },
//       {
//         opacity: 1,
//         duration: 0.55,
//         ease: "power2.out",
//         onComplete: () => setLoading(false),
//       },
//     );
//   };

//   if (!ready) return <>{children}</>; // Preloader hasn't loaded yet so we just render the children

//   return (
//     <>
//       {loading && <Preloader onComplete={handleComplete} />}
//       <div id="page-content" style={{ opacity: loading ? 0 : 1 }}>
//         {children}
//       </div>
//     </>
//   );
// }
