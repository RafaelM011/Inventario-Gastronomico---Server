export const AddIngredient = (database) => (req, res) => {
    const {ingredientes} = req.body;   
    const request = async () => {
        await database.transaction( trx => {
            const queries = []
            ingredientes.forEach( ingrediente => {
                delete ingrediente.id;
                const query = trx('ingredientes')
                .insert(ingrediente)
                .select('*')
                .transacting(trx)                
                queries.push(query);
            })

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback)
        })

        database('ingredientes')
        .select('*')
        .then (data => res.json(data))
    }
    request();
}

export const RemoveIngredient = (database) => (req, res) => {
    const {sucursal, nombre} = req.body;
    const ingredientToRemove = {
        sucursal,
        nombre
    }

    database('ingredientes')
    .where(ingredientToRemove)
    .del()
    .then( () => {
        database('ingredientes')
        .select('*')
        .then( data => res.json(data))
    })
}

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
                .transacting(trx);
                queries.push(query);
            });

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback)
        })

        database('ingredientes')
        .select('*')
        .then( data => res.json(data));
    }

    request();
}

export const UpgradeIngredientInfo = (database) => (req, res) => {
    const { ingredients } = req.body;

    const request = async () => {
        await database.transaction( trx => {
            const queries = []
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
                queries.push(query);
            })

            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback)
        })

        database('ingredientes')
        .select('*')
        .then (data => res.json(data))
    }
    request();
}