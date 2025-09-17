import { NextResponse, NextRequest } from "next/server";
import { sendNotification, setVapidDetails } from "web-push";

// Configure VAPID details
setVapidDetails(
  "mailto:oliverio.junior2@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { subscription, message } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription: missing endpoint" },
        { status: 400 }
      );
    }

    await sendNotification(
      subscription,
      JSON.stringify({
        title: "Notificação PWA",
        body: message || "Nova notificação!",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
      })
    );

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
