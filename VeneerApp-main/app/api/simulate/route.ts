import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, shade, numOutputs = 1 } = await request.json()
    console.log('DEBUG: image type:', typeof image);
    console.log('DEBUG: image length:', image?.length);
    console.log('DEBUG: image starts with:', image?.substring(0, 50));
    console.log('DEBUG: has data URI prefix:', image?.startsWith('data:'));
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

    const response = await fetch(`${backendUrl}/api/veneer-preview`, {
      method: "POST",
      headers: {"Content-Type" : "application/json" },
      body: JSON.stringify({
        image: image,
        intensity: 0.8,
        preserve_geometry: true,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Backend Veneer Generation failed");

    }
    return NextResponse.json({ output: data.output })
  } catch (error: unknown) {
    console.error("Simulation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate simulation"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
