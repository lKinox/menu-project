import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // Cargar .env en process.env

import mysql, { createPool, RowDataPacket } from 'mysql2/promise';

const client_id =  process.env.CLIENT_ID;
const client_pass =  process.env.CLIENT_PASS;

interface Company {
  id: string; // Cambia a string si el id es un UUID, o al tipo correspondiente
  client_id: string;
  name: string;
  img: string;
  welcome_text: string;
  about: string;
  schedule: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

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
      id VARCHAR(255) PRIMARY KEY,
      client_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      price_discount DECIMAL(10, 2),
      img VARCHAR(255),
      available BOOLEAN DEFAULT true,
      category_id VARCHAR(255),  -- Debe coincidir con el tipo de dato de category.id
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
    )
  `;
  await pool.execute(createTableQuery);
};

const createCompanyTable = async () => {
  const createCompanyTableQuery = `
    CREATE TABLE IF NOT EXISTS company (
      id VARCHAR(255) PRIMARY KEY,
      client_id VARCHAR(255) NOT NULL,
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

  const uniqueId = uuidv4();

  // Verificar si hay filas en la tabla
  const [rows]: any = await pool.execute('SELECT COUNT(*) AS count FROM company');

  // Solo inserta si la tabla está vacía
  if (rows[0].count === 0) {
    const createCompanyQuery = `
      INSERT INTO company (id, client_id, name, img, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // Inserta una fila con datos vacíos
    await pool.execute(createCompanyQuery, [uniqueId, client_id, "", "", "", "", "", "", "", "", "", ""]);
  }
};

// Función para crear la tabla de usuarios
export const createUsersTable = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_id VARCHAR(255) NOT NULL,
      user VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  await pool.execute(createUsersTableQuery);

  // Verifica si existen registros
  const [rows]: any = await pool.execute('SELECT COUNT(*) AS count FROM users WHERE client_id = ?', [client_id]);

  if (rows[0].count === 0) { // Solo inserta si no hay usuarios
    const password = String(client_pass)
    const hashedPassword = await bcrypt.hash(password, 10); // Aquí se hash la contraseña
    const createUserQuery = `
      INSERT INTO users (client_id, user, password) VALUES (?, ?, ?)
    `;
    await pool.execute(createUserQuery, [client_id, client_id, hashedPassword]);
  }
};

const createCategoryTable = async () => {
  const createCategoryTableQuery = `
    CREATE TABLE IF NOT EXISTS category (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      client_id VARCHAR(255) NOT NULL
    )
  `;
  await pool.execute(createCategoryTableQuery);
};


// Inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    await createCategoryTable();

    await createUsersTable();

    await createTable();

  } catch (error) {
    console.error('Error al crear la tabla:', error);
  }
};

// Llama a initializeDatabase durante la inicialización de tu aplicación
initializeDatabase();

// Función para insertar un producto
export const insertProduct = async (name: string, description: string, price: number, price_discount: number, img: string, categoryId: string) => {
  const uniqueId = uuidv4();
  const result = await pool.execute(
    'INSERT INTO products (id, name, client_id, description, price, price_discount, img, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [uniqueId, name, client_id ,description, price, price_discount, img, categoryId]
  );
  
  const insertId = (result as any)[0].insertId;

  return insertId; // Devuelve el ID del producto insertado
};

// Función para obtener todos los productos
export const getAllProducts = async () => {
  await createTable();
  const [rows] = await pool.execute('SELECT * FROM products WHERE client_id = ?', [client_id]);
  return rows;
};

export const getIdProduct = async (id: string) => {
  const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? and client_id = ?', [id, client_id]);
  return rows;
};

export const putIdProduct = async (name: string, description: string, price: number, price_discount: number, img: string, available: number, categoryId: string, id: string) => {
  const put = await pool.execute(
    'UPDATE products SET name = ?, client_id = ?, description = ?, price = ?, price_discount = ?, img = ?, available = ?, category_id = ? WHERE id = ?',
    [name, client_id, description, price, price_discount, img, available, categoryId, id]
  );
  return put;
};

export const deleteProductById = async (id: string) => {
  const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return result; // Esto devolverá el resultado de la operación
};

export const getUser = async (user: string) => {
  await createUsersTable();
  const [result] = await pool.execute('SELECT * FROM users WHERE user = ? and client_id = ?', [user, client_id]);
  // Puedes optar por verificar el número de filas afectadas si es necesario
  return [result]; // Esto devolverá el resultado de la operación
};

export const getCategory = async () => {
  await createCategoryTable()
  const [rows] = await pool.execute('SELECT * FROM category WHERE client_id = ?', [client_id]);
  return rows;
};

export const postCategory = async (name: string) => {
  const uniqueId = uuidv4();
  const result = await pool.execute(
    'INSERT INTO category (id, name, client_id) VALUES (?,?, ?)', [uniqueId, name, client_id]
  );
  return result
};

export const deleteCategoryById = async (id: string) => {
  const [result] = await pool.execute('DELETE FROM category WHERE id = ? and client_id = ?', [id, client_id]);
  return result;
};

// Cambia el significado del retorno a QueryResult y RowDataPacket[]
export const getCompany = async (): Promise<Company[]> => {
  await createCompanyTable(); // Asegúrate de que la tabla esté creada

  // Ejecuta la consulta
  const [rows]: [RowDataPacket[], mysql.FieldPacket[]] = await pool.execute('SELECT * FROM company WHERE client_id = ?', [client_id]);

  // Convierte las filas a Company[]
  return rows as Company[]; // Tipo de conversión
};

// Función para actualizar la compañía
export const updateCompany = async (
  name: string,
  img: string,
  welcome_text: string,
  about: string,
  schedule: string,
  phone: string,
  email: string,
  whatsapp: string,
  facebook: string,
  instagram: string
) => {
  const companies = await getCompany(); // Se espera obtener la compañía del client_id

  if (companies.length === 0) {
    throw new Error(`Company not found for client_id: ${client_id}`); // Manejo si no se encuentra la compañía
  }

  const id = companies[0].id; // Asignar el ID de la primera compañía encontrada

  // Ejecutar la actualización
  const result = await pool.execute(
    'UPDATE company SET name = ?, img = ?, welcome_text = ?, about = ?, schedule = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = ?',
    [
      name,
      img,
      welcome_text,
      about,
      schedule,
      phone,
      email,
      whatsapp,
      facebook,
      instagram,
      id, // Usar el ID recuperado
    ]
  );

  return result; // Retornar el resultado de la operación de actualización
};