import bcrypt from 'bcrypt'

const saltRounds = 10;

export const hashPassword = originalPassword =>
  bcrypt.hash(originalPassword, saltRounds);

export const compareHashed = (original, hashed) =>
  bcrypt.compare(original, hashed);
