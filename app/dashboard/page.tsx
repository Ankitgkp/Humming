"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type QueueItem = {
  id: string;
  title: string;
  votes: number;
  thumbnail: string;
  youtubeId: string;
  submittedBy: string;
};

type StreamResponseItem = {
  id?: string;
  title?: string;
  votes?: number;
  thumbnail?: string;
  youtubeId?: string;
  submittedBy?: string;
};

const REFRESH_INTERVAL_MS = 10 * 1000; // 10 seconds

const initialQueue: QueueItem[] = [
  {
    id: "1",
    title: "Midnight Skyline — Nova Rue",
    votes: 42,
    thumbnail: "https://img.youtube.com/vi/OUqLhLS07CI/maxresdefault.jpg",
    youtubeId: "OUqLhLS07CI",
    submittedBy: "@luna",
  },
  {
    id: "2",
    title: "Pulse Driver — Orbit Echo",
    votes: 36,
    thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/maxresdefault.jpg",
    youtubeId: "5qap5aO4i9A",
    submittedBy: "@axel",
  },
  {
    id: "3",
    title: "Neon Drift — Luma Vale",
    votes: 28,
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    youtubeId: "dQw4w9WgXcQ",
    submittedBy: "@mira",
  },
];

function getYouTubeId(url: string) {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return match?.[1] ?? "";
}

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=OUqLhLS07CI");
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [voteError, setVoteError] = useState<string | null>(null);

  const isAuthenticated = session.status === "authenticated";

  async function refreshStream() {
    if (!isAuthenticated) {
      return;
    }
    const res = await fetch("/api/streams/user");
    const data = await res.json();
    const streams: StreamResponseItem[] = Array.isArray(data?.streams)
      ? data.streams
      : [];
    setQueue(
      streams.map((stream) => ({
        id: String(stream.id ?? ""),
        title: String(stream.title ?? "Untitled"),
        votes: Number.isFinite(Number(stream.votes)) ? Number(stream.votes) : 0,
        thumbnail: String(stream.thumbnail ?? ""),
        youtubeId: String(stream.youtubeId ?? ""),
        submittedBy: String(stream.submittedBy ?? ""),
      })),
    );
  }

  useEffect(() => {
    if (session.status === "unauthenticated") {
      signIn();
      router.replace("/");
    }
  }, [router, session.status]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    refreshStream();
    const interval = setInterval(refreshStream, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const previewId = useMemo(() => getYouTubeId(url), [url]);
  const nowPlaying = queue[0];

  const sortedQueue = useMemo(
    () => [...queue].sort((a, b) => b.votes - a.votes),
    [queue],
  );

  if (session.status === "loading" || !isAuthenticated) {
    return null;
  }

  async function handleVote(id: string, delta: number) {
    setVoteError(null);
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + delta } : item,
      ),
    );

    const res = await fetch(`/api/streams/upvote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamId: id,
      }),
    });

    if (res.status === 409) {
      setVoteError("You already upvoted this track.");
      refreshStream();
      return;
    }

    if (!res.ok) {
      setVoteError("Unable to vote right now. Try again.");
      refreshStream();
    }
  }

  async function handleShare() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: "Humming — Live Stream Queue",
        text: "Vote for the next song on the stream.",
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Live Stream Queue
            </h1>
            <p className="text-sm text-zinc-400">
              Vote for what plays next and submit your own picks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Creator: NovaRue
            </span>
            <button
              onClick={handleShare}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-white/50"
            >
              Share
            </button>
            <button
              onClick={() => signOut()}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-white/50"
            >
              Logout
            </button>
          </div>
        </header>

        {voteError && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {voteError}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Submit a YouTube track
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Paste a link to add your song to the queue.
                  </p>
                </div>
                <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition hover:bg-zinc-100">
                  Submit
                </button>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    YouTube link
                  </label>
                  <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
                  {previewId ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                      <iframe
                        title="Preview"
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${previewId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
                      Paste a valid YouTube link to preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Upcoming queue</h2>
                  <p className="text-sm text-zinc-400">Sorted by votes.</p>
                </div>
                <span className="text-xs text-zinc-500">
                  {sortedQueue.length} tracks
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {sortedQueue.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-zinc-500">#{index + 1}</div>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-16 w-28 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Submitted by {item.submittedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                        {item.votes} votes
                      </div>
                      <button
                        onClick={() => handleVote(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm text-white/90 transition hover:border-white/50"
                      >
                        ^
                      </button>
                      <button
                        onClick={() => handleVote(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm text-white/90 transition hover:border-white/50"
                      >
                        v
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Now playing</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  Live
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/60 p-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <iframe
                    title="Now playing"
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${nowPlaying?.youtubeId ?? previewId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">
                {nowPlaying?.title ?? "Queue is empty"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
