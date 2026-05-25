import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

type RouteParams = Promise<{ slug: string }>;

export default async function OG({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "#00568b",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        {slug}
      </div>
    ),
    size
  );
}
