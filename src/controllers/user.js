import mysql2 from 'mysql2/promise';
import connectionConfig from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createConnection = async ( ) => {
    return await mysql2.createConnection(connectionConfig);
}

const getUsuarios = async (req, res) => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT 
        w.*, 
        d.name_dep AS department_name 
      FROM 
        Workers w
      LEFT JOIN 
        Department d ON w.department_id = d.ID
    `);

    await connection.end();

    return res.status(200).json({
      success: true,
      usuarios: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Problemas al traer los usuarios",
      code: error
    });
  }
};


const addContact = async (req, res) => {
  const { Name, email, Phone, Commune, job, project } = req.body;
  const name = Name;
  const phone = Phone;
  const commune = Commune;
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios: name, email o phone"
    });
  }

  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      `INSERT INTO Contacts (Name, email, Phone, Commune, job, project) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, commune, job, project]
    );
    await connection.end();

    return res.status(201).json({
      success: true,
      message: "Usuario insertado correctamente",
      insertedId: result.insertId
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Problemas al insertar el usuario",
      code: error
    });
  }
};


const getContacts = async ( req, res ) => {
  try {
      
      const connection = await createConnection();
      const [rows] = await connection.execute('SELECT * FROM Contacts');
      await connection.end();

      return res.status(200).json({
          success: true,
          usuarios: rows
      });

  } catch (error) {
      return res.status(500).json({
          status: false,
          error: "Problemas al traer los usuarios",
          code: error
      });
  }
};

// editar contactos

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { Name, email, Phone, Commune, job, project } = req.body;
  const name = Name;
  const phone = Phone;
  const commune = Commune;

  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      `UPDATE Contacts SET Name = ?, email = ?, Phone = ?, Commune = ?, job = ?, project = ? WHERE ID = ?`,
      [name, email, phone, commune, job, project, id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Contacto actualizado correctamente'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Problemas al actualizar el contacto",
      code: error
    });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      'DELETE FROM Contacts WHERE ID = ?',
      [id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Contacto eliminado correctamente'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Problemas al eliminar el contacto",
      code: error
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Workers WHERE mail = ?', 
      [email]
    );
    await connection.end();

    if (rows.length === 1) {
      const user = rows[0];

      // Comparar la contraseña ingresada con el hash almacenado
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ id: user.ID }, 'secret-key', { expiresIn: '12h' });

        return res.status(200).json({
          success: true,
          message: "Inicio de sesión exitoso",
          token: token,
          name: user.Name,
          email: user.mail,
          department_id: user.department_id,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Correo electrónico o contraseña incorrectos"
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        error: "Correo electrónico o contraseña incorrectos"
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      status: false,
      error: "Problemas al iniciar sesión",
      code: error
    });
  }
};



const updateUser = async (req, res) => {
  try {
    const { email, password, edad, altura, peso, exercise_level } = req.body;

    // Comprobar que el correo electrónico y la contraseña están presentes
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM userapp WHERE email = ?', [email]);

    if (rows.length === 1) {
      const user = rows[0];

      // Verificar la contraseña
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        await connection.end();
        return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
      }

      // Actualizar solo los campos que se proporcionaron
      const fieldsToUpdate = { edad, altura, peso, exercise_level };
      for (const field in fieldsToUpdate) {
        if (fieldsToUpdate[field] !== undefined) {
          await connection.execute(`UPDATE userapp SET ${field} = ? WHERE email = ?`, [fieldsToUpdate[field], email]);
        }
      }

      await connection.end();

      return res.status(200).json({
        success: true,
        message: "Información del usuario actualizada con éxito"
      });
    } else {
      await connection.end();
      return res.status(401).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Problemas al actualizar la información del usuario",
      code: error
    });
  }
}
//cambiar la contraseña del usuario

const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM userapp WHERE email = ?', [email]);

    if (rows.length === 1) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute('UPDATE userapp SET password = ? WHERE email = ?', [hashedPassword, email]);
      await connection.end();

      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada con éxito"
      });
    } else {
      await connection.end();
      return res.status(401).json({
        success: false,
        error: "Correo electrónico no encontrado"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Problemas al actualizar la contraseña",
      code: error
    });
  }
};


const getDepartamentosUsuarios = async (req, res) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'No token' });

    // Decodificar el token
    const decoded = jwt.verify(token, 'secret-key');
    const userId = decoded.id;

    const connection = await createConnection();

    // Buscar SOLO los departamentos del usuario autenticado
    const [rows] = await connection.execute(`
      SELECT 
        ID, Name, department_id 
      FROM 
        Workers
      WHERE
        ID = ?
    `, [userId]);

    await connection.end();

    return res.status(200).json({
      success: true,
      departamentos: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Problemas al traer los department_id de los usuarios",
      code: error
    });
  }
};


export {
    login,
    getUsuarios,
    updateUser,
    changePassword,
    getContacts,
    updateContact,
    addContact,
    deleteContact,
    getDepartamentosUsuarios
};

