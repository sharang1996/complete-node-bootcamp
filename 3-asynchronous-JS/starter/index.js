const fs = require('fs');
const superagent = require('superagent');

// fs.readFile(
//   `${__dirname}/dog.txt`,
//   (err, data) => {
//     const result = `breed : ${data}`;
//     console.log(result);

//     callback hell!!!

//     superagent
//       .get(`https://dog.ceo/api/breed/${data}/images/random`)
//       .end((err, result) => {
//         if (err) return console.log(err.message);

//         fs.writeFile(
//           `${__dirname}/dog-output.txt`,
//           result.body.message,
//           (err) => {
//             if (err) return console.log(err.message);
//             console.log(`random dog image saved to file!`);
//           }
//         );
//       });

//     promises!
//     superagent
//       .get(`https://dog.ceo/api/breed/${data}/images/random`)
//       .then((result) => {
//         fs.writeFile(
//           `${__dirname}/dog-output.txt`,
//           result.body.message,
//           (err) => {
//             if (err) return console.log(err.message);
//             console.log(`random dog image saved to file!`);
//           }
//         );
//       })
//       .catch((err) => {
//         console.log(err.message);
//       } );
//   }
// );

// //promise functions
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err)
        reject('I could not find the file 😔');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err)
        reject('could not write to location 😔');
      resolve('success!');
    });
  });
};

// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//   })
//   .then((result) => {
//     return writeFilePromise(
//       `${__dirname}/dog-output.txt`,
//       result.body.message
//     );
//   })
//   .then(() => {
//     console.log(
//       'Random dog image saved to file!'
//     );
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Async Await(Syntactic sugar for promises!)

const getDogUrl = async () => {
  try {
    const dogType = await readFilePromise(
      `${__dirname}/dog.txt`
    );

    const dogImageUrl = await superagent.get(
      `https://dog.ceo/api/breed/${dogType}/images/random`
    );

    //multiple promises
    const reqProm1 = superagent.get(
      `https://dog.ceo/api/breed/${dogType}/images/random`
    );
    const reqProm2 = superagent.get(
      `https://dog.ceo/api/breed/${dogType}/images/random`
    );
    const reqProm3 = superagent.get(
      `https://dog.ceo/api/breed/${dogType}/images/random`
    );

    const all = await Promise.all([
      reqProm1,
      reqProm2,
      reqProm3,
    ]);

    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePromise(
      `${__dirname}/dog-output.txt`,
      dogImageUrl.body.message
    );

    console.log(
      'random dog image saved to file!'
    );
  } catch (err) {
    throw err;
  }

  return '2. Ready!';
};

//option 1 (as it returns a promise)
// console.log('getting url');
// getDogUrl()
//   .then(() => {
//     console.log('got it!');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//option 2 : IIFE!
(async () => {
  try {
    console.log('getting url');
    const res = await getDogUrl();
    console.log(res);
    console.log('got it!');
  } catch (err) {
    console.log(err);
  }
})();
