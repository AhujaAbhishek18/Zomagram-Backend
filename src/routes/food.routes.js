const express=require("express")
const foodController=require("../controllers/food.controller")
const authMiddleware=require("../middleware/auth.middleware")
const router =express.Router();
const multer=require("multer")

const upload=multer({
  storage:multer.memoryStorage(),
})

/*Post/api/food/[protected] */
router.post("/",authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodController.createFood) 

/*GET /api/food/[protected]*/
router.get("/",authMiddleware.authUserMiddleware,foodController.getFoodItems)


router.post("/like/",authMiddleware.authUserMiddleware,foodController.likeFood)
router.get("/like",authMiddleware.authUserMiddleware,foodController.getLikedFood)

router.post("/save",authMiddleware.authUserMiddleware,foodController.saveFoodItem)
router.get("/save",authMiddleware.authUserMiddleware,foodController.getSavedFood)

router.get("/:id",authMiddleware.authUserMiddleware,foodController.getFoodItemsById)




module.exports=router
