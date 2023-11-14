const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find(
			{},
			{ name: true, description: true }
		);
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.CategoryPageDetils=async(req,res)=>{
	try{
		const {Category_id}=req.body;

		const SelectedCategory=await Category.findById(Category_id).populate("courses").exec();
		if(!SelectedCategory){
			return res.json({
				success:false,
				message:"Data Not Found "
			})
		}
		const DiffCategories=await Category.find(
			{_id:{$ne:Category_id}}
		).populate("courses").exec()

		return res.json({
			success:true,
			SelectedCategory,
			DiffCategories,
		})

	}
	catch(err){
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}