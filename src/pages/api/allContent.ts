import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

try {
    const content = await prisma.pageContent.findMany();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
}