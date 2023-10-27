import { Request } from 'express';

interface IReqUser {
    id: number;
    email: string;
}

export interface IGuardedRequest extends Request {
    user: IReqUser;
}
