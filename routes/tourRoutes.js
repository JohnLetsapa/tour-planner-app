const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const router = express.Router();

router.param('id', tourControllers.checkId); // id check middleware

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTourById)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
