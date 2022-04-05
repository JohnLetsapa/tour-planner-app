const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// 1. MIDDLEWARE /////////////////////////////////////////////////////////////////
// Middleware - executes between Req and Res!

app.use(morgan('dev'));

app.use(express.json()); // middleware for modifying incoming request data...

// app.use((req, res, next) => {
//   // Middleware demo --> doesn't affect the api outcome
//   console.log('Middleware!!!');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/users.json`)
);

// 1. ROUTE HANDLERS /////////////////////////////////////////////////////////////////

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTourById = (req, res) => {
  console.log(req.requestTime);
  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id - tour does not exist',
    });
  }

  res.status(200).json({
    status: 'success',
    data: tours.find((tour) => tour.id == req.params.id),
  });
};

const createTour = (req, res) => {
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1; // adds 1 to the last id element in the array
  const newTour = Object.assign({ id: newId }, req.body); // merges id with tour
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        // 201 -> resource created
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  console.log(req.params);

  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id - tour does not exist',
    });
  }

  res.status(200).json({
    status: 'success',
    data: '<Updated tour>',
  });
};

const deleteTour = (req, res) => {
  console.log(req.params);

  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id - tour does not exist',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

// 3. ROUTES /////////////////////////////////////////////////////////////////

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Tour routes

const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
// v1 (using versions) allows for development to be done on later upgrades without
//interrupting current users...It's a best practice.
tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

// User routes

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4. START SERVER /////////////////////////////////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
