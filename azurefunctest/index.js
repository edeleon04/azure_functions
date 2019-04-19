const axios = require('axios')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
	
    if (req.query.amount || (req.body && req.body.amount)) {
		let amount = parseFloat(req.query.amount);
		
		const getBTCPrice = async () => {
		  try {
			return await axios.get('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
		  } catch (error) {
			context.log.error(error)
		  }
		}
		
		const amountBTC = async (amount) => {
		  const price = await getBTCPrice();
			
		  if (price.data.bpi.USD.rate_float) {
			  amount = amount / parseFloat(price.data.bpi.USD.rate_float);
		  }
		  
		  return amount;
		}

		context.res = {
			// status: 200, /* Defaults to 200 */
			body: await amountBTC(amount)
		};		
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a dollar amount on the query string or in the request body"
        };
    }
};