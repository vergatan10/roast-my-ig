import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const roastCache = new Map<string, { roast: string; timestamp: number }>();

type Profile = {
  username: string;
  follower_count: number;
  following_count: number;
  media_count: string;
  biography: string;
};

async function generateRoast(profile: Profile) {
  try {
    if (!profile.username) {
      return "Error: Username tidak boleh kosong";
    }

    const cachedData = roastCache.get(profile.username);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < 5 * 60 * 1000) {
      return cachedData.roast;
    }

    const prompt = `Buat roasting lucu untuk Instagram user @${profile.username} berdasarkan data berikut:
    - Followers: ${profile.follower_count}
    - Following: ${profile.following_count} 
    - Jumlah Post: ${profile.media_count}
    - Bio: "${profile.biography}"
    Roasting harus singkat, tajam, dan lucu. Buat dalam 3-4 kalimat. Gunakan bahasa santai seperti anak Twitter atau meme culture.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(prompt);

    const roast =
      response.response.text().trim() ||
      "Gagal menghasilkan roasting. Coba lagi!";

    if (roast.includes("GoogleGenerativeAI Error")) {
      return "Error: Konten tidak dapat di-generate karena alasan keamanan. Silakan coba lagi.";
    }

    if (!roast.includes("Error saat generate roast")) {
      roastCache.set(profile.username, {
        roast,
        timestamp: now,
      });
    }

    return roast;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return `Terjadi error, kalimat roasting terlalu tajam 😱, silahkan coba lagi ya..`;
    }
    return "Error saat generate roast: Terjadi kesalahan yang tidak diketahui";
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Cek cache di server
  const cachedData = roastCache.get(username);
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < 5 * 60 * 1000) {
    return NextResponse.json({
      username,
      roast: cachedData.roast,
    });
  }

  const url = `${process.env.NEXT_PUBLIC_API_BACKEND_V2}${username}`;
  const randomNum = Math.floor(Math.random() * 5) + 1;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env[`X_RAPIDAPI_KEY${randomNum}`]!,
      "x-rapidapi-host": process.env.X_RAPIDAPI_HOST!,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }
    const profile = await res.json();

    const roast = await generateRoast(profile.data);

    return NextResponse.json({
      username,
      roast,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch roasting" },
      { status: 500 }
    );
  }
}
