import { Router } from "express";
import { checkUserId } from "../middlewares/userValidators.js";
import { WishlistController } from "../controllers/WishlistController.js";
import { checkProductIdInQuery } from "../middlewares/productValidators.js";
import { checkAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();
const wishlistController = new WishlistController();

/** URL: localhost:xxxx/api/wishlist/{...}
 * Lấy danh sách wishlist bằng member id
 * - {...} là member ID, ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/api/wishlist/:userId", checkUserId, async (req, res) => {
    await wishlistController.getWishlist(req, res);
});

/** URL: localhost:xxxx/api/wishlist/add?productId={...}
 * Thêm 1 product vào wishlist của 1 member thông qua productID và memberID
 * - "productId" là id của product, không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.post("/api/wishlist/add", checkAuthenticated, checkProductIdInQuery, async (req, res) => {
    await wishlistController.addProductToWishlist(req, res);
});

/** URL: localhost:xxxx/api/wishlist/remove?productId={...}
 * Xóa 1 product khỏi wishlist của 1 member thông qua productID và memberID
 * - {...} là member ID, ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 * - "productId" là id của product, không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.delete("/api/wishlist/remove", checkAuthenticated, checkProductIdInQuery, async (req, res) => {
    await wishlistController.removeProductFromWishlist(req, res);
});



// export router
export { router as wishlistRoutes };
