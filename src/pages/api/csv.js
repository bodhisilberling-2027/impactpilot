import { promises as fs } from 'fs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const csv = await fs.readFile('data/volunteers.csv', 'utf8');
    res.status(200).json({ csv: csv });
}