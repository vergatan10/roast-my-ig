'use client'

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, Instagram, Download, Loader2 } from "lucide-react";
import html2canvas from 'html2canvas';
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<{ [key: string]: { roast: string, timestamp: number } }>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSetUsername = (value: string) => {
    setUsername(value);
    if (value.length === 0) {
      setRoast("");
      setName("");
    }
  };

  const fetchRoast = async () => {
    if (!username) return;

    setLoading(true);
    setRoast("");
    setName("");

    const now = Date.now();
    const cachedData = cache[username.replace("@", "")];

    if (cachedData && now - cachedData.timestamp < 5 * 60 * 1000) {
      setName(username.replace("@", ""));
      setRoast(cachedData.roast);
      setLoading(false);
      return;
    }


    try {
      const res = await fetch(`/api/roast_v2?username=${username.replace("@", "")}`);
      const data = await res.json();
      setRoast(data.roast);

      if (!data.roast.includes("Terjadi error")) {
        setCache((prevCache) => ({
          ...prevCache,
          [username.replace("@", "")]: {
            roast: data.roast,
            timestamp: now
          }
        }));
        setName(data.username);
      }
    } catch (error) {
      setRoast("Gagal mengambil roasting. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };


  const downloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `roasting-${username}.png`;
      link.click();
    }
  };

  const shareToInstagramStory = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const image = canvas.toDataURL('image/png');

      window.location.href = `instagram-stories://share?source_application=roasting-app&media=${encodeURIComponent(image)}`;

      setTimeout(() => {
        window.location.href = 'https://instagram.com';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-[20px]">
      <DotPattern
        width={25}
        height={25}
        cx={1}
        cy={0}
        cr={1}
        className={cn(
          "fixed [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
      <div className="max-w-lg mx-auto p-6 text-center space-y-4 flex-grow mb-24">
        <SparklesText text="Roast My Instagram 🔥" className="text-4xl mb-4" sparklesCount={5} />
        <span className="text-sm text-gray-300">
          ⚡ Powered by <b>Gemini AI</b> ⚡ <TypingAnimation startOnView={false} className="text-sm text-gray-500 font-thin">Limit 25 hit/menit • 2500 hit/bulan</TypingAnimation>
        </span>
        <Input
          placeholder="@cristiano"
          value={username}
          onChange={(e) => handleSetUsername(e.target.value)}
        />
        <Button className="mt-4 w-full bg-slate-900 hover:bg-slate-900 transition ease-in-out shadow-xl shadow-indigo-600/5" onClick={fetchRoast} disabled={loading}>
          {loading ? <Loader2 className="animate-spin text-yellow-500 w-8 h-8" /> : <span className="animate-pulse">Roast Me!</span>}
        </Button>

        {!loading && !roast && (
          <div className="text-sm text-gray-500 space-y-2 mt-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">📜 Aturan Dasar:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Masukkan username Instagram yang ingin di-roast</li>
                <li>Website akan mengambil data followers, following, jumlah post, dan bio</li>
                <li>Google Gemini AI akan generate jokes berdasarkan data tersebut</li>
                <li>Roasting yang sama akan di-refresh setiap 5 menit</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">⚠️ Catatan Penting:</h3>
              <p>Aplikasi ini hanya menggunakan profil Instagram yang bersifat publik sebagai bahan candaan. Tidak ada data yang disimpan atau digunakan untuk keperluan lain.</p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">🤝 Bantuan:</h3>
              <p>Jika mengalami masalah atau ada pertanyaan, silakan hubungi creator di kontak yang tersedia di bawah. 👇</p>
            </div>
          </div>
        )}

        {loading && (
          <Skeleton className="h-[250px] w-full mb-2 bg-gray-900" />
        )}

        {!loading && roast && username.length > 0 && (
          <>
            <Card ref={cardRef} className="mt-6 p-4 bg-gray-900 text-white">
              <CardContent>
                <p className="text-lg underline">{name && `@${name}`}</p>
                <p className="text-lg">{roast}</p>
              </CardContent>
              <CardFooter className="flex justify-center items-center pb-0">
                <p className="text-xs text-gray-500 text-center mt-4">
                  🌟roast-my-ig.vercel.app🌟
                </p>
              </CardFooter>
            </Card>
            <div className="flex gap-2 mt-4 justify-center">
              <Button onClick={downloadCard} className="flex items-center gap-2">
                <Download size={16} />
              </Button>
              <Button onClick={shareToInstagramStory} className="flex items-center gap-2">
                <Instagram size={16} />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="fixed max-w-[500px] bottom-[70px] right-0 left-0 mx-auto text-center text-sm font-thin">Creator :</div>
      <footer className="fixed max-w-[500px] bottom-4 right-5 left-5 mx-auto rounded-lg py-3 text-center bg-gray-950 border border-white">
        <div className="flex justify-evenly">
          <a
            href="https://instagram.com/tandika10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 flex items-center gap-2 animate-pulse"
          >
            <Instagram size={20} />
          </a>
          <span className="font-thin text-sm text-gray-800">|</span>
          <a
            href="https://github.com/vergatan10"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 flex items-center gap-2 animate-pulse"
          >
            <Github size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
