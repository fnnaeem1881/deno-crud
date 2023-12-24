import database from "./../config/database.ts";

export interface Item {
  id?: string;
  name: string;
  description: string;
}

export const fetchAll = async (): Promise<number> => {
  const { rows: users } = await database.execute(
    `select * from items`,
  );
  return users;
};

export const create = async (item: Item): Promise<number> => {
  const result = await database.execute(
    `INSERT INTO items(name, description) VALUES (?, ?)`,
    [item.name, item.description],
  );
  return result.affectedRows;
};

export const findByID = async (id: any): Promise<number> => {
  const result = await database.query("select * from ?? where id = ?", [
    "items",
    id,
  ]);
  return result;
};
export const update = async (item: Item): Promise<number> => {
  const getData = await database.query("select * from items where id = ?", [
    item.id,
  ]);
  if (getData != null) {
    const updateData = await database.query(
      "UPDATE items SET name = ?, description = ? WHERE id = ?",
      [item.name, item.description, item.id],
    );
    return updateData;
  } else {
    return 0;
  }
};

export const deleteByID = async (id: any): Promise<number> => {
    const result = await database.query("DELETE FROM ?? WHERE id = ?", ["items", id]);
    return result.affectedRows || 0;
};