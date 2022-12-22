const {asyncHandlerWithTransaction} = require('../utils/asyncHandlerWithTransaction')


const getProfileContract = asyncHandlerWithTransaction(async(req,res) => {
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const getMethod = req.profile.type === 'client' ? 'getClient' : 'getContractor';
    const contract = await req.profile[getMethod]({where:{id:id}},{transaction:req.transaction})
    if(!contract) return res.status(404).end()
    res.json(contract)
})

const getProfileContracts = asyncHandlerWithTransaction(async(req,res) =>{
  const {Contract} = req.app.get('models')
  const {id} = req.params
  const getMethod = req.profile.type === 'client' ? 'getClient' : 'getContractor';
  const contracts = await req.profile[getMethod]()
  if(!contracts) return res.status(404).end()
  res.json(contracts)
})



module.exports = {
  getProfileContract,
  getProfileContracts

}