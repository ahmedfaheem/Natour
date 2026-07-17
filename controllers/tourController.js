const fs = require('fs');

const PATH = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(PATH));

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
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour Not Found',
    });
  }

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

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour Not Found',
    });
  }
  // 204 no-content
  return res.status(200).json({
    status: 'success',
    message: 'Deleted Successfully',
  });
};
