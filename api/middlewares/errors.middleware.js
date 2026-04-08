
export const errorHandler = (err, req, res, next) => {

    if (err.name === 'ValidationError') {
        res.status(400).json(err.errors)
        return;
    }

    if (err.status) {
        res.status(err.status).json({ message: err.message });
        return;
    }

    if (err.name === 'CastError') {
        res.status(404).json({ message: 'Resource not found' });
        return;
    }

    if (err.message?.includes('E11000')) {
        res.status(409).json({ message: 'Resource duplicate' });
        return;
    }

    console.error('Error internal server', err.message);
    res.status(500).json({ message: 'Error internal server' });
}