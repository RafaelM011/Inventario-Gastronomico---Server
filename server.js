import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import dotenv from "dotenv/config";

import Register from './controllers/Register.js';
import SignIn from './controllers/SignIn.js';
import { AddSucursal, ImportSucursales } from './controllers/ManageSucursales.js';
import { ImportIngredientes, AddIngredient, DecreaseIngredientAmount, RemoveIngredient, UpgradeIngredientInfo } from './controllers/ManageIngredient.js';
import { AddRecipe, ImportRecipes, UpdateRecipe } from './controllers/ManageRecipes.js';
import { ImportingXLSX, ReadFile, WriteFile } from './controllers/Excel.js';

import multer from 'multer';

//Server
const server = express();
const PORT = process.env.PORT ?? 4050;
const upload = multer({dest: 'uploads/'});
server.listen(PORT, () =>{
    console.log(`App is running on port ${PORT}`);
});

//CORS and Middleware
server.use(cors());
server.use(express.json());

//DATABASE using PostgreSQL
const database = knex({
    client: 'pg',
    connection: {
      host : process.env.PGHOST ?? '127.0.0.1',
      port : process.env.PGPORT ?? 4000,
      user : process.env.PGUSER ?? 'postgres',
      password : process.env.PGPASSWORD ?? process.env.POSTGRESQL_DATABASE_PASSWORD,
      database : process.env.PGDATABASE ?? 'Inventario'
    }
});

// Server startup
server.get('/', (req,res) => res.json("App is running properly"));

/* CREDENTIALS */

//Put data to register a new user
server.put('/register', Register(database, bcrypt));
//Post data to log in
server.post('/signin', SignIn(database, bcrypt));

/* INGREDIENTS*/ 

//Post data from database/excel
server.post('/importingredientes', ImportIngredientes(database));
//Put ingredients into database
server.put('/agregaringrediente', AddIngredient(database));
//Delete ingredients from database
server.delete('/removeingredient', RemoveIngredient(database));
//Decrease ingredientes from recipe info on database
server.post('/decreaseingredient', DecreaseIngredientAmount(database));
// Update ingredients info on database
server.post('/updateingredients', UpgradeIngredientInfo(database));

/* SUCURSALES */

//Post data from database/excel
server.post('/importsucursales', ImportSucursales(database));
//Post new sucursal to datbase
server.post('/addsucursal', AddSucursal(database));


/* RECIPES */

//Add recipe to database
server.put('/addrecipe', AddRecipe(database));
//Get recipes from database
server.post('/getrecipes', ImportRecipes(database));
//Update recipes on database
server.post('/updaterecipe', UpdateRecipe(database));

/* EXCEL */

//Read excel uploaded from client
server.get('/readexcel', ReadFile);
//Write excel from database info
server.get('/writeexcel', WriteFile(database));
server.post('/ImportXLSX', upload.single('file'),WriteFile(database));
 

// server.get('/download', (req,res) => {
//     res.download('./elliott-wave-principle.pdf')
// })