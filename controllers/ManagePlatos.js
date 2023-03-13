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
        database('platos').where({usuario, sucursal})
        .select('*').orderBy('nombre','asc')
        .then(data => res.json(data))
        .catch( err => res.status(400).json(err.message))
    })
    .catch(err => res.status(400).json(err.message))
}

export const UpdateDishes = (database) => (req, res) => {
    const { dishes, sucursal } = req.body;
   
    const request = async () => {
        await database.transaction( trx => {
            const queries = [];
            dishes.forEach( dish => {
                const query = trx('platos')
                .where({id: dish.id})
                .update({
                    nombre: dish.nombre,
                    ingredientes: JSON.stringify(dish.ingredientes),
                    recetas: JSON.stringify(dish.recetas)
                })
                .transacting(trx)  
                .catch( err => res.status(400).json(err.message))    ;           
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        });

        database('platos').where({sucursal})   
        .select('*').orderBy('nombre','asc')
        .then (data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };
    request(); 
};