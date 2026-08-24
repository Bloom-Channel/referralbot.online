import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e1116",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "20px solid #b8541c",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e7e9ee",
            letterSpacing: -2,
          }}
        >
          Referralbot.online
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#8a8f98",
            marginTop: 16,
          }}
        >
          Share and discover referral links
        </div>
      </div>
    ),
    { ...size }
  );
}
