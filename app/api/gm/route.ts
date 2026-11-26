import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, scene, agent, outcome } = body

    // Procedural Fallback Engine (Cold War Handler Intelligence)
    const responses = [
      `HANDLER ADVISORY: Target response logged. Satellite telemetry confirms minimal thermal signature shift. Advance cautiously.`,
      `SIGNAL DECRYPT: Station Vienna reports local asset compromised. Maintain radio silence and secure the primary objective.`,
      `TACTICAL UPDATE: Hostile counter-intelligence swept the perimeter 4 minutes ago. You have a narrow extraction window.`,
      `OPERATIONAL DIRECTIVE: Confirm document destruction before proceeding to the rendezvous coordinates.`
    ]

    const text = responses[Math.floor(Math.random() * responses.length)]

    return NextResponse.json({
      success: true,
      narrative: text,
      timestamp: new Date().toLocaleTimeString(),
      directive: 'CONTINUE MISSION PROFILE'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'GM Relay Failure' },
      { status: 500 }
    )
  }
}
