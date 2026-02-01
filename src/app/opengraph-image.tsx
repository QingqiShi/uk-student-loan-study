import { ImageResponse } from "next/og";
import { parseMetadataParams } from "@/lib/metadata";

export const runtime = "edge";
export const alt = "UK Student Loan Projection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Image({ searchParams }: Props) {
  const params = await searchParams;
  const meta = parseMetadataParams(params);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        fontFamily: "system-ui, sans-serif",
        color: "white",
        padding: "60px",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "42px",
          fontWeight: 600,
          marginBottom: "40px",
          color: "#94a3b8",
        }}
      >
        UK Student Loan Study
      </div>

      {/* Plan Type */}
      <div
        style={{
          fontSize: "64px",
          fontWeight: 700,
          marginBottom: "24px",
          background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {meta.planName}
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          gap: "80px",
          marginTop: "20px",
        }}
      >
        {/* Balance */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            {meta.formattedBalance}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            {meta.pgBalance > 0 ? "Total Balance" : "Balance"}
          </div>
        </div>

        {/* Salary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            {meta.formattedSalary}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            Salary
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        studentloanstudy.uk
      </div>
    </div>,
    {
      ...size,
    },
  );
}
