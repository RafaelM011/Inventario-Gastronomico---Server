import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import dotenv from "dotenv/config";

import Register from './controllers/Register.js';
import SignIn from './controllers/SignIn.js';
import { ImportSucursales, ImportIngredientes } from './controllers/Import.js';
import { AddIngredient, DecreaseIngredientAmount, RemoveIngredient, UpgradeIngredientInfo } from './controllers/ManageIngredient.js';
import { AddRecipe, ImportRecipes, UpdateRecipe } from './controllers/ManageRecipes.js';
import { ReadFile } from './controllers/Excel.js';

//Server
const server = express();
const PORT = 4000;
server.listen(PORT || 3000, () =>{
    console.log(`App is running on port ${PORT}`);
});

//CORS and Middleware
server.use(cors());
server.use(express.json());

//DATABASE using PostgreSQL
const database = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : process.env.POSTGRESQL_DATABASE_PASSWORD,
      database : 'Inventario'
    }
})

// Get Request, testing
server.get('/', (req,res) => res.json("It's working!"));
//Put data to register a new user
server.put('/register', Register(database, bcrypt));
//Post data to log in
server.post('/signin', SignIn(database, bcrypt)) ;
//Post data from database/excel
server.post('/importingredientes', ImportIngredientes(database));
//Post data from database/excel
server.post('/importsucursales', ImportSucursales(database));
//Put ingredients into database
server.put('/agregaringrediente', AddIngredient(database));
//Delete ingredients from database
server.delete('/removeingredient', RemoveIngredient(database));
//Decrease ingredientes from recipe info on database
server.post('/decreaseingredient', DecreaseIngredientAmount(database));
// Update ingredients info on database
server.post('/updateingredients', UpgradeIngredientInfo(database));
//Add recipe to database
server.put('/addrecipe', AddRecipe(database));
//Get recipes from database
server.post('/getrecipes', ImportRecipes(database));
//Update recipes on database
server.post('/updaterecipe', UpdateRecipe(database));
//Get excel from server
server.get('/getexcel', ReadFile);

server.get('/download', (req,res) => {
    res.download('./elliott-wave-principle.pdf')
})