import { NextResponse } from "next/server";

// Proxy to ARASAAC API to avoid CORS issues
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const locale = searchParams.get("locale") || "es";

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.arasaac.org/v1/pictograms/${locale}/search/${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      // ARASAAC returns 404 when no results found
      if (response.status === 404) {
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: "ARASAAC API error" }, { status: response.status });
    }

    const data = await response.json();

    // Map to simpler structure (ARASAAC returns complex objects)
    const pictograms = (Array.isArray(data) ? data : []).slice(0, 30).map((p: any) => ({
      id: p._id,
      keywords: p.keywords?.map((k: any) => k.keyword) || [],
      url: `https://static.arasaac.org/pictograms/${p._id}/${p._id}_500.png`,
    }));

    return NextResponse.json(pictograms);
  } catch (error) {
    console.error("ARASAAC proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch pictograms" }, { status: 500 });
  }
}
