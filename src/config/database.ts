import {
  ClientMySQL,
  ClientPostgreSQL,
  ClientSQLite,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.11/mod.ts";

import { Client } from "https://deno.land/x/mysql/mod.ts";
const database = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "deno",
  password: "",
});

// await database.execute(`DROP TABLE IF EXISTS items`);
await database.execute(`
    CREATE TABLE IF NOT EXISTS items (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NULL,
        description text NULL,
        created_at timestamp not null default current_timestamp,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

// await database.execute(`DROP TABLE IF EXISTS users`);
await database.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NULL,
        email varchar(100) NULL,
        mobile varchar(100) NULL,
        gender varchar(100) NULL,
        dob varchar(100) NULL,
        access_token text NULL,
        refresh_token text NULL,
        device_key text NULL,
        password varchar(100) NULL,
        status int(11) not NULL default 1,
        created_at timestamp not null default current_timestamp,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

await database.execute(`
    CREATE TABLE IF NOT EXISTS trips (
        id INT(11) NOT NULL AUTO_INCREMENT,
        car_name VARCHAR(100) NULL,
        pick_up_location VARCHAR(100) NULL,
        destination VARCHAR(100) NULL,
        driver_id INT(11) NULL,
        user_id INT(11),
        status INT(11) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (driver_id) REFERENCES users(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

export default database
