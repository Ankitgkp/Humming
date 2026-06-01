import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest) {
    const session = await getServerSession();


    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthenticated",
            },
            {
                status: 401,
            },
        );
    }

    try {

        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvotes.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
        return NextResponse.json({
            message: "Upvoted"
        })
    } catch (e) {
        if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
            return NextResponse.json({
                message: "Already upvoted"
            }, {
                status: 409
            })
        }

        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 400
        })
    }

}
