import createHttpError from "http-errors";

export const schemaValidation = (req, res, next) => {

    const hasBody = req.body && Object.keys(req.body).length > 0;

    if (!hasBody && ['POST', 'PATCH', 'PUT'].includes(req.method)) {
        throw createHttpError(400, 'The request does not comply with the schema');
    }

    next();
};