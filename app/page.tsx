import { Navbar } from "./components/Navbar";
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Redirect />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-zinc-900 via-zinc-950 to-black px-6 py-16 sm:px-10 lg:px-16">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-16 -top-12 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-300">
                Live stream control for fans
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Let your fans choose the music that plays on your stream.
              </h1>
              <p className="text-lg text-zinc-300 sm:text-xl">
                Humming blends creator streaming with live fan voting. Creators
                curate a pool of tracks, fans vote in real time, and the next
                song is decided by the crowd.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition hover:bg-zinc-100">
                  Get started
                </button>
                <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40">
                  Watch a demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live fan voting
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Creator curation
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                  Stream-ready queues
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/60">
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <span className="font-semibold">Live Stream</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">
                    2.4k fans voting
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Midnight Skyline",
                      artist: "Nova Rue",
                      votes: 62,
                    },
                    { title: "Pulse Driver", artist: "Orbit Echo", votes: 58 },
                    { title: "Neon Drift", artist: "Luna Vale", votes: 41 },
                  ].map((track) => (
                    <div
                      key={track.title}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {track.title}
                        </p>
                        <p className="text-xs text-zinc-400">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-fuchsia-400 to-indigo-400"
                            style={{ width: `${track.votes}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-300">
                          {track.votes}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-200">
                  <span>Next up</span>
                  <span className="font-semibold">Midnight Skyline</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Creators set the vibe",
              description:
                "Build a curated queue, set voting rules, and keep full control of what can play.",
            },
            {
              title: "Fans drive the moment",
              description:
                "Let your community vote in real time, boosting engagement and keeping the chat alive.",
            },
            {
              title: "Stream-ready playback",
              description:
                "Seamless playback for your stream with clean transitions and auto-updated queues.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-zinc-300">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              How Humming works
            </h2>
            <p className="text-zinc-300">
              A simple flow that keeps creators in control and fans fully
              involved.
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "1. Creators open a stream",
                  body: "Connect your stream, drop in a playlist or theme, and choose vote timing.",
                },
                {
                  title: "2. Fans vote on tracks",
                  body: "Viewers upvote their favorites or rally behind a specific vibe.",
                },
                {
                  title: "3. The crowd decides",
                  body: "Top voted tracks rise to the top and play live for everyone.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Creator dashboard",
              "Fan voting overlay",
              "Queue insights",
              "Stream analytics",
            ].map((label) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-linear-to-br from-fuchsia-400/50 to-indigo-400/50 blur-xl" />
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  Clean, modern panels designed for fast decisions.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Ready to let your community DJ the stream?
              </h2>
              <p className="text-zinc-300">
                Start a creator stream today or join as a fan to vote on the
                next track.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button className="rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400">
                Sign up as creator
              </button>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50">
                Join as fan
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
