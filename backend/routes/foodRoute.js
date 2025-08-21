import express from "express"
import { addFoodItem, listFood,removeFood } from "../controllers/foodController.js"
import multer from "multer"
import { cache } from "../config/redis.js"

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Food management API
 */

const foodRouter = express.Router();

//Image strorage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     summary: Add a new food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the food item
 *               price:
 *                 type: number
 *                 description: Price of the food item
 *               description:
 *                 type: string
 *                 description: Description of the food item
 *               category:
 *                 type: string
 *                 description: Category of the food item
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the food item
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category
 *               - image
 *     responses:
 *       201:
 *         description: Food item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
foodRouter.post("/add", upload.single("image"),addFoodItem)

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     summary: Get all food items
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: List of all food items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Cache food list for 5 minutes (300 seconds)
foodRouter.get("/list", cache(300), listFood)

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     summary: Remove a food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: string
 *                 description: ID of the food item to remove
 *             required:
 *               - foodId
 *     responses:
 *       200:
 *         description: Food item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Food item removed successfully
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
foodRouter.post("/remove",removeFood);











export default foodRouter;