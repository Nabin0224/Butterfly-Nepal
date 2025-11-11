const { getAllOrdersofAllUser, getOrderDetailsForAdmin, updateOrderStatus, getAllWebsiteOrdersForAdmin} = require("../../controllers/admin/order-controller");

const express = require("express");
const router = express.Router();

router.get("/get", getAllOrdersofAllUser);
router.get("/website/get", getAllWebsiteOrdersForAdmin);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;