
import createHttpError from "http-errors";

export const compareDimensions = (item, maxDimensions) => {
    
    if (item.width > maxDimensions[0].maxWidth ||
        item.large > maxDimensions[0].maxLength ||
        item.height > maxDimensions[0].maxHeight
    ) {
        throw createHttpError(400, 'Item dimensions exceed the maximum allowed for any pallet');
    }

    return true;
};