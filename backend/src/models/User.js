const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['usuario', 'admin'];

const userSchema = new Schema(
  {
    nombres: { type: String, required: [true, 'Los nombres son obligatorios'], trim: true, minlength: 2, maxlength: 60 },
    apellidos: { type: String, required: [true, 'Los apellidos son obligatorios'], trim: true, minlength: 2, maxlength: 60 },
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_.-]{3,30}$/, 'El usuario debe tener 3-30 caracteres (letras, números, . _ -)'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo no válido'],
    },
    password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'usuario' },
  },
  { timestamps: true }
);

// Hash de la contrasena (nunca se guarda en texto plano)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_ROUNDS) || 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = model('User', userSchema);
User.ROLES = ROLES;
module.exports = User;
