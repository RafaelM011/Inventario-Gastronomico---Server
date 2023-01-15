export const ImportRecipes = (database) => (req,res) => {
    const {sucursal} = req.body;
    
    database('recetas').where({sucursal})
    .select('*')
    .then( data => res.json(data))
    .catch( err => res.status(400).json(err.message)); 
};

export const AddRecipe = (database) => (req,res) => {
    const {sucursal, nombre, ingredientes, cantidades, unidades} = req.body;
    const recipe = {
        sucursal,
        nombre,
        ingredientes: `{${ingredientes}}`,
        cantidades: `{${cantidades}}`,
        unidades: `{${unidades}}`
    };    


    database('recetas')
    .insert(recipe)
    .then( () => {
        database('recetas').where({sucursal})
        .select('*')
        .then( data => res.json(data))  
        .catch( err => res.status(400).json(err.message));   
    })  
    .catch( err => res.status(400).json(err.message)); 
};

export const UpdateRecipe = (database) => (req, res) => {
    const {id,nombre, ingredientes, cantidades, unidades, sucursal} = req.body;
    const updatedInfo = {
        nombre,
        ingredientes,
        cantidades,
        unidades
    };

    database('recetas')
    .where({id})
    .update(updatedInfo)
    .then( () => {
        database('recetas').where({sucursal})
        .select('*')
        .then( data => res.json(data))
        .catch( err => res.status(400).json(err.message)); 
    })
    .catch( err => res.status(400).json(err.message)); 
};