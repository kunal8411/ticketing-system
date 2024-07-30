import {scrypt, randomBytes} from 'crypto'
import {promisify} from 'util'

const sCryptAsync = promisify(scrypt);
export class Password{
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        const buf = (await sCryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buffer = (await sCryptAsync(suppliedPassword, salt, 64)) as Buffer
        
  
        return buffer.toString('hex') === hashedPassword;
    }
}