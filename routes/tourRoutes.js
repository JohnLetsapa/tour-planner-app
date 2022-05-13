const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', tourControllers.checkId); // id check middleware

router
  .route('/top-5-cheapest')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours); // aliasT... func manipulates the incoming query before it is passed to getAllTours

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
