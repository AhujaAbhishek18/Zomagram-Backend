const mongoose=require('mongoose')

const foodSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  video:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  price:{
    type:Number,
    default:5
  },
  foodPartner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"foodpartner"
  },
  likeCount:{
    type:Number,
    default:0
  },
  saveCount:{
    type:Number,
    default:0
  }
})
const foodModel=mongoose.model("food",foodSchema);
module.exports=foodModel;