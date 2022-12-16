export const ImportIngredientes = (database) => (req,res) => {
    const {sucursal} = req.body;
    database('ingredientes').where({sucursal})
    .select('*')
    .then( data => res.json(data))
}

export const ImportSucursales = (database) => (req,res) => {
    const {username} = req.body;
    database('sucursales').where({username})
    .select('*')
    .then(data => res.json(data))
}