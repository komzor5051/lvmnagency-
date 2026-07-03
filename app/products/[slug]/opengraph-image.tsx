import { ImageResponse } from "next/og";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getProduct } from "@/lib/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadBg(name: string): string | null {
  const p = join(process.cwd(), "public", name);
  if (!existsSync(p)) return null;
  const buf = readFileSync(p);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const bg = loadBg("og-products-bg.png");
  const title = product?.title ?? "Продукты";
  const badge = product?.meta ?? "vladlyamin.ru";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          position: "relative",
        }}
      >
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "65%",
            background: bg
              ? "linear-gradient(to right, #FFFFFF 80%, transparent)"
              : "#FFFFFF",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "7px",
            backgroundColor: "#C8F04C",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 64px 56px",
            width: "65%",
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "15px",
              color: "#888888",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            vladlyamin.ru · продукты
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: title.length > 24 ? "56px" : "76px",
              fontWeight: 800,
              color: "#111111",
              lineHeight: 1.05,
              marginBottom: "32px",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              padding: "8px 16px",
              border: "1.5px solid #D0D0D0",
              fontFamily: "sans-serif",
              fontSize: "17px",
              color: "#333333",
              backgroundColor: "#FFFFFF",
              alignSelf: "flex-start",
            }}
          >
            {badge}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "36px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "3px",
                backgroundColor: "#C8F04C",
              }}
            />
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#888888",
              }}
            >
              Влад Лямин
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
