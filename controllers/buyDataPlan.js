const { createBuydataTransaction } = require("../apiRequest/buyDataApi");

const createTransaction = async (req, res) => {
  const { productCode, phoneNumber } = req.body;

  try {
    await createBuydataTransaction(productCode, phoneNumber);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createTransaction };
