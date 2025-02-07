const { createBuydataTransaction } = require("../apiRequest/buyDataApi");

const buydata = async (req, res) => {
  const { productCode, PhoneNumber } = req.body;

  try {
    await createBuydataTransaction(productCode, PhoneNumber);
  } catch (error) {
    console.error(error);
  }
};
