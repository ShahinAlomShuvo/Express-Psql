import { Pool } from "pg";
import config from "./config";
import app from "./app";

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: Number(config.DB_PORT),
});

async function main() {
  try {
    app.listen(config.PORT, () => {
      console.log(`Express-PSQL app listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
export default pool;
