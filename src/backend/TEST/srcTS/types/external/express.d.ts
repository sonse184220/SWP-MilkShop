import 'express';

declare module 'express' {
    interface User {
        id: string;
        password: string;
    }

    interface Request {
        user?: string;
    }
}
