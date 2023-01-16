export const fetchDishes = (database) => (req,res) => {
    const {usuario, sucursal} = req.body;
    const condition = {
        usuario,
        sucursal
    }
    database('platos').where(condition)
    .select('*').orderBy('nombre','asc')
    .then( data => res.json(data))
    .catch( err => res.status(400).json(err.message))
}

export const AddDish = (database) => (req, res) => {
    const {usuario, sucursal, nombre, ingredientes, recetas} = req.body;
    const dish = {
        usuario,
        sucursal,
        nombre,
        ingredientes: JSON.stringify(ingredientes),
        recetas: JSON.stringify(recetas)
    }
    
    database('platos')
    .insert(dish).
    then( () => {
        database('platos')
        .select('*').orderBy('nombre','asc')
        .then(data => res.json(data))
        .catch( err => res.status(400).json(err.message))
    })
    .catch(err => res.status(400).json(err.message))
}