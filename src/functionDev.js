//product.controller

export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
export const rateProduct = async (req, res) => {};
export const createReview = async (req, res) => {};
export const removeProductImage = async (req, res) => {};
//admin.controller
export const getAdminStats = async (req, res) => {};
export const deleteOrderAdmin = async (req, res) => {};
export const getAdminDetails = async (req, res) => {};
export const getSalesTrend = async (req, res) => {};
export const getAdminOverview = async (req, res) => {};
export const updateOrderStatus = async (req, res) => {};
export const getOrderByIdAdmin = async (req, res) => {};
//notification.controller
export const sendNotification = async ({ userId, message, type }) => {};
export const getMyNotifications = async (req, res) => {};
export const markNotificationAsRead = async (req, res) => {};
//order.controller
export const createOrder = async (req, res) => {};
export const updateOrderStatuss = async (req, res) => {};
export const deleteOrder = async (req, res) => {};
