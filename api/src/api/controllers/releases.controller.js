
import { latestRelease } from '../../lib/configs/release.config.js';


export const latest = async (req, res) => {
    res.json(latestRelease);
};