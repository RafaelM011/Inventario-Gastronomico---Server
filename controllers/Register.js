const Register = (database, bcrypt) => (req, res) => {
    const {username, email, password} = req.body;
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    database.transaction( trx => {
        trx.insert({
            username,
            hash
        })
        .into('login')
        .returning('*')
        .then( data =>{
            trx.insert({
                username: data[0].username,
                email,
            })
            .into('users')
            .returning('*')
            .then( response => res.status(200).json(response[0]))
            .catch( err => res.status(400).json(err))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
}

export default Register;