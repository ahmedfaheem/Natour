const fs = require('fs');

const PATH = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(PATH));

// Params Middleware
exports.checkID = (req, res, next, val) => {
  console.log(`Loggen ID ${val}`);
  if (Number.isNaN(val) || val > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'ID Not Valid',
    });
  }

  next();
};

// check body middleware
exports.checkBody = (req, res, next) => {
  const body = req.body;
  if ((!body && !body.name) || !body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Name or Price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  if (!tours) {
    res.status(204).json({
      status: 'fail',
      message: 'No Tours Founded',
    });
  }

  res.status(200).json({
    status: 'success',
    time: req.TimeRequest,
    total: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newTour = Object.assign(
    {
      id: tours[tours.length - 1].id + 1,
    },
    req.body,
  );

  tours.push(newTour);

  fs.writeFile(PATH, JSON.stringify(tours), (err) => {
    if (err) {
      res.status(500).json({
        status: 'erorr',
        message: 'Database Connection Error',
      });
    } else {
      res.status(201).json({
        status: 'success',
        message: 'added successfully',
        tour: newTour,
      });
    }
  });
};

exports.getTourByID = (req, res) => {
  // *1 to cast to number
  const id = req.params.id * 1;

  const tour = tours.find((e) => e.id == id);

  res.status(200).json({
    status: 'success',
    tour: tour,
  });
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((e) => e.id == id);
  if (!tour || !req.body) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour Not Found',
    });
  }
  const updatedTour = Object.assign(tour, req.body);
  console.log(updatedTour);
  return res.status(200).json({
    status: 'success',
    message: 'Updated Successfully',
    tour: updatedTour,
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((e) => e.id == id);

  // 204 no-content
  return res.status(200).json({
    status: 'success',
    message: 'Deleted Successfully',
  });
};
