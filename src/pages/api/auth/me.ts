import { authenticateToken } from '@/middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    const user = (req as any).user; // This user object is set in the middleware
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
      console.log("the user not authorized");
    }
  });
}
