export const ImportIngredientes = (database) => (req,res) => {
    const {usuario, sucursal} = req.body;
    const condition = {
        usuario,
        sucursal
    }

    database('ingredientes').where(condition)
    .select('*').orderBy('nombre','asc')
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
        .select('*').orderBy('nombre','asc')
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
        .select('*').orderBy('nombre','asc')
        .then( data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    })
    .catch( err => res.status(400).json(err.message)); 
};

export const DecreaseIngredientAmount = (database) => (req, res) => {
    const {usuario, sucursal, ingredientes, cantidades} = req.body;

    const request = async () => {
       await database.transaction( trx => {
            const queries = [];
            ingredientes.forEach( (nombre,i) => {
                const query = trx('ingredientes')
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

        database('ingredientes').where({usuario, sucursal})
        .select('*').orderBy('nombre','asc')
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
        .select('*').orderBy('nombre','asc')
        .then (data => res.json(data))
        .catch( err => res.status(400).json(err.message)) ;
    };
    request();
};