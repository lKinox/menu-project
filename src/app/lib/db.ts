import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config(); // Cargar .env en process.env

import { createPool } from 'mysql2/promise';

// Crea la conexión a la base de datos
const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Asegúrate de convertir a número
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Crear la tabla si no existe
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      price_discount DECIMAL(10, 2),
      img VARCHAR(255),
      avaible BOOLEAN DEFAULT true
    )
  `;
  await pool.execute(createTableQuery);
};

const createCompanyTable = async () => {
  const createCompanyTableQuery = `
    CREATE TABLE IF NOT EXISTS company (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      img VARCHAR(255),
      welcome_text TEXT,
      about TEXT,
      schedule TEXT,
      phone VARCHAR(255),
      email VARCHAR(255),
      whatsapp VARCHAR(255),
      facebook VARCHAR(255),
      instagram VARCHAR(255)
    )
  `;
  
  // Crear la tabla si no existe
  await pool.execute(createCompanyTableQuery);

  // Verificar si hay filas en la tabla
  const [rows]: any = await pool.execute('SELECT COUNT(*) AS count FROM company');

  // Solo inserta si la tabla está vacía
  if (rows[0].count === 0) {
    const createCompanyQuery = `
      INSERT INTO company (name, img, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // Inserta una fila con datos vacíos
    await pool.execute(createCompanyQuery, ["", "", "", "", "", "", "", "", "", ""]);
  }
};

// Función para crear la tabla de usuarios
export const createUsersTable = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  await pool.execute(createUsersTableQuery);

  // Verifica si existen registros
  const [rows]: any = await pool.execute('SELECT COUNT(*) AS count FROM users');

  if (rows[0].count === 0) { // Solo inserta si no hay usuarios
    const hashedPassword = await bcrypt.hash("test1234", 10); // Aquí se hash la contraseña
    const createUserQuery = `
      INSERT INTO users (email, password) VALUES (?, ?)
    `;
    await pool.execute(createUserQuery, ["test@test.com", hashedPassword]);
  }
};

const createCategoryTable = async () => {
  const createCategoryTableQuery = `
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;
  await pool.execute(createCategoryTableQuery);
};

// Modificar tabla products para agregar category_id
const modifyProductsTable = async () => {
  const alterProductsTableQuery = `
    ALTER TABLE products 
    ADD COLUMN category_id INT, 
    ADD FOREIGN KEY (category_id) REFERENCES category(id)
  `;
  await pool.execute(alterProductsTableQuery);
};


// Inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    await createTable();

    await createCategoryTable();

    await modifyProductsTable();

    await createCompanyTable();

  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
};

// Llama a initializeDatabase durante la inicialización de tu aplicación
initializeDatabase();

// Función para insertar un producto
export const insertProduct = async (name: string, description: string, price: number, price_discount: number, img: string, categoryId: number) => {
  const result = await pool.execute(
    'INSERT INTO products (name, description, price, price_discount, img, category_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, price_discount, img, categoryId]
  );
  
  const insertId = (result as any)[0].insertId;

  return insertId; // Devuelve el ID del producto insertado
};

// Función para obtener todos los productos
export const getAllProducts = async () => {
  const [rows] = await pool.execute('SELECT * FROM products');
  return rows;
};

export const getIdProduct = async (id: string) => {
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
  return rows;
};

export const putIdProduct = async (name: string, description: string, price: number, price_discount: number, img: string, avaible: number, categoryId: number, id: string) => {
  const put = await pool.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, price_discount = ?, img = ?, avaible = ?, category_id = ? WHERE id = ?',
    [name, description, price, price_discount, img, avaible, categoryId, id]
  );
  return put;
};

export const deleteProductById = async (id: string) => {
  const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return result; // Esto devolverá el resultado de la operación
};

export const getUser = async (email: string) => {
  await createUsersTable();
  const [result] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return [result]; // Esto devolverá el resultado de la operación
};

export const getCategory = async () => {
  const [rows] = await pool.execute('SELECT * FROM category');
  return rows;
};

export const postCategory = async (name: string) => {
  const result = await pool.execute(
    'INSERT INTO category (name) VALUES (?)', [name]
  );
  return result
};

export const deleteCategoryById = async (id: string) => {
  const [result] = await pool.execute('DELETE FROM category WHERE id = ?', [id]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return result; // Esto devolverá el resultado de la operación
};

export const getCompany = async () => {
  await createCompanyTable();
  const [rows] = await pool.execute('SELECT * FROM company');
  return rows;
};

export const updateCompany = async (name: string, img: string, welcome_text: string, about: string, schedule: string, phone: string, email: string, whatsapp: string, facebook: string, instagram: string) => {
  const result = await pool.execute(
    'UPDATE company SET name = ?, img = ?, welcome_text = ?, about = ?, schedule = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = 1', // Suponiendo que sólo hay una fila
    [name, img, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram]
  );
  return result;
};
