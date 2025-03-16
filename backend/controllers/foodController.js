import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Await } from "react-router-dom";
import foodModel from "../models/foodModel.js";
import fs from 'fs'

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
        res.json({ success: true, message: "Food Item Added" })

    } catch (error) {
        console.log(error)
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
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"food items removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }

}

export { addFoodItem, listFood,removeFood }