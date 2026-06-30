const bcrypt = require("bcryptjs");

const passwords = ["adminpass123", "userpass123"];

passwords.forEach((pw) => {
    const hash = bcrypt.hashSync(pw, 10);
    console.log(`${pw} -> ${hash}`);
});