const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5917;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: "user_kot_yamagishi",
  host: "localhost",
  database: "db_kot_yamagishi",
  password: "5Rw5YDaWc5jc",
  port: 5432,
});

// 動作確認用
app.get("/", (req, res) => {
  res.send("API server is running");
});

// DBから取得したデータを画面側が扱いやすい形式に変換
function formatCustomers(rows) {
  return rows.map((customer) => {
    return {
      id: customer.customer_id,
      customer_id: customer.customer_id,
      companyName: customer.company_name,
      company_name: customer.company_name,
      industry: customer.industry,
      contact: customer.contact,
      location: customer.location,
      created_date: customer.created_date,
      updated_date: customer.updated_date,
    };
  });
}

// 顧客一覧取得
// ブラウザ: /api_kot_yamagishi/customers
// Nginx経由でNode.jsには /customers として届く
app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        customer_id,
        company_name,
        industry,
        contact,
        location,
        created_date,
        updated_date
      FROM customers
      ORDER BY customer_id;
    `);

    const customers = formatCustomers(result.rows);
    res.json(customers);
  } catch (err) {
    console.error("顧客一覧取得エラー:", err);
    res.status(500).json({
      success: false,
      message: "顧客一覧取得時にエラーが発生しました",
      error: err.message,
    });
  }
});

// 念のため /customer/list でも取得できるようにする
app.get("/customer/list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        customer_id,
        company_name,
        industry,
        contact,
        location,
        created_date,
        updated_date
      FROM customers
      ORDER BY customer_id;
    `);

    const customers = formatCustomers(result.rows);
    res.json(customers);
  } catch (err) {
    console.error("顧客一覧取得エラー:", err);
    res.status(500).json({
      success: false,
      message: "顧客一覧取得時にエラーが発生しました",
      error: err.message,
    });
  }
});

// 顧客追加
// ブラウザ: /api_kot_yamagishi/add-customer
// Nginx経由でNode.jsには /add-customer として届く
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;

    const result = await pool.query(
      `
      INSERT INTO customers (
        company_name,
        industry,
        contact,
        location
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [companyName, industry, contact, location]
    );

    res.json({
      success: true,
      customer: result.rows[0],
    });
  } catch (err) {
    console.error("顧客追加エラー:", err);
    res.status(500).json({
      success: false,
      message: "顧客追加時にエラーが発生しました",
      error: err.message,
    });
  }
});

// 念のため /customer/add でも登録できるようにする
app.post("/customer/add", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;

    const result = await pool.query(
      `
      INSERT INTO customers (
        company_name,
        industry,
        contact,
        location
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [companyName, industry, contact, location]
    );

    res.json({
      success: true,
      customer: result.rows[0],
    });
  } catch (err) {
    console.error("顧客追加エラー:", err);
    res.status(500).json({
      success: false,
      message: "顧客追加時にエラーが発生しました",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
