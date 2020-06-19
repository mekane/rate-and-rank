const crypto = require('crypto');

const users = {
    marty: {
        email: '',
        salt: 'd1959704b859038c',
        password: '1ee7105aec6eb16a1086c0f7f73cf2d60b9ded76fe978e29217c19e939da7e95453285bb44cff97fa755086bd28789deb7d7e96f906bca29948e0986d923374f'
    },
    peter: {
        email: 'email',
        salt: 'a651350576cab6f3',
        password: '624280fcd5c2d1a0f97ef73adce009a25cbddabe83815c0f39748ad9254277d7207ce177ed861c992393e89bafa6763bc94100ccf6d8f54e6fbd951360e003c6'
    }
};

function hash(value, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(value);
    return hash.digest('hex');
}

const userStore = {
    getUser(username, password) {
        if (!username || !password)
            return null;

        const user = users[username];

        if (typeof user !== 'object')
            return null;

        console.log('matched', user);

        const pw = hash(password, user.salt);

        if (pw === user.password) {
            return {
                username,
                email: user.email
            };
        }

        return null;
    },
    newUser(username, email, password) {
        const salt = crypto.randomBytes(8).toString('hex').slice(0, 16);

        const userEntry = {
            [username]: {
                email,
                salt,
                password: hash(password, salt)
            }
        }
        console.dir(userEntry);
    }
};

module.exports = userStore;