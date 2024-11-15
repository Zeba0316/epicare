const knex=require('knex');//package
const knexfile=require('./knexfile');//configuration-->object
const db=knex(knexfile);

module.exports=db;