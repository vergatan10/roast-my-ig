import { NextResponse } from "next/server";

const roastCache: { [key: string]: string } = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Cek cache di server
  if (roastCache[username]) {
    return NextResponse.json({ username, roast: roastCache[username] });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/roast?username=${username}`
    );
    const data = await res.json();

    // Simpan ke cache
    roastCache[username] = data.roast;

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch roasting" },
      { status: 500 }
    );
  }
}
