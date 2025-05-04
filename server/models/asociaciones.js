const Usuario = require('./usuario');
const Ficha = require('./fichas');
const Agendamiento = require('../models/Agendamiento');
const FichaAprendiz = require('./FichaAprendiz');
const Bitacora = require('./Bitacora');
const Observacion = require('./observacion');
const Documento = require('./Documento');
const Empresa = require('./Empresa');
const Aprendiz = require('./Aprendiz');


// ⁡⁢⁢⁣​‌‌‍𝘙͟𝘦͟𝘭͟𝘢͟𝘤͟𝘪͟ó͟𝘯 𝘮͟𝘶͟𝘤͟𝘩͟𝘰͟𝘴 ͟𝘢 𝘮͟𝘶͟𝘤͟𝘩͟𝘰͟𝘴 𝘦͟𝘯͟𝘵͟𝘳͟𝘦 𝘜͟𝘴͟𝘶͟𝘢͟𝘳͟𝘪͟𝘰 ͟𝘺 𝘍͟𝘪͟𝘤͟𝘩͟𝘢​⁡
Usuario.belongsToMany(Ficha, {
  through: 'ficha_aprendiz',
  foreignKey: 'id_usuario',  // Se usa id_usuario directamente
  otherKey: 'id_ficha',
  as: 'fichas'
});

Ficha.belongsToMany(Usuario, {
  through: 'ficha_aprendiz',
  foreignKey: 'id_ficha',
  otherKey: 'id_usuario',  // Se usa id_usuario directamente
  as: 'aprendices'
});


// Relación FichaAprendiz → Ficha
FichaAprendiz.belongsTo(Ficha, {
  foreignKey: 'id_ficha',
  as: 'ficha'
});

Ficha.hasMany(FichaAprendiz, {
  foreignKey: 'id_ficha',
  as: 'fichasAprendiz'
});


//⁡⁣⁢⁣​‌‌‍𝙍͟𝙚͟𝙡͟𝙖͟𝙘͟𝙞͟𝙤͟𝙣͟𝙚͟𝙨 𝘼͟𝙜͟𝙚͟𝙣͟𝙙͟𝙖͟𝙢͟𝙞͟𝙚͟𝙣͟𝙩͟𝙤͟𝙨​⁡


Ficha.belongsToMany(Usuario, {
  through: FichaAprendiz,
  foreignKey: 'id_ficha',
  otherKey: 'id_usuario',  
  as: 'aprendicesAgendamiento'
});

// ✅ Un Agendamiento pertenece a una FichaAprendiz
Agendamiento.belongsTo(FichaAprendiz, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'ficha_aprendiz'
});

// ✅ Una FichaAprendiz tiene muchos Agendamientos
FichaAprendiz.hasMany(Agendamiento, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'agendamientos'
});

// ✅ Un Agendamiento pertenece a un Instructor (Usuario)
Agendamiento.belongsTo(Usuario, {
  foreignKey: 'id_instructor',
  as: 'instructor'
});

// ✅ Un Instructor (Usuario) tiene muchos Agendamientos
Usuario.hasMany(Agendamiento, {
  foreignKey: 'id_instructor',
  as: 'agendamientos'
});

FichaAprendiz.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'aprendiz' // Alias para acceder al aprendiz desde FichaAprendiz
});

// Relación directa para poder incluir fichasAprendiz desde Usuario (reporteAprendiz)
Usuario.hasMany(FichaAprendiz, {
  foreignKey: 'id_usuario',
  as: 'fichasAprendiz'
});

// Un usuario puede tener un aprendiz asociado
Usuario.hasOne(Aprendiz, {
  foreignKey: 'id_usuario',
  as: 'detalle_aprendiz'
});

Aprendiz.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Un aprendiz pertenece a una empresa
Aprendiz.belongsTo(Empresa, {
  foreignKey: 'id_empresa',
  as: 'empresa'
});

Empresa.hasMany(Aprendiz, {
  foreignKey: 'id_empresa',
  as: 'aprendices'
});



// ⁡⁢⁢⁢​‌‌‍𝙍͟𝙚͟𝙡͟𝙖͟𝙘͟𝙞͟𝙤͟𝙣 𝘽͟𝙞͟𝙩͟𝙖͟𝙘͟𝙤͟𝙧͟𝙖͟𝙨​⁡

FichaAprendiz.hasMany(Bitacora, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'bitacoras'
});

Bitacora.belongsTo(FichaAprendiz, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'fichaAprendiz'
});

// ⁡⁢⁣⁣​‌‌‍𝘙͟𝘦͟𝘭͟𝘢͟𝘤͟𝘪͟𝘰͟𝘯 𝘖͟𝘣͟𝘴͟𝘦͟𝘳͟𝘷͟𝘢͟𝘤͟𝘪͟𝘰͟𝘯͟𝘦͟𝘴​⁡

Usuario.hasMany(Observacion, {
  foreignKey: 'id_usuario',
  as: 'observacionesCreadas'
});

Observacion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuarioCreador'
});


//⁡⁣⁣⁢​‌‌‍𝘙͟𝘦͟𝘭͟𝘢͟𝘤͟𝘪͟𝘰͟𝘯 𝘋͟𝘰͟𝘤͟𝘶͟𝘮͟𝘦͟𝘯͟𝘵͟𝘰͟𝘴​⁡
FichaAprendiz.hasMany(Documento, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'documentos'
});

Documento.belongsTo(FichaAprendiz, {
  foreignKey: 'id_ficha_aprendiz',
  as: 'fichaAprendiz'
});


module.exports = { Usuario, Ficha, Agendamiento,FichaAprendiz, Bitacora, Observacion, Documento };