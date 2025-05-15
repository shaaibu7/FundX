const { User } = require('../models');

//====generating safiri user logic start from here===//
function sanitizeName(name) {
    return name
        .normalize('NFD') // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
        .toLowerCase();
}

async function generateSafiriUsername(fullName) {
    let formatedName = sanitizeName(fullName);
    let username = `${formatedName}.fundX`;
    
    const existingUser = await User.findOne({ 
        where: { safiriUsername: username },
        attributes: ['safiriUsername'] 
    });
    
    if (existingUser) {
        return `${formatedName + uuid().slice(0,4)}.fundX`;
    }
    
    return username;
}

module.exports = generateSafiriUsername