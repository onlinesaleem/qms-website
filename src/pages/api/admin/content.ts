
import { authenticateToken } from '@/middleware/auth';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  authenticateToken(req, res, async () => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const content = await prisma.pageContent.findMany();
        res.status(200).json(content);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
      }
      break;
      
    case 'POST':
      try {
        const { page, title, content,imageUrl } = req.body;
        const newContent = await prisma.pageContent.create({
          data: { page, title, content,imageUrl },
        });
        res.status(201).json(newContent);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create content' });
      }
      break;

    case 'PUT':
      try {
        const { id, title, content,imageUrl } = req.body;
        const updatedContent = await prisma.pageContent.update({
          where: { id },
          data: { title, content,imageUrl },
        });
        res.status(200).json(updatedContent);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await prisma.pageContent.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete content' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
}

