import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const activityId = params.id;
    const body = await req.json();

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.unit !== undefined) dataToUpdate.unit = body.unit;
    if (body.weight !== undefined) dataToUpdate.weight = body.weight;

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error('[ACTIVITY_PUT]', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const activityId = params.id;

    await prisma.activity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({ message: 'Activity deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[ACTIVITY_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
