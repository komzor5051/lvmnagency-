import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Desk DS OG card: paper-grid desk, a white sheet with lime tape, Tektur
// headline with the lime .hl mark — mirrors the live hero.
export const alt = "Влад Лямин — я строю системы с AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const tektur = readFileSync(join(process.cwd(), "public", "fonts", "tektur-800.ttf"));
  const onest = readFileSync(join(process.cwd(), "public", "fonts", "onest-500.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#f8f8f5",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 39px, rgba(17,17,17,0.05) 39px, rgba(17,17,17,0.05) 40px), repeating-linear-gradient(90deg, transparent 0px, transparent 39px, rgba(17,17,17,0.05) 39px, rgba(17,17,17,0.05) 40px)",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Paper sheet */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "920px",
            padding: "72px 80px 64px",
            backgroundColor: "#ffffff",
            border: "1px solid #e4e4e0",
            boxShadow: "0 30px 55px -18px rgba(19,19,19,0.3), 0 10px 22px -8px rgba(19,19,19,0.2)",
            transform: "rotate(-0.8deg)",
            position: "relative",
          }}
        >
          {/* Lime tape */}
          <div
            style={{
              position: "absolute",
              top: "-16px",
              left: "390px",
              width: "140px",
              height: "34px",
              backgroundColor: "rgba(200,240,76,0.75)",
              transform: "rotate(-4deg)",
              boxShadow: "0 3px 5px -1px rgba(19,19,19,0.22)",
            }}
          />

          <div
            style={{
              fontFamily: "Onest",
              fontSize: "17px",
              color: "#888888",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            vladlyamin.ru
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Tektur",
              fontSize: "72px",
              color: "#111111",
              lineHeight: 1.08,
            }}
          >
            <span>Я Влад.</span>
            <span style={{ display: "flex" }}>
              Строю
              <span style={{ backgroundColor: "#C8F04C", marginLeft: "20px", padding: "0 10px" }}>
                системы с AI
              </span>
            </span>
          </div>

          <div
            style={{
              fontFamily: "Onest",
              fontSize: "26px",
              color: "#555555",
              lineHeight: 1.4,
              marginTop: "30px",
            }}
          >
            Внедряю AI в бизнес, обучаю людей и пишу о том, что реально работает
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tektur", data: tektur, weight: 800, style: "normal" },
        { name: "Onest", data: onest, weight: 500, style: "normal" },
      ],
    }
  );
}
