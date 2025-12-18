import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()

    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Store in database
    // 2. Send to CRM
    // 3. Trigger email notifications
    // 4. Add to mailing list if consent given

    console.log("Lead captured:", leadData)

    // Simulate successful save
    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
      leadId: `lead_${Date.now()}`,
    })
  } catch (error) {
    console.error("Lead capture error:", error)
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 })
  }
}
