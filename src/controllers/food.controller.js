const foodModel=require('../models/food.model')
const storageService=require('../services/storage.service')
const {v4:uuid}=require("uuid")
const likeModel=require('../models/likes.model') 
const saveModel=require('../models/save.model')


async function createFood(req,res) {
  
  const fileUploadResult=await storageService.uploadFile(req.file.buffer,uuid())
  const foodItem=await foodModel.create({
    name:req.body.name,
    description:req.body.description,
    video:fileUploadResult.url,
    foodPartner:req.foodPartner._id
  })

  res.status(201).json({
    message:"Food item created successfully",
    food:foodItem
  })
}
async function getFoodItems(req,res) {
  const foodItems=await foodModel.find({})
  res.status(200).json({
    message:"Food Items Fetched Successfully",
    foodItems
  }) 
}


async function likeFood(req,res) {
 const foodId=req.body.food
 const user=req.user;
 console.log(user)
 console.log(foodId)
 const isAlreadyLiked=await likeModel.findOne({user:user._id,food:foodId})
  if(isAlreadyLiked){
    await likeModel.deleteOne({user:user._id,food:foodId})
    await foodModel.findByIdAndUpdate(foodId,{ $inc: { likeCount: -1 } })

    return res.status(200).json({
      message:"Food item unliked successfully"
    })
  }
  const like=await likeModel.create({
    user:user._id,
    food:foodId
  })
  await foodModel.findByIdAndUpdate(foodId,{ $inc: { likeCount: 1 } }) 
  res.status(201).json({
    message:"Food item liked successfully",
    like
  })
}

async function saveFoodItem(req,res) {
  const foodId=req.body.food
  const user=req.user;
  const isAlreadySaved=await saveModel.findOne({user:user._id,food:foodId})
  if(isAlreadySaved){
    await saveModel.deleteOne({user:user._id,food:foodId})
    await foodModel.findByIdAndUpdate(foodId,{ $inc: { saveCount: -1 } })     
    return res.status(200).json({
      message:"Food item unsaved successfully"
    })
  }
  const save=await saveModel.create({
    user:user._id,  
    food:foodId
  }) 
  await foodModel.findByIdAndUpdate(foodId,{ $inc: { saveCount: 1 } })
  res.status(201).json({
    message:"Food item saved successfully",
    save
  })
}
async function getLikedFood(req,res) {

  const user=req.user;
  
  const likedItems=await likeModel.find({user:user._id}).populate("food")
  res.status(200).json({
    message:"Liked Food Items Fetched Successfully",
    likedItems
  })
}
async function getSavedFood(req,res) {
  const userId=req.user;
  const savedItems=await saveModel.find({user:userId}).populate("food")
  console.log(savedItems)   
  res.status(200).json({
    message:"Saved Food Items Fetched Successfully",
    savedItems
  })
}
async function getFoodItemsById(req,res){
const foodId=req.params.id;
const foodItem=await foodModel.findById(foodId)

if(!foodItem){return res.status(404).json({ message:"Food item not found" }) }
 res.status(200).json({ message:"Food item fetched successfully", foodItem })
}




module.exports={
  createFood,
  getFoodItems,
  likeFood,
  saveFoodItem,
  getLikedFood,
  getSavedFood,
  getFoodItemsById
}