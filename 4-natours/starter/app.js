const express = require('express');
const fs = require('fs');

app = express();

//middleware, it basically appends the post input in the body to the request object
app.use(express.json());

//JSON.parse converts the string to a javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//GET all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//GET tour having id
app.get('/api/v1/tours/:id', (req, res) => {
  //convert strings to numbers easily
  const id = req.params.id * 1;

  const tourMatched = tours.find((tour) => tour.id === id);
  if (!tourMatched) {
    res.status(404).json({ status: 'fail', message: 'invalid id' });
  } else {
    res.status(200).json({ status: 'success', data: { tourMatched } });
  }
});

//POST a new tour
app.post('/api/v1/tours', (req, res) => {
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
});

//UPDATE a tour having tour id
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

//DELETE a tour having tour id
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`running on port ${port}...`);
});
