import { Document, Schema } from 'mongoose';

export default interface IUser extends Document {
    email: string;
    password: string;
    isValidPassword( password: string): Promise<boolean | Error>;
}