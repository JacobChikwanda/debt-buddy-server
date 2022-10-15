const { users, Sequelize } = require('../models');

const bcrypt = require('bcryptjs');
const generateAccessToken = require('../misc/generateToken');

const Op = Sequelize.Op;

/*** REGISTRATION CONTROLLER ***/
const registerUser = async(req, res) => {
    const userData = req.body;
    
    try {

        // Check if user already exists
        const emailExists = await users.findOne({where:{email: userData.email}});
        
        if (emailExists) {
            return res.json({message: 'Email already used.', success: false});
        }

        // Create the user
        const newUser = await users.create(userData);
        
        if (newUser) {

            return res.json({
                success: true,
                message: 'Registration successful.'
            })
        } else {
            return res.json({message: 'User could not be created. Try again.', success: false})
        }
    } catch (error) {
        return res.json({message: `An error occured: ${error.message}`, success: false})
    }
}

/*** LOGIN CONTROLLER ***/
const authenticateUser = async (req, res) => {
    const {password, email} = req.body;

    try {
        const existingUser = await users.findOne({where:{email: email}});

        if (existingUser) {

            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if (passwordMatch) {

                return res.status(201).json({
                    user: {
                        id: existingUser.id,
                        name: existingUser.firstName + ' ' + existingUser.lastName,
                        email: existingUser.email,
                        token: generateAccessToken(existingUser.id)
                    },
                    success: true,
                    message: 'Login successful.'
                })
            } else {
                return res.json({message: 'Credentials are incorrect.', success: false})
            }
        } else {
            return res.json({message: 'User does not exist.', success: false})
        }
    } catch (error) {
        res.json({message: `An error occured`, success: false, error})
        console.log(`An error occured: ${error.message}`);
    }
}


/*** UPDATE USER CONTROLLER ***/

// Update user profile
const updateUserProfle = async (req, res) => {
    const {id} = req.params
    const userData = req.body

    try {
        
        users.update(userData, {
            where: {
                id
            },
            individualHooks: true
        });
        return res.json({message: 'Details updated', success: true});
    } catch (error) {
        return res.json({message: 'Details not updated', success: false, error});
    }
}



/*** GET ALL USERS CONTROLLER ***/
const getAllUsers = async (req, res) => {     
    try {
        
        const users = await users.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.id
                }
            },
            attributes: {
                exclude: ['password']
            }
        })
    
        return res.json({users, success:true})
    } catch (error) {
        return res.json({success:false, message: 'Users could not be retrieved', error})
    }
}


const getUserById = async (req, res) => {
    const id = req.params.id    
    
    try {
        
        const user = await users.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
        return res.json({user, success:true})
    } catch (error) {
        return res.json({success:false, message: 'User could not be retrieved', error})
    }
}

/*** DELETE USER BY ID CONTROLLER ***/
const deleteUser = async (req, res) => {
    const {id} = req.params;
 
    
    try {
        
        await users.destroy({
            where: {id}
        });

        return res.json({message: 'Deleted successfully.', success: true});
    } catch (error) {
        return res.json({success:false, message: 'User has not been deleted.', error})
    }

}


module.exports = {
    registerUser,
    authenticateUser,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUserProfle,
}
