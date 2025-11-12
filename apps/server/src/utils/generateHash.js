import bcrypt from "bcrypt"

const saltRounds = 12;

async function generateHash(str) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(str, salt);
    return hash;
}

export default generateHash