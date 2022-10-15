const { DEBTS_LABEL } = require('../misc/Constants');
const { debts, customers, Sequelize } = require('../models');
const moment = require('moment');

const Op = Sequelize.Op;

const getDateRange = () => {
    const date = new moment().quarter()
    const quaters = {
      1: [0, 2],
      2: [3, 5],
      3: [6, 8],
      4: [9, 11]
    }
    const period = quaters[date];
    return ({
      startDate: moment().month(period[0]).startOf('month').toDate(),
      endDate: moment().month(period[1]).endOf('month').toDate()
    })
}

const getMonthsBetweenDates = ({start, end}) => {
    let startDate = moment(start, "YYYY-M-DD");
    const endDate = moment(end, "YYYY-M-DD").endOf("month");

    const allMonthsInPeriod = [];

    while (startDate.isBefore(endDate)) {
        allMonthsInPeriod.push(startDate.format("MMMM"));
        startDate = startDate.add(1, "month");
    };

    return allMonthsInPeriod;
}

const getDatesBetweenDates = () => {
    const date = new moment().quarter()
    const quaters = {
      1: [0, 2],
      2: [3, 5],
      3: [6, 8],
      4: [9, 11]
    }
    const period = quaters[date];
    
    const start = moment().month(period[0]).startOf('month').toDate();
    const endDate = moment().month(period[1]).endOf('month').toDate();

    let startDate = moment(start);

    const allMonthsInPeriod = [];

    while (startDate.isBefore(endDate)) {
        allMonthsInPeriod.push({
        	startDate: startDate.startOf('month').toDate(),
            endDate: startDate.endOf('month').toDate()
        });
        startDate = startDate.add(1, "month");
    };

    return allMonthsInPeriod;
}


const getMonthlyReports = async(req, res) => {
    try {
        
        const thisMoment = moment()
        const endDate = moment(thisMoment).endOf('month').toDate();
        const startDate = moment(thisMoment).startOf('month').toDate();

        const TotalCustomers = await customers.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                },
                creatorId: req.user.id
            }
        })

        const TotalUnpaidDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            }
        })

        const TotalPaidDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            }
        })
        
        const TotalPendingDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: startDate,
                    [Op.lt]: endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            }
        })

        const currentMonth = moment(startDate, "YYYY-M-DD").format('MMMM')

        return res.json(
            {
                TotalCustomers, 
                TotalPaidDebts,
                TotalUnpaidDebts,
                TotalPendingDebts,
                currentMonth,
                success:true
            }
        )
    } catch (error) {
        return res.json({success:false, message: 'Monthly reports could not be retrieved', error})
    }
}

const getQuarterlyReports = async(req, res) => {  
    
    // try {
        
        const { startDate, endDate } = getDateRange();
        const dates = getDatesBetweenDates();

        // Figures
        const totalCustomers = await customers.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                creatorId: req.user.id
            }
        });
        const totalPaidDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            }
        });
        const totalUnPaidDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            }
        });
        const totalPendingDebts = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            }
        });
        
        // First Month of Quater
        const TotalCustomers1 = await customers.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[0].startDate,
                    [Op.lt]: dates[0].endDate
                },
                creatorId: req.user.id
            }
        })

        const TotalUnpaidDebts1 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[0].startDate,
                    [Op.lt]: dates[0].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            }
        })

        const TotalPaidDebts1 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[0].startDate,
                    [Op.lt]: dates[0].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            }
        })
        
        const TotalPendingDebts1 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[0].startDate,
                    [Op.lt]: dates[0].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            }
        })

        // Second Month of Quater
        const TotalCustomers2 = await customers.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[1].startDate,
                    [Op.lt]: dates[1].endDate
                },
                creatorId: req.user.id
            }
        })

        const TotalUnpaidDebts2 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[1].startDate,
                    [Op.lt]: dates[1].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            }
        })

        const TotalPaidDebts2 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[1].startDate,
                    [Op.lt]: dates[1].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            }
        })
        
        const TotalPendingDebts2 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[1].startDate,
                    [Op.lt]: dates[1].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            }
        })

        // Third Month of Quater
        const TotalCustomers3 = await customers.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[2].startDate,
                    [Op.lt]: dates[2].endDate
                },
                creatorId: req.user.id
            }
        })

        const TotalUnpaidDebts3 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[2].startDate,
                    [Op.lt]: dates[2].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.not_paid
            }
        })

        const TotalPaidDebts3 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[2].startDate,
                    [Op.lt]: dates[2].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.paid
            }
        })
        
        const TotalPendingDebts3 = await debts.count({
            order:[
                ['id', 'DESC']
            ],
            where: {
                createdAt:{
                    [Op.gt]: dates[2].startDate,
                    [Op.lt]: dates[2].endDate
                },
                debtsOwner: req.user.id,
                status: DEBTS_LABEL.pending
            }
        })

        quarterlyMonths = getMonthsBetweenDates({start: startDate, end: endDate})

        return res.json(
            {
                customers: [
                    { month: 1, number: TotalCustomers1 },
                    { month: 2, number: TotalCustomers2 },
                    { month: 3, number: TotalCustomers3 }
                ],
                unpaidDebts: [
                    {month: 1, number: TotalUnpaidDebts1},
                    {month: 2, number: TotalUnpaidDebts2},
                    {month: 3, number: TotalUnpaidDebts3}
                ],
                pendingDebts: [
                    {month: 1, number: TotalPendingDebts1},
                    {month: 2, number: TotalPendingDebts2},
                    {month: 3, number: TotalPendingDebts3}
                ],
                paidDebts: [
                    {month: 1, number: TotalPaidDebts1},
                    {month: 2, number: TotalPaidDebts2},
                    {month: 3, number: TotalPaidDebts3}
                ],
                totals: {
                    totalCustomers,
                    totalPaidDebts,
                    totalPendingDebts,
                    totalUnPaidDebts
                },
                quarterlyMonths,
                success:true
            }
        )

    // } catch (error) {
    //     return res.json({success:false, message: 'Quaterly reports could not be retrieved', error})
    // }
}

module.exports = {
    getMonthlyReports,
    getQuarterlyReports
}
