const fs = require('fs');

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  // console.log(`Tour id is ${val}`);
  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid tour id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {

  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'tour name and price must be specified',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (req, res) => {
  const tourId = req.params.id;

  res.status(200).json({
    status: 'success',
    data: tours.find((tour) => tour.id == req.params.id),
  });
};

exports.createTour = (req, res) => {
  newTourId = tours[tours.length - 1].id + 1;
  newTour = Object.assign({ id: newTourId }, req.body);
  tours.push(newTour);

  // console.log('tours', tours);

  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) =>
      res.status(201).json({
        // 201 -> created resource
        status: 'success',
        data: {
          tour: newTour,
        },
      })
  );
};

exports.updateTour = (req, res) => {
  const tourId = req.params.id;

  updatedTour = Object.assign({ id: tourId }, req.body); // all info to update tour comes from params

  // this mimics a database update..
  tours.find((tour) => {
    if (tour.id == tourId) {
      tours.splice(tourId, 1, updatedTour);
    }
  });

  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: updatedTour,
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  tourId = req.params.id;

  tours.splice(tourId, 1);

  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        message: `tour with id ${tourId} has been successfully deleted`,
        data: null,
      });
    }
  );
};
