import pool from '#config/database.js';

const TABLE_NAME = 'users';

const authRepository = {
  async findUserByEmail(email) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE email = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  }
};

export default authRepository;