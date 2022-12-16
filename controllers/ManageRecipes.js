export const ImportRecipes = (database) => (req,res) => {
    const {sucursal} = req.body;
    
    database('recetas')
    .where({sucursal})
    .select('*')
    .then( data => res.json(data))
}

export const AddRecipe = (database) => (req,res) => {
    const {sucursal, nombre, ingredientes, cantidades} = req.body;
    const recipe = {
        sucursal,
        nombre,
        ingredientes,
        cantidades
    }    

    database('recetas')
    .insert(recipe)
    .then( () => {
        database('recetas').where({sucursal})
        .select('*')
        .then( data => res.json(data))    
    })  
}

export const UpdateRecipe = (database) => (req, res) => {
    const {id,nombre, ingredientes, cantidades, sucursal} = req.body;
    const updatedInfo = {
        nombre,
        ingredientes,
        cantidades
    }

    database('recetas')
    .where({id})
    .update(updatedInfo)
    .then( () => {
        database('recetas').where({sucursal})
        .select('*')
        .then( data => res.json(data));
    })
}