import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        subActivities: true,
      },
    });
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, unit, weight, subActivities } = body;

    if (!name || !unit || !weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newActivity = await prisma.activity.create({
      data: {
        name,
        unit,
        weight,
        subActivities: {
          create: subActivities || [],
        },
      },
      include: {
        subActivities: true,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, unit, weight } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        name,
        unit,
        weight,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Activity deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
