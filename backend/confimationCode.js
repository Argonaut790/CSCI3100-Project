const randString = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%";
  let token = "";
  let len = Math.random() * (128 - 64) + 64;
  for (let i = 0; i < len; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

module.exports = randString;
