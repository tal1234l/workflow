module.exports.inputValidation = function(name, password, res)
    {
         if(!name || !password)
            return res.status(401).send({message:'wrong user name or password'});
    };
