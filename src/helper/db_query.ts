import database from "./../config/database.ts";

export const fetchAll = async (table: string): Promise<any[]> => {
    const { rows: data } = await database.execute(
      `SELECT * FROM ${table}`,
    );
    return data;
  };
  
  
  export const StoreData = async (table: string, item: any): Promise<number> => {
    const columns = Object.keys(item).join(', ');
    const values = Object.values(item);
    const placeholders = values.map(() => '?').join(', ');
  
    const result = await database.execute(
      `INSERT INTO ${table}(${columns}) VALUES (${placeholders})`,
      values,
    );
  
    return result.affectedRows;
  };
  
  export const findByID = async (table: string, id: any): Promise<any> => {
    const result = await database.query("SELECT * FROM ?? WHERE id = ?", [
      table,
      id,
    ]);
    return result;
  };
  
  export const updateData = async (table: string, item: any): Promise<number> => {
    const getData = await database.query("SELECT * FROM ?? WHERE id = ?", [
      table,
      item.id,
    ]);
  
    if (getData != null) {
      const updateData = await database.query(
        `UPDATE ?? SET name = ?, description = ? WHERE id = ?`,
        [table, item.name, item.description, item.id],
      );
      return updateData.affectedRows;
    } else {
      return 0;
    }
  };
  
  export const deleteByID = async (table: string, id: any): Promise<number> => {
    const result = await database.query("DELETE FROM ?? WHERE id = ?", [
      table,
      id,
    ]);
    return result.affectedRows || 0;
  };
  
  export const findByMobile = async (table: string, mobile: any): Promise<any> => {
    const result = await database.query("SELECT * FROM ?? WHERE mobile = ?", [
      table,
      mobile,
    ]);
    return result;
  };
  
  export const findByEmail = async (table: string, email: any): Promise<any> => {
    const result = await database.query("SELECT * FROM ?? WHERE email = ?", [
      table,
      email,
    ]);
    return result;
  };
  