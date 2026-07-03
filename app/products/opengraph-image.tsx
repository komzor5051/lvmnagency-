import { ImageResponse } from "next/og";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const alt = "Продукты — Влад Лямин";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadBg(name: string): string | null {
  const p = join(process.cwd(), "public", name);
  if (!existsSync(p)) return null;
  const buf = readFileSync(p);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default function Image() {
  const bg = loadBg("og-products-bg.png");

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
        {/* AI-generated background (right side) */}
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

        {/* White text area overlay — left 65% */}
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

        {/* Lime top bar */}
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

        {/* Content */}
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
              fontSize: "76px",
              fontWeight: 800,
              color: "#111111",
              lineHeight: 1.0,
              marginBottom: "32px",
              letterSpacing: "-0.03em",
            }}
          >
            Продукты
          </div>

          {/* Product tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {["Консультация 1:1", "AI-аудит", "Гайд по AI", "Мини-курс"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    padding: "8px 16px",
                    border: "1.5px solid #D0D0D0",
                    fontFamily: "sans-serif",
                    fontSize: "17px",
                    color: "#333333",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>

          {/* Bottom accent */}
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
