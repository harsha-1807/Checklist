import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const subActivityId = params.id;
    const body = await req.json();

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.unit !== undefined) dataToUpdate.unit = body.unit;
    if (body.weight !== undefined) dataToUpdate.weight = parseInt(body.weight);

    const updated = await prisma.subActivity.update({
      where: { id: subActivityId },
      data: dataToUpdate,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update sub-activity" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const subActivityId = params.id;

    await prisma.subActivity.delete({
      where: { id: subActivityId },
    });

    return NextResponse.json({ message: "Sub-activity deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete sub-activity" }, { status: 500 });
  }
}
