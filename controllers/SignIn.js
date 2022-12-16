const SignIn = (database, bcrypt) => (req, res) => {    
    const {username, password} = req.body;

    database('login').where({username})
    .select('hash')
    .then( data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid){
            database('users').where({username})
            .select('*')
            .then( data => {
                res.status(200).json(data[0]);
            })
        }else{
            res.status(400).json('Username or Password is incorrect');
        }
    })
    .catch( () => res.status(400).json('Username or Password is incorrect'));
}

export default SignIn