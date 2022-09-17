import Joi from 'joi';

const signUp = Joi.object({
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});


const signIn = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().required(),
});

export default { signUp, signIn };