/**
 * HOC to stay DRY, catch errors and handle transactions for all requests
 * TODO: Research for pluggable(IoC) alternatives like custom decorators @ and better error handling
 * @param {*} fn 
 * @returns 
 */
const asyncHandlerWithTransaction = fn => async(req, res, next) => {
    const transaction = await req.app.get('sequelize').transaction();
    try {
        req.transaction = transaction;
        await fn(req, res, next);
        await transaction.commit();
    } catch(e){
        console.debug('error',e);
        transaction.rollback();
        next(e);
    }
}

module.exports = {
    asyncHandlerWithTransaction    
}