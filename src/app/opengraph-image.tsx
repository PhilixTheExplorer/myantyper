import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Inherited by routes without an Open Graph image.
export const runtime = "nodejs";
export const alt = "MyanTyper: Myanmar Unicode touch typing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#f1e7d0";
const INK = "#2a1a08";
const INK_SOFT = "#7a5028";
const BORDER = "#6b4a2b";
const ACCENT = "#8b1a1a";

export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "public", "fonts");
  const [padauk, unitype] = await Promise.all([
    readFile(join(fontDir, "padauk-400.ttf")),
    readFile(join(fontDir, "masterpiece-uni-type.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        color: INK,
        fontFamily: "Padauk",
        padding: 64,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 28,
          border: `2px solid ${BORDER}`,
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 8,
          color: INK_SOFT,
        }}
      >
        MYANMAR UNICODE · TOUCH TYPING
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 96,
          gap: 8,
          lineHeight: 1.1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Type&nbsp;</span>
          <span style={{ fontFamily: "Masterpiece Uni Type", color: ACCENT }}>
            ြမန်မာစာ
          </span>
        </div>
        <div style={{ display: "flex" }}>with confidence.</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 28,
          color: INK_SOFT,
        }}
      >
        <div style={{ display: "flex" }}>
          No ads · No tracking · No account required
        </div>
        <div style={{ display: "flex", color: ACCENT }}>myantyper.com</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Padauk", data: padauk, weight: 400, style: "normal" },
        {
          name: "Masterpiece Uni Type",
          data: unitype,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
