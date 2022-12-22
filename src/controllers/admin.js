const Sequelize = require('sequelize');
const {asyncHandlerWithTransaction} = require('../utils/asyncHandlerWithTransaction')


const getBestProfession = asyncHandlerWithTransaction(async(req,res) =>{
    const {Profile,Job,Contract} = req.app.get('models')

    const start = new Date(req.query.start || '2022-12-20');
    const end = new Date(req.query.end || '2022-12-28');

    const profiles = await Profile.findAll({
        include: [
          {
            model: Contract,
            as: 'Contractor',
            where: {
              createdAt: {
                [Sequelize.Op.between]: [start, end]
              }
            },
            required: true,
            include: [
              {
                model: Job,
                where: {
                  paid: true
                }
              }
            ]
          }
        ]
      });

      const profilesEarning = profiles.map(profile => {
        const earnings = profile.Contractor.flatMap((contract => contract.Jobs.reduce((acc,job) =>  acc + job.price,0)))[0];
        return {
            earnings,
            profession: profile.profession
        };
      });

      let topEarningProfile = profilesEarning.reduce((prev, current) => {
        return (prev.earnings > current.earnings) ? prev : current;
      });


    res.json(topEarningProfile)
})

const getBestClient = asyncHandlerWithTransaction(async(req,res) =>{
    const {Profile,Job,Contract} = req.app.get('models')

    const start = new Date(req.query.start || '2022-12-20');
    const end = new Date(req.query.end || '2022-12-28');
    const limit = req.query.limit || 2;


    const profiles = await Profile.findAll({
        include: [
          {
            model: Contract,
            as: 'Client',
            where: {
              createdAt: {
                [Sequelize.Op.between]: [start, end]
              }
            },
            required: true,
            include: [
              {
                model: Job,
                where: {
                  paid: true
                }
              }
            ]
          }
        ]
      });

      const profilesTotalEarn = profiles.map(profile => {
        const totalPaid = profile.Client.flatMap((contract => contract.Jobs.reduce((acc,job) =>  acc + job.price,0)))[0];
        return {
            totalPaid,
            fullName: `${profile.firstName}${profile.lastName}`
        };
      }).sort((a, b) => b.totalPaid - a.totalPaid).slice(0, limit)


    res.json(profilesTotalEarn);
})

module.exports = {
    getBestProfession,
    getBestClient
}