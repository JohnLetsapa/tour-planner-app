const Tour = require('../models/tourModel'); // this is our access to the DB
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // const queryObj = { ...req.query }; // spreading req.query creates a new object so the ref points away fro the original req.query.

    // // 1A. Filtering
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]); // this modifies the queryObj by deleting el equivalent to those in excludedField array

    // // 1B. Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = JSON.parse(
    //   queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    // );
    // QUERY STRING
    // let query = Tour.find(queryStr);

    // 2. Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy); // query.sort is a method from mongoose
    //   // sort('stringOne stringTwo') the sort function works like this...it takes a string or strings separated by spaces as argument/s
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // 3. Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v'); // putting a minus excludes from query
    // }

    // 4. Pagination
    // const page = req.query.page * 1 || 1; // we return 1 page worth pf result in case of many pages -> bandwitdth
    // const limit = req.query.limit * 1 || 100; // we limit results to the first 100 ^^^
    // const skip = (page - 1) * limit; // when user request say page 2, this will skip results in page 1, and only return those on page 2...works for all other cases

    // query = query.skip(skip).limit(limit); // skips(x) skips x results before quering data

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .limitFields()
      .filter()
      .sort()
      .paginate();

    const tours = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findByOne({ _id: req.params.id }); equivalent to above
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // params to find, and req.body to provide data to update. new set to tru ensures that the data returned is the new one.
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
