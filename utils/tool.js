const crypto = require('crypto');

function splitPK(privateKey) {
  const hexNumber = privateKey.slice(2);
  const midPoint = Math.ceil(hexNumber.length / 2);
  const firstHalf = hexNumber.slice(0, midPoint);
  const secondHalf = hexNumber.slice(midPoint);
  return [firstHalf, secondHalf];
}

function encryptKey(privateKey, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0')), iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

function decryptKey(encryptedData) {
  const key = encryptedData.slice(-32);
  const fullEncrypted = encryptedData.slice(0, -32);
  const iv = Buffer.from(fullEncrypted.slice(0, 32), 'hex');
  const encryptedContent = fullEncrypted.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0')), iv);
  let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  splitPK,
  encryptKey,
  decryptKey
};
