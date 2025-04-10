import dotenv from 'dotenv';

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
      img INT
    )
  `;
  await pool.execute(createTableQuery);
};

// Inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    await createTable();
    console.log('Tabla "products" verificada o creada.');
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
};

// Llama a initializeDatabase durante la inicialización de tu aplicación
initializeDatabase();

// Función para insertar un producto
export const insertProduct = async (name: string, description: string, price: number, img: string) => {
  const result = await pool.execute(
    'INSERT INTO products (name, description, price, img) VALUES (?, ?, ?, ?)',
    [name, description, price, img]
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

export const putIdProduct = async (name: string, description: string, price: number, img: string, id: string) => {
  const put = await pool.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, img = ? WHERE id = ?',
    [name, description, price, img, id]
  );
  return put;
};

export const deleteProductById = async (id: string) => {
  const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return result; // Esto devolverá el resultado de la operación
};
