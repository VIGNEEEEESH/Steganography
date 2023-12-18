const mongoose=require("mongoose")
const Schema=mongoose.Schema

const messageSchema=new Schema({
    senderEmail:{type:String,required:true},
    senderName:{type:String,required:true},
    receiverEmail:{type:String,required:true},
    image:{type:String,required:true},
    status:{type:String},
    timestamp:{type:Date,required:true}
})
module.exports=mongoose.model("Message",messageSchema)