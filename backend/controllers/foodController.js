import foodModel from "../models/foodModel.js";
import fs from 'fs';
import { clearCache } from "../config/redis.js";
import { logger } from "../config/logger.js";

//add food items

const addFoodItem = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,

    })

    try {
        await food.save();
        
        // Clear food list cache when a new item is added
        await clearCache('cache:/api/food/list*');
        logger.info('Food list cache cleared after adding new item');
        
        res.json({ success: true, message: "Food Item Added" })

    } catch (error) {
        logger.error('Error adding food item', { error });
        res.json({ success: false, message: "Error" })

    }


}

//Food list

const listFood = async(req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}

//Remove food items

const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id)
        if (!food) {
            return res.status(404).json({success:false, message:"Food item not found"})
        }
        
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        
        // Clear food list cache when an item is removed
        await clearCache('cache:/api/food/list*');
        logger.info('Food list cache cleared after removing item');
        
        res.json({success:true, message:"Food item removed"})
    } catch (error) {
        logger.error('Error removing food item', { error });
        res.json({success:false, message:"Error removing food item"})
        
    }

}

export { addFoodItem, listFood,removeFood }