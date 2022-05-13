const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    trim: true, // removes white spaces at the beginning and end of a string
    required: [true, 'A tour ,ust have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, // this is the text ref to the image stored in the db
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // an array of strings
  createdAt: {
    type: Date,
    default: Date.now(), // mongoose will automatically cover this to a data format that makes sense
    select: false, // this hides this field from selection - in case it is sensitive
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
