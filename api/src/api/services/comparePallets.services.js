
import createHttpError from "http-errors";

import PalletType from "../../lib/models/palletType.model.js";

export const compareDimensions = async (item) => {

    const validPallet = await PalletType.findOne({
        "constraints.maxWidth": { $gte: item.width },
        "constraints.maxLength": { $gte: item.large },
        "constraints.maxHeight": { $gte: item.height }
    });

    if (!validPallet) {
        throw createHttpError(400, 'Item dimensions exceed the maximum allowed for any pallet');
    }

    return true;
};