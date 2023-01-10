export const ImportSucursales = (database) => (req,res) => {
    const {username} = req.body;
    database('sucursales').where({username})
    .select('*')
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err.message)); 
};

export const AddSucursal = (database) => (req,res) => {
    const {user: username, sucursal: name} = req.body;

    database('sucursales').where({username})
    .insert({
        username,
        name
    })
    .then( () => {
        database('sucursales')
        .where({username})
        .select('*')
        .then(data => res.json(data))
        .catch( err => res.status(400).json(err.message));    
    })
    .catch( err => res.status(400).json(err.message));    
};
