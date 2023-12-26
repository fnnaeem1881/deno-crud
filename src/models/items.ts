import database from "./../config/database.ts";

export interface Item {
  id?: string;
  name: string;
  description: string;
}