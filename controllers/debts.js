const { DEBTS_LABEL } = require('../misc/Constants');
const { debts, customers, Sequelize } = require('../models');

const deleteDebt = async (req, res) => {
    const { id } = req.params;

    try {

        await debts.destroy({ where: {id} });

        res.json({message: 'Debt has been deleted', success: true});
    } catch (error) {
        return res.json({message: 'Debt could not be deleted.', success: false});
    }
}

const createDebt =  async (req, res) => {
    const data = req.body;
    data.debtsOwner = req.user.id;
    
    try {
        await debts.create(data);
        return res.json({message: 'New debt record created', success: true})
    } catch (error) {
        return res.json({message: 'Debt record could not be created. Try again.', success: false});
    }
}

const updateDebt = async (req, res) => {
    const {id} = req.params;
    try {
        const debt = await debts.findOne({where: {id}});
        debt.status = DEBTS_LABEL.paid;
        debt.save()
        return res.json({message: 'Debt record updated', success: true})
    } catch (error) {
        return res.json({message: 'Debt record not updated', success: false})
    }
}

const getDebts = async (req, res) => {
    // all Requests
    // try {
        const alldebts = await debts.findAll({
            where: {
                debtsOwner: req.user.id
            },
            include: [
                {
                    model: customers,
                    attributes: ['firstName', 'lastName', 'email', 'phoneNo']
                },
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        const pendingDebts = await debts.findAll({
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            },
            include: [
                {
                    model: customers,
                    attributes: ['firstName', 'lastName', 'email', 'phoneNo']
                },
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        const paidDebts = await debts.findAll({
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            },
            include: [
                {
                    model: customers,
                    attributes: ['firstName', 'lastName', 'email', 'phoneNo']
                },
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        const unPaidDebts = await debts.findAll({
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            },
            include: [
                {
                    model: customers,
                    attributes: ['firstName', 'lastName', 'email', 'phoneNo']
                },
            ],
            order: [
                ['id', 'DESC']
            ]
        })

        return res.json({
            cashRequests: {
                alldebts,
                paidDebts,
                pendingDebts,
                unPaidDebts,
            },
            success: true
        })
    // } catch (error) {
    //     return res.json({message: 'Could not retrieve debts', success: false});        
    // }
}

module.exports = {
    deleteDebt,
    createDebt,
    updateDebt,
    getDebts
}