module.exports = (res, err) => {
    res.status(HTTP_INTERNAL_ERROR).json({ error: err.message, stack: err.stack.split('\n') });
}