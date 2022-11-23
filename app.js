// Globale Variables
let form = document.forms[0];
let serchedNames = document.getElementById("serchedNames");
let result = document.getElementById("result");
let name = document.getElementById("name");
let nameAfter = document.getElementById("after");
const API_URL = [
  "https://api.genderize.io/?name=",
  "https://api.agify.io/?name=",
  "https://api.nationalize.io/?name=",
  "https://restcountries.com/v3.1/alpha?codes=",
];
// Class Declatrion
class guessed {
  constructor(gender, age, ...countres) {
    this.gender = gender;
    this.age = age;
    this.countres = countres;
  }
  #genderElement(gender) {
    let genderElement = document.createElement("p");
    genderElement.append(document.createTextNode(`Gender : ${gender}`));
    return genderElement;
  }
  #ageElement(age) {
    let ageElement = document.createElement("p");
    ageElement.append(document.createTextNode(`Age : ${age}`));
    return ageElement;
  }
}
// Form Event listner
form.onsubmit = (e) => {
  e.preventDefault();
  let namee = name.value.toLowerCase();
  if (nameValidator(namee)) {
    let guessedObj = {};
    let genderPromise = fetch(`${API_URL[0] + namee}`).then((response) =>
      response.json()
    );
    let agePromise = fetch(`${API_URL[1] + namee}`).then((response) =>
      response.json()
    );
    let nationaltyPromise = fetch(`${API_URL[2] + namee}`).then((response) =>
      response.json()
    );
    Promise.allSettled([genderPromise, agePromise, nationaltyPromise])
      .then((results) => {
        guessedObj.gender = results[0].value.gender;
        guessedObj.age = results[1].value.age;
        guessedObj.countres = results[2].value.country;
        guessedObj.countress = guessedObj.countres.map((e) => {
          return fetch(`${API_URL[3] + e.country_id.toLowerCase()}`).then(
            (response) => response.json()
          );
        });
        return guessedObj.countress;
      })
      .then((response) => {
        Promise.allSettled(response).then((responses) => {
          guessedObj.countres = responses.map((e) => [
            e.value[0].flags.svg,
            e.value[0].name.official,
          ]);
          console.log(guessedObj.countres);
        });
      });
    // .then(() => {
    //   guessedObj.countress = guessedObj.countres.map((e) => {
    //     return fetch(`${API_URL[3] + e.country_id.toLowerCase()}`);
    //   });
    // })
    // .then(() => {
    //   Promise.allSettled(guessedObj.countress)
    //     .then(() => {
    //       let response = guessedObj.countress.map((element) => {
    //         return element;
    //       });
    //       return response;
    //     })
    //     .then((response) => {
    //       response.forEach((element) => {
    //         console.log(element);
    //       });
    //     });
    // });
    // Promise.allSettled(countres).then((results) => {
    //   results.forEach((e) => {
    //     console.log(e);
    //   });
    // });
  }
};
// Functions
// nameValidator Take the Name(String) and Return if its accepted or not (boolean)
function nameValidator(name) {
  let notAllowed = [
    ":",
    '"',
    "'",
    ",",
    "<",
    ">",
    ".",
    "/",
    "?",
    "`",
    "\\",
    "|",
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "_",
    "+",
    "=",
    " ",
    ";",
    "[",
    "]",
    "{",
    "}",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ];
  let va = true;
  notAllowed.forEach((element) => {
    if (name.includes(element)) {
      va = false;
    }
  });
  return va;
}

// test for before nameAfter.style.setProperty("--after-content", '"Yellow"');
