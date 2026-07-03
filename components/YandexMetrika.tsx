"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const COUNTER_ID = 110064196;

// App Router does client-side navigation (no full reload), so Metrika's initial
// hit covers only the first page. Send a manual hit on every route change so
// internal page traffic is counted. useSearchParams() needs a <Suspense> boundary.
function MetrikaHits() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
    if (!ym) return;
    const qs = searchParams.toString();
    const url = window.location.origin + pathname + (qs ? "?" + qs : "");
    ym(COUNTER_ID, "hit", url);
  }, [pathname, searchParams]);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}','ym');
        ym(${COUNTER_ID},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <MetrikaHits />
      </Suspense>
    </>
  );
}
