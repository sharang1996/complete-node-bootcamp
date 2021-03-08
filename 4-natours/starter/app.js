const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

app = express();

//MIDDLEWARES

//custom middleware

app.use(morgan('dev'));

app.use((req, resp, next) => {
  console.log('hello from the middleware!');
  next();
});

app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//middleware, it basically appends the post input in the body to the request object
app.use(express.json());

//JSON.parse converts the string to a javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTEHANDLERS

//GET all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

//GET tour having id
const getTour = (req, res) => {
  //convert strings to numbers easily
  const id = req.params.id * 1;

  const tourMatched = tours.find((tour) => tour.id === id);
  if (!tourMatched) {
    res.status(404).json({ status: 'fail', message: 'invalid id' });
  } else {
    res.status(200).json({ status: 'success', data: { tourMatched } });
  }
};

//POST a new tour
const addNewTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    'utf-8',
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//UPDATE a tour having tour id
const updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (!tours.find((tour) => tour.id === id)) {
    res.status(404).json({ status: 'fail', message: 'invalid id' });
  } else {
    //mapping the objects and updating one which matched id
    const patchedTours = tours.map((tour) =>
      tour.id == id ? { ...tour, ...req.body } : tour
    );

    //persisting the new updated tours into the file
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(patchedTours),
      'utf-8',
      (err) => {
        res.status(200).json({
          status: 'success',
          data: {
            updatedFields: req.body,
          },
        });
      }
    );
  }
};

//DELETE a tour having tour id
const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (!tours.find((tour) => tour.id === id)) {
    res.status(404).json({ status: 'fail', message: 'invalid id' });
  } else {
    //filtering out tours which do not have the id entered
    const filteredTours = tours.filter((tour) => {
      return tour.id !== id;
    });

    //persisting the new tours into the file
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(filteredTours),
      'utf-8',
      (err) => {
        res.status(200).json({
          status: 'success',
          data: {
            deleted: id,
          },
        });
      }
    );
  }
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'route not implemented yet' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'route not implemented yet' });
};

const addNewUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'route not implemented yet' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'route not implemented yet' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'route not implemented yet' });
};

//ROUTES

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(addNewTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
app.use('/api/v1/tours', tourRouter);

userRouter.route('/').get(getAllUsers).post(addNewUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
app.use('/api/v1/users', userRouter);

//START SERVER
const port = 8000;
app.listen(port, () => {
  console.log(`running on port ${port}...`);
});
