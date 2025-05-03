const express = require('express')
const router = express.Router({mergeParams:true}) 
const warpAsync = require('../utils/warpAsync.js')
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require('../controllers/reviews.js')

//Post Review Route
router.post('/',isLoggedIn, validateReview, warpAsync(reviewController.createReview))

//Delete Review Route
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, warpAsync(reviewController.deleteReview))

module.exports = router;