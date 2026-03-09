import { writeFile, readFile, access } from "node:fs/promises";
import bcrypt from "bcrypt";

const PASSWORD_FILE = "password.txt";
const saltRounds = 4;
const inputPassword = process.argv[2]; //приймає значення node hash.js <password>

async function fileExists() {
    try {
        await access('password.txt');
        return true;
    } catch {
        return false;
    }
}

async function checkPassword(password) {
    const exists = await fileExists(PASSWORD_FILE);
    if (!exists) {
        const hash = await bcrypt.hash(password, saltRounds);
        await writeFile(PASSWORD_FILE, hash);
        console.log("Файл не існував. Пароль збережено.");
        return;
    }

    const storedHash = (await readFile(PASSWORD_FILE, "utf8")).trim();

    if (!storedHash) {
        const hash = await bcrypt.hash(password, saltRounds);
        await writeFile(PASSWORD_FILE, hash);
        console.log("Файл був пустий. Пароль збережено.");
        return;
    }

    const isValid = await bcrypt.compare(password, storedHash);
    if (isValid) {
        console.log("Пароль правильний");
    } else {
        console.log("Пароль неправильний");
    }
}

await checkPassword(inputPassword);
