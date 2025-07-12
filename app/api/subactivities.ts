import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  try {
    if (req.method === "POST") {
      const { name, unit, weight, activityId } = req.body;

      const subActivity = await prisma.subActivity.create({
        data: { name, unit, weight, activityId },
      });
      return res.status(201).json(subActivity);
    }

    if (req.method === "GET") {
      if (id) {
        const subActivity = await prisma.subActivity.findUnique({
          where: { id: id as string },
          include: { activity: true },
        });
        return res.status(200).json(subActivity);
      } else {
        const subActivities = await prisma.subActivity.findMany({
          include: { activity: true },
        });
        return res.status(200).json(subActivities);
      }
    }

    if (req.method === "PUT") {
      if (!id)
        return res.status(400).json({ error: "ID is required for updating" });
      const { name, unit, weight, activityId } = req.body;

      const activity = await prisma.activity.update({
        where: { id: id as string },
        data: { name, unit, weight, activityId },
      });
      return res.status(200).json(activity);
    }

    if (req.method === "DELETE") {
      if (!id)
        return res.status(400).json({ error: "ID is required for deleting" });
      await prisma.activity.delete({
        where: { id: id as string },
      });
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
