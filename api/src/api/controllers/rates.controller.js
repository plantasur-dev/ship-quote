
import rateEngine from '../services/rateEngine.service.js';

export async function compare(req, res) {
    const { destinationPostalCode, province, items } = req.body;

    const result = await rateEngine({
        destinationPostalCode,
        province,
        items
    });

    res.json(result);
}