const {asyncHandlerWithTransaction} = require('../utils/asyncHandlerWithTransaction')
const Sequelize = require('sequelize');


const deposit = asyncHandlerWithTransaction(async(req,res) => {
    const {Profile} = req.app.get('models');
    const {userId} = req.params;
    const {amount} = req.body;
    
    const profile = await Profile.findOne({ where:{ id:userId } },{ transaction:req.transaction });
    
    if(profile.type !== 'client'){
        return res.status(400).json({error:'Not a client'})
    }

    const contracts = await profile.getClient({},{ transaction:req.transaction });
    const jobs = await Promise.all( contracts.map(async (contract) => {
        const jobsForContract = await contract.getJobs({where:{paid: {[Sequelize.Op.or]: [false, null]}}},{transaction:req.transaction});
        const totalPriceForContract = jobsForContract.reduce((accumulator,currentJob) => accumulator.price + currentJob.price ,{price:0});
        return totalPriceForContract;
    }));
    
    const depositLimit = jobs.reduce((a,p) => a+p,0) * 0.25;

    if(amount > depositLimit) {
        return res.status(400).json({error:`max deposit limit reached`,depositLimit})
    }

    profile.balance = profile.balance + amount;

    await profile.update({transaction:req.transaction});
    
    return res.status(200).end()
})

module.exports = {
    deposit
}