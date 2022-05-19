const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator'); // validator library

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // validator
      unique: true,
      maxLength: [40, 'A tour name must have a max of fourty(40) characters'], // validator
      minLength: [10, 'A tour name must have a min of ten(10) characters'], // validator
      // validate: [
      //   validator.isAlpha,
      //   'A tour name must only contain character a-zA-Z',
      // ], // validator library
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
      enum: {
        values: ['easy', 'medium', 'difficult'], // enum for strings - array lists accepted values
        message: 'Difficulty level should be either: easy, medium or difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be between 1.0 and 5.0'], // validator
      max: [5, 'A rating must be between 1.0 and 5.0'], // validator
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
      // custom validator
      type: Number,
      validate: {
        validator: function (val) {
          // val refers to the input -> price Discount. Only works for creation not update
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than the tour prices',
      },
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
    slug: String,
    secretTour: {
      type: Boolean,
    },
  },
  {
    toJSON: { virtuals: true }, // virtual data, not persisted in the DB will be outputted with the requested data
    toObject: { virtuals: true },
  }
);

const Tour = mongoose.model('Tour', tourSchema);

// virtuals are declared in the schema
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // use this to point to current document. use regular function, arrow func has no 'this'
});

// DOCUMENT MIDDLEWARE: mongoose middleware - pre: before, post:after| pre runs before .save() and .create() but not insertMany()
tourSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre('/^find/', function (next) {
  // must be executed for ALL function starting with find
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

module.exports = Tour;
