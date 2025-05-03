const Listing = require('../models/listing.js')

module.exports.index = async (req, res) => {
    const {q} = req.query
    
    let allListings = await Listing.find({})

    if(q){
        const regex = new RegExp(q, 'i'); // The 'i' flag makes the regex case-insensitive:
         
        allListings = await Listing.find({
            $or: [
                { location: regex },
                { title: regex },
                { country: regex }
              ]
        })
    }
    //    console.log("All data",allListings)
    res.render("listings/index.ejs", { allListings,q })
}
 
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const showListing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        }
    }).populate("owner")
    if (!showListing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect('/listings')
    }
    res.render("listings/show.ejs", { showListing })
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    // let {title,description,image,price,location,country} = req.body
    // let listing = req.body.listing
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save()
    // console.log(listing)
    req.flash("success", 'New Listing Created!')
    res.redirect('/listings')
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params
    const editListing = await Listing.findById(id)
    if (!editListing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect('/listings')
    }
    let originalImageUrl = editListing.image.url
    originalImageUrl =originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { editListing,originalImageUrl })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params
    let updateListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    // console.log(updateListing)
    if(typeof req.file != 'undefined'){
        let url = req.file.path
        let filename = req.file.filename
        updateListing.image = { url, filename }
        await updateListing.save()
    }

    req.flash("success", 'Listing Updated!')
    res.redirect(`/listings/${id}`)
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    // console.log(deleteListing)
    req.flash("success", 'Listing Deleted!')
    res.redirect('/listings')
}