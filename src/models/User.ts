export interface User {
    id?: number;
    name: string;
    email: string;
    mobile: string;
    gender: string;
    dob: string;
    access_token?: string;
    refresh_token?: string;
    device_key?: string;
    password: string;
    status: number;
  }
  