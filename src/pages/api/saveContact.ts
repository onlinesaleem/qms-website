import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        try {
          const content = await prisma.contactSubmission.findMany();
          res.status(200).json(content);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch content' });
        }
        break;
        
      case 'POST':
        try {
          const { name, email, message } = req.body;
          const newContent = await prisma.contactSubmission.create({
            data: { name, email, message },
          });
          res.status(201).json(newContent);
        } catch (error) {
          res.status(500).json({ error: 'Failed to create content' });
        }
        break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
      }
   
    }