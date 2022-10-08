const bcrypt = require('bcryptjs');


const encripting = (password) => {
let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync(password, salt);
return hash;
}

exports.encripting = encripting;


