export const ImportIngredientes = (database) => (req,res) => {
    const {sucursal} = req.body;
    database('ingredientes').where({sucursal})
    .select('*')
    .then( data => res.json(data))
    .catch( err => res.status(400).json(err.message)) ;
};

export const AddIngredient = (database) => (req, res) => {
    const {ingredientes} = req.body;
    const {sucursal} = ingredientes[0];   
    const request = async () => {
        await database.transaction( trx => {
            const queries = [];
            ingredientes.forEach( ingrediente => {
                delete ingrediente.id;
                const query = trx('ingredientes')
                .insert(ingrediente)
                .select('*')
                .transacting(trx)
                .catch( err => res.status(400).json(err.message)) ;               
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        });

        database('ingredientes').where({sucursal})
        .select('*')
        .then (data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };
    request();
};

export const RemoveIngredient = (database) => (req, res) => {
    const {sucursal, nombre} = req.body;
    const ingredientToRemove = {
        sucursal,
        nombre
    };

    database('ingredientes')
    .where(ingredientToRemove)
    .del()
    .then( () => {
        database('ingredientes')
        .select('*')
        .then( data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    })
    .catch( err => res.status(400).json(err.message)); 
};

export const DecreaseIngredientAmount = (database) => (req, res) => {
    const {sucursal, ingredientes, cantidades} = req.body;
    
    const request = async () => {
       await database.transaction( trx => {
            const queries = [];
            ingredientes.forEach( (nombre,i) => {
                const query = trx('ingredientes')
                .where({sucursal,nombre})
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

        database('ingredientes').where({sucursal})
        .select('*')
        .then( data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };

    request();
};

export const UpgradeIngredientInfo = (database) => (req, res) => {
    const { ingredients, sucursal } = req.body;

    const request = async () => {
        await database.transaction( trx => {
            const queries = [];
            ingredients.forEach( ingrediente => {
                const query = trx('ingredientes')
                .where({id: ingrediente.id})
                .update({
                    nombre: ingrediente.nombre,
                    precio: ingrediente.precio,
                    cantidad: ingrediente.cantidad,
                    unidad: ingrediente.unidad
                })
                .transacting(trx)  
                .catch( err => res.status(400).json(err.message))    ;           
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        });

        database('ingredientes').where({sucursal})
        .select('*')
        .then (data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };
    request();
};