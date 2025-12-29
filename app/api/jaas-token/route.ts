import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import uuid from "uuid-random";
import { getSession } from "##/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 },
      );
    }

    const appId = process.env.JITSI_APP_ID;
    const apiKey = process.env.JITSI_API_KEY;
    const privateKey = process.env.JITSI_PRIVATE_KEY;

    if (!appId || !apiKey || !privateKey) {
      console.error("Missing credentials:", {
        appId: !!appId,
        apiKey: !!apiKey,
        privateKey: !!privateKey,
      });
      return NextResponse.json(
        { error: "JaaS credentials not configured" },
        { status: 500 },
      );
    }

    // Get authenticated user session
    const session = await getSession();
    const userContext = session
      ? {
        id: session.userId,
        name: session.username,
        email: (session.email as string) || "",
        avatar: (session.avatar as string) || "",
        moderator: session.role === "admin" || session.role === "superadmin",
      }
      : {
        id: uuid(),
        name: "Participant",
        email: "",
        avatar: "",
        moderator: false,
      };

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 12; // Extended to 12 hours to cover potential TZ offset
    const nbf = now - 30;

    // JWT payload for JaaS - correct format
    const payload = {
      context: {
        user: userContext,
        features: {
          livestreaming: userContext.moderator,
          recording: userContext.moderator,
          transcription: userContext.moderator,
          "outbound-call": false,
        },
      },
      aud: "jitsi",
      iss: "chat",
      sub: appId,
      room: `Groom_${meetingId}`,
      exp: exp,
      nbf: nbf,
    };

    // Sign JWT with private key
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      header: {
        kid: apiKey,
        typ: "JWT",
        alg: "RS256",
      },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating JaaS token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}
