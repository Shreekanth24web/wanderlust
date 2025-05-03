const review = require('../models/reviews.js') 
const listing = require('../models/listing.js')

module.exports.createReview = async (req, res) => {
    // console.log(req.params.id)
    let findListing = await listing.findById(req.params.id)
    // console.log("find listing -----> ", findListing)
    let newReview = new review(req.body.review)
    // console.log('newReview----------', newReview)
    newReview.author = req.user._id
    findListing.reviews.push(newReview)

    await newReview.save()
    await findListing.save()
    req.flash("success", 'New Review Added!')
    res.redirect(`/listings/${findListing._id}`)
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findById(reviewId)
    req.flash("success", 'Review Deleted!')
    res.redirect(`/listings/${id}`)

}