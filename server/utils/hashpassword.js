import bcrypt from "bcrypt"
export const Hashpassword = async (password) => {
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(`Error${error}`.bgMagenta);
  }
};
export const comparepassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
