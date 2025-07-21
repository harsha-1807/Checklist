import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {activityId, name = "New Subactivity", unit = "hours", weight = 0} = body;

        if (!activityId) {
            return new Response(JSON.stringify({ error: "Activity ID is required" }), { status: 400 });
        }

        const SubActivity = await prisma.subActivity.create({
            data: {
                activityId,
                name,
                unit,
                weight,
            },
        });
        return new Response(JSON.stringify(SubActivity), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create sub-activity" }, { status: 500 });
    }
}