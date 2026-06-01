"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function Navbar() {
  const session = useSession();

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-linear-to-br from-fuchsia-500/70 to-indigo-500/70" />
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-white">Humming</h1>
          <p className="text-xs text-zinc-400">Creator-powered music streams</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {session.data?.user && (
          <button
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/50"
            onClick={() => signOut()}
          >
            Logout
          </button>
        )}
        {!session.data?.user && (
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition hover:bg-zinc-100"
            onClick={() => signIn()}
          >
            Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
