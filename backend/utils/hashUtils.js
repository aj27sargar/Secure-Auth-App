const crypto = require('crypto');

const generateKey = () => crypto.randomBytes(8).toString('hex');
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

const generateHashKey = (date, productKey) => sha256(`${date}|${productKey}`);
const generateHashCode = (productKey, hashKey) => sha256(`${productKey}|${hashKey}`);

module.exports = { generateKey, generateHashKey, generateHashCode };
