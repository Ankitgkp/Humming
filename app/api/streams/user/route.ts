import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticatd",
      },
      {
        status: 403,
      },
    );
  }
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
    },
  });

  return NextResponse.json({
    streams: streams.map((stream) => ({
      id: stream.id,
      title: stream.title,
      votes: stream._count.upvotes,
      thumbnail: stream.smallImageUrl || stream.BigImageUrl,
      youtubeId: stream.extractedId,
      submittedBy: stream.userId,
    })),
  });
}
