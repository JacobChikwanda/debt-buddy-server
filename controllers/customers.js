const { customers, Sequelize } = require('../models');

const Op = Sequelize.Op;

/*** REGISTRATION CONTROLLER ***/
const createCustomer = async(req, res) => {
    const userData = req.body;
    userData.creatorId = req.user.id;
    
    try {

        // Check if user already exists
        const emailExists = await customers.findOne({where:{email: userData.email}});
        const numExists = await customers.findOne({where:{phoneNo: userData.phoneNo}});
        
        if (emailExists) {
            return res.json({message: 'A user with the provided email already exists.', success: false});
        }

        if (numExists) {
            return res.json({message: 'A user with the provided phone number already exists.', success: false});
        }

        // Create the user
        const newUser = await customers.create(userData);
        
        if (newUser) {

            return res.json({
                success: true,
                message: 'Customer added.'
            })
        } else {
            return res.json({message: 'User could not be created. Try again.', success: false})
        }
    } catch (error) {
        return res.json({message: `An error occured: ${error.message}`, success: false})
    }
}


/*** UPDATE USER CONTROLLER ***/

// Update user profile
const updateCustomerProfle = async (req, res) => {
    const {id} = req.params
    const userData = req.body

    try {

        customers.update(userData, {
            where: {
                id
            },
            individualHooks: true
        });
        return res.json({message: 'User details have been updated', success: true});
    } catch (error) {
        return res.json({message: 'User details not updated', success: false, error});
    }
}



/*** GET ALL customers CONTROLLER ***/
const getAllcustomers = async (req, res) => {     
    try {
        
        const yourCustomers = await customers.findAll({
            where: {
                creatorId: req.user.id
            }
        })
    
        return res.json({yourCustomers, success:true})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: 'customers could not be retrieved', error})
    }
}


const getCustomerById = async (req, res) => {
    const id = req.params.id    
    
    try {
        
        const user = await customers.findByPk(id, {
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
const deleteCustomer = async (req, res) => {
    const {id} = req.params;
 
    
    try {
        
        await customers.destroy({
            where: {id}
        });

        return res.json({message: 'Customer deleted.', success: true});
    } catch (error) {
        return res.json({success:false, message: 'Customer not deleted.', error})
    }

}


module.exports = {
    createCustomer,
    getAllcustomers,
    deleteCustomer,
    getCustomerById,
    updateCustomerProfle,
}