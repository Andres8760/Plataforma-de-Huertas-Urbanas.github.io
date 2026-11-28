// Copia solo los campos permitidos (evita que el cliente asigne campos como role o propietario)
function pick(obj, fields) {
  const out = {};
  for (const f of fields) {
    if (obj[f] !== undefined) out[f] = obj[f];
  }
  return out;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPagination(query, defaultLimit = 10) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
}

// C2: el admin gestiona todo; un usuario solo lo que le pertenece
function canManage(user, resource) {
  return user.role === 'admin' || resource.propietario.equals(user._id);
}

module.exports = { pick, escapeRegex, getPagination, canManage };
