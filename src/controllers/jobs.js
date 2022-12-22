const Sequelize = require('sequelize');
const {asyncHandlerWithTransaction} = require('../utils/asyncHandlerWithTransaction')


const getUnpaidJobs = async (req, res) =>{
    const {Contract,Job} = req.app.get('models')
    const {id} = req.params
    const getMethod = req.profile.type === 'client' ? 'getClient' : 'getContractor';
    const contracts = await req.profile[getMethod]({where:{},include:[
        {model: Job, where: {
            paid: {[Sequelize.Op.or]: [false, null]}
        }}
    ]},{transaction: req.transaction});
    const jobs = contracts.flatMap(contract => contract.Jobs);
    if(!jobs) return res.status(404).end()

    res.json(jobs)
}

const payJob = asyncHandlerWithTransaction(async(req,res) => {
    const {job_id} = req.params;
    console.debug('job_id',job_id);
    const {Job,Profile} = req.app.get('models');
    const job = await Job.findOne({where:{id:job_id}},{transaction:req.transaction});
    if(job.paid){
        return res.status(400).json({error:"Job already paid"})
    }
    const contract  = await job.getContract({transaction:req.transaction});
    const client = await contract.getClient({transaction:req.transaction});
    if(client.balance >= job.price){
        job.paid = true;
        job.paymentDate = new Date(); 
        await job.save({transaction:req.transaction})
        client.balance = client.balance - job.price;
        await client.save({transaction:req.transaction});
        return res.status(200).json({paid:true})
    }
    return res.status(400).json({error:"insufficient funds"})
})

module.exports = {
    getUnpaidJobs,
    payJob
}