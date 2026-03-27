
import { compareRates } from '../services/rateEngine.services.js';

export async function compare(req, res) {

    try {
        const { destinationPostalCode, province, items } = req.body;

        if (!destinationPostalCode || !province || !items) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await compareRates({
            destinationPostalCode,
            province,
            items
        });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
}