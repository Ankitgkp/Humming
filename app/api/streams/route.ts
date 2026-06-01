import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { z } from 'zod';
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/i;

const createStreamSchema = z.object({
    createrId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const data = createStreamSchema.parse(await req.json());
        const isYoutube = YT_REGEX.test(data.url);
        if (!isYoutube) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1];
        const res = await youtubesearchapi.GetVideoDetails(extractedId)
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1)

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.createrId,
                url: data.url,
                extractedId,
                type: "YouTube",
                title: res.title,
                smallImageUrl: thumbnails.length > 1 ? thumbnails[thumbnails.length - 1].url : thumbnails[thumbnails.length - 2].url ?? "",
                BigImageUrl: thumbnails[thumbnails.length - 1].url ?? ""
            }
        });

        return NextResponse.json({
            message: "Added Stream",
            id: stream.id
        })

    } catch (e) {
        return NextResponse.json({
            message: "Error"
        }, {
            status: 411
        })
    }

}

export async function GET(req: NextRequest) {
    const createrId = req.nextUrl.searchParams.get('createrId')
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: createrId ?? ""
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: createrId ?? ""
                }
            }
        }
    })


    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        }))
    })
}

