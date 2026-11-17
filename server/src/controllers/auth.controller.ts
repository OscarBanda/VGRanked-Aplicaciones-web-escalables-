import { Request, Response } from 'express';
import crypto from 'crypto';
import { UserModel } from '../models/user.model.js';

// Hasheo seguro de contraseñas usando scrypt (Nativo de Node.js, resistente y seguro)
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  if (!storedHash) return false;

  // Si tiene el formato salt:derivedKey
  if (storedHash.includes(':')) {
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }

  // Fallback por si existían registros previos en texto plano
  return storedHash === password;
};

// Registro de usuario
export const registrarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, correo, email, password, contraseña, foto_perfil, image } = req.body;

    const finalUsername = (username || '').trim();
    const finalCorreo = (correo || email || '').trim().toLowerCase();
    const finalPassword = password || contraseña || '';
    const finalFoto = foto_perfil || image || '';

    // Validaciones
    if (!finalUsername) {
      res.status(400).json({ mensaje: 'El nombre de usuario es obligatorio' });
      return;
    }

    if (!finalCorreo) {
      res.status(400).json({ mensaje: 'El correo electrónico es obligatorio' });
      return;
    }

    if (!finalPassword || finalPassword.length < 6) {
      res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Verificar si el correo o username ya están en uso
    const usuarioExistente = await UserModel.findOne({
      $or: [
        { correo: finalCorreo },
        { email: finalCorreo },
        { username: finalUsername }
      ]
    }).lean();

    if (usuarioExistente) {
      if ((usuarioExistente.correo === finalCorreo || usuarioExistente.email === finalCorreo)) {
        res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
        return;
      }
      if (usuarioExistente.username.toLowerCase() === finalUsername.toLowerCase()) {
        res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
        return;
      }
    }

    // Hashear contraseña
    const hashedPassword = hashPassword(finalPassword);

    // Crear nuevo usuario
    const nuevoUsuario = new UserModel({
      username: finalUsername,
      email: finalCorreo,
      correo: finalCorreo,
      password: hashedPassword,
      foto_perfil: finalFoto,
      rol: 'usuario',
    });

    const guardado = await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        _id: guardado._id,
        id: guardado._id,
        username: guardado.username,
        correo: guardado.correo || guardado.email,
        email: guardado.email || guardado.correo,
        foto_perfil: guardado.foto_perfil,
        rol: guardado.rol,
      }
    });
  } catch (error) {
    console.error('[registrarUsuario] Error:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario en el servidor', error });
  }
};

// Login de usuario
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, email, username, password, contraseña } = req.body;

    const identificador = (correo || email || username || '').trim().toLowerCase();
    const passIngresada = password || contraseña || '';

    if (!identificador || !passIngresada) {
      res.status(400).json({ mensaje: 'Debes proporcionar correo o usuario y tu contraseña' });
      return;
    }

    // Buscar por correo, email o username en la colección users
    const usuario = await UserModel.findOne({
      $or: [
        { correo: identificador },
        { email: identificador },
        { username: identificador }
      ]
    });

    if (!usuario) {
      res.status(401).json({ mensaje: 'Credenciales inválidas: usuario o correo no encontrado' });
      return;
    }

    // Validar contraseña hasheada
    const passwordValida = verifyPassword(passIngresada, usuario.password);

    if (!passwordValida) {
      res.status(401).json({ mensaje: 'Credenciales inválidas: contraseña incorrecta' });
      return;
    }

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        _id: usuario._id,
        id: usuario._id,
        username: usuario.username,
        correo: usuario.correo || usuario.email,
        email: usuario.email || usuario.correo,
        foto_perfil: usuario.foto_perfil,
        rol: usuario.rol,
      }
    });
  } catch (error) {
    console.error('[loginUsuario] Error:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};

// Obtener perfil por ID
export const obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = await UserModel.findById(req.params.id).select('-password');
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
      return;
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar perfil', error });
  }
};
