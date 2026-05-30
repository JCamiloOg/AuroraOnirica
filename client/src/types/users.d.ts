interface User {
    id: number;
    username: string;
    password: string;
    status: 0 | 1;
    delete_at: string;
}

export type Login = {
    username: string;
    password: string;
}

export type UpdateUser = {
    username: string;
    password?: string;
}

