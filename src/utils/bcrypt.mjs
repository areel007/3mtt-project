import bcrypt from "bcrypt";

export const hashPassword = async (password, salt) => {
  const gSalt = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(password, gSalt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
