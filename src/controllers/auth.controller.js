const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartner.model");

async function registerUser (req,res){
  const{fullName,email,password}=req.body;
  const isUserAlreadyExists=await userModel.findOne({
    email
  })
  if(isUserAlreadyExists){
    return res.status(400).json({
      message:"Email Already exist"
    })
  }
  const hashedPassword=await bcrypt.hash(password,10);
  const user=await userModel.create({
    fullName,
    email,
    password:hashedPassword
  })
  const token=jwt.sign({
    id:user._id,
  },process.env.JWT_SECRET)
  res.cookie("token",token)
  res.status(201).json({
    message:"User Created Successfully",
    user:{
      _id:user._id,
      email:user.email,
      fullName:user.fullName,
    }
  })

}
 
async function loginUser (req,res){
  const {email,password}=req.body;
  const user=await userModel.findOne({email})
  if(!user){
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }
  const isPasswordValid= await bcrypt.compare(password,user.password);
  if(!isPasswordValid){
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }
  const token=jwt.sign({
    id:user._id,
  },process.env.JWT_SECRET)
  
  res.cookie("token",token);
  res.status(200).json({
    message:" User Logged in succesfully",
    user:{
      _id:user._id,
      email:user.email,
      fullName:user.fullName,
    }
  })
}
function logoutUser(req,res){
  res.clearCookie("token");
  res.status(200).json({
    message: "User Logged Out Successfully"
  }) 
}

async function registerFoodPartner(req,res){
  const {name,contactName,phone,address,email,password}=req.body
  const isFoodPartnerExist= await foodPartnerModel.findOne({email})
  if(isFoodPartnerExist){
    return res.status(400).json({
      message:"FoodPartner Already Exists"
    })   
  }
  const hashedPassword= await bcrypt.hash(password,10)
  const foodPartner=await foodPartnerModel.create({
    name,
    email,
    password:hashedPassword,
    contactName,
    phone,
    address
  })

  const token=jwt.sign({
    id:foodPartner._id, 
  },process.env.JWT_SECRET)

  res.cookie("token",token)

  res.status(201).json({
    message:"Food Partner Created Successfully",
    foodPartner:{
      _id:foodPartner._id,
      email:foodPartner.email,
      name:foodPartner.name,
      contactName:foodPartner.contactName,
      phone:foodPartner.phone,
      address:foodPartner.address
    }
  })

}

async function loginFoodPartner(req,res) { 
  const {email,password}=req.body
  const foodPartner= await foodPartnerModel.findOne({email})
  
  if(!foodPartner){
    return res.status(400).json({
      message:"Invalid FoodPartner name Or Password"
    })
  }
  const isPasswordValid=await bcrypt.compare(password,foodPartner.password)

  if (!isPasswordValid){
     return res.status(400).json({
      message:"Invalid FoodPartner name Or Password"
    })

  }
  
  const token=jwt.sign({
    id:foodPartner._id
  },process.env.JWT_SECRET)

  res.cookie("token",token)

  res.status(200).json({
    message:" FoodPartner Login successfully",
    foodPartner:{
      _id:foodPartner._id,
      email:foodPartner.email,
      name:foodPartner.name,
    }

  })
}

function logoutFoodPartner(req,res){
  res.clearCookie("token");
  res.status(200).json({
    message:"Food Partner logged out succesfully "
  })
}


module.exports={
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
}