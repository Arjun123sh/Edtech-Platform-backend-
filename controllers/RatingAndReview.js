const RatingAndReview=require("../models/RatingAndRaview")
const Course=require("../models/Course");
const User=require("../models/User");
const { default: mongoose } = require("mongoose");
// create rating
exports.createRating=async(req,res)=>{
    try{
        const userid=req.user.id;

        const {rating,review,courseId}=req.body;

        const courseDetails=await Course.find(
            {_id:courseId},
            {studentsEnrolled:{$elemMatch:{$eq:userid}}}
        )

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                mesage:"Student is not enrolled in course ",
            })
        }

        const alreadyReviewed=await RatingAndReview.findOne(userid,courseId);

        if(alreadyReviewed){
            return res.status(404).json({
                success:false,
                mesage:" Already Reviewed ",
            })
        }

        const Newrating=await RatingAndReview.create({
            rating,review,user:userid,course:courseId
        })

        await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReviews:Newrating._id}},{new:true});

        return res.status(200).json({
            success:true,
            mesage:"Rating And Review Updated ",
        })
    }
    catch(err){
        console.log(err);

    }
}

exports.getAverageRatings=async(req,res)=>{
    try{
        const courseId=req.body.id;

        const result=await RatingAndReview.aggregate(
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRatings:{$avg:"$rating"},
                }
            }
        )
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRatings:result[0].averageRatings
            })
        }
        return res.status(200).json({
            success:false,
            averageRatings:0,
            message:"No Ratings Found ",
        })
    }   
    catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"Error Occured ",
        })
    }
}

exports.getAllrating=async(req,res)=>{
    try{
        const allRating=await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image"
        }).populate({
            path:"course",
            select:"courseName",
        }).exec()

        return res.json({
            success:true,
            mesage:"All Reviews Fetched Successfully ",
            allRating,
        })
    }
    catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"Error Occured ",
        })
    }
}