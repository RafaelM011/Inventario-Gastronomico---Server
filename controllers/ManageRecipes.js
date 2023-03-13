export const ImportRecipes = (database) => (req,res) => {
    const {sucursal, usuario} = req.body;
    const condition = {
        usuario,
        sucursal
    }
    
    database('recetas').where(condition)
    .select('*').orderBy('nombre','asc')
    .then( data => res.json(data))
    .catch( err => res.status(400).json(err.message)); 
};

export const AddRecipe = (database) => (req,res) => {
    const {usuario, sucursal, nombre, cantidad, unidad, ingredientes} = req.body;
    const recipe = {
        usuario,
        sucursal,
        nombre,
        cantidad,
        unidad,
        ingredientes: JSON.stringify(ingredientes),
    };    
    const condition = {
        usuario,
        sucursal
    }

    database('recetas')
    .insert(recipe)
    .then( () => {
        database('recetas').where(condition)
        .select('*').orderBy('nombre','asc')
        .then( data => res.json(data))  
        .catch( err => res.status(400).json(err.message));   
    })  
    .catch( err => res.status(400).json(err.message)); 
};

export const DecreaseRecipeAmount = (database) => (req, res) => {
    const {usuario, sucursal, recetas, cantidades} = req.body;

    const request = async () => {
       await database.transaction( trx => {
            const queries = [];
            recetas.forEach( (nombre,i) => {
                const query = trx('recetas')
                .where({usuario, sucursal,nombre})
                .update({cantidad: cantidades[i]})
                .select('*')
                .transacting(trx)
                .catch( err => res.status(400).json(err.message));
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        });

        database('recetas').where({usuario, sucursal})
        .select('*').orderBy('nombre','asc')
        .then( data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };

    request();
};

export const UpdateRecipe = (database) => (req, res) => {
    const { recipes, sucursal } = req.body;

    const request = async () => {
        await database.transaction( trx => {
            const queries = [];
            recipes.forEach( recipe => {
                const query = trx('recetas')
                .where({id: recipe.id})
                .update({
                    nombre: recipe.nombre,
                    cantidad: recipe.cantidad,
                    unidad: recipe.unidad
                })
                .transacting(trx)  
                .catch( err => res.status(400).json(err.message))    ;           
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        });

        database('recetas').where({sucursal})   
        .select('*').orderBy('nombre','asc')
        .then (data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };
    request(); 
};