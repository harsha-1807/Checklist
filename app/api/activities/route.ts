import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        subActivities: true,
      },
    });
    return NextResponse.json(activities, { status: 200 });
    // return NextResponse.json("working good",{ status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name = "New Activity",
      unit = "hours",
      weight = 0,
      subActivities = [
        {
          name: "New SubActivity",
          unit: "hours",
          weight: 0,
        },
      ],
    } = body;

    const newActivity = await prisma.activity.create({
      data: {
        name,
        unit,
        weight,
        subActivities: {
          create: subActivities,
        },
      },
      include: {
        subActivities: true,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("[ACTIVITY_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
