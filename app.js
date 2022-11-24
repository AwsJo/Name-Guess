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
  #picturNameElement(...args) {
    let elementArr = document.createElement("div");
    elementArr.classList.add("country-container");
    args[0][0].forEach((element) => {
      let div = document.createElement("div");
      let img = document.createElement("img");
      let name = document.createElement("h2");
      img.src = element[0];
      img.alt = element[1];
      name.append(document.createTextNode(element[1]));
      div.append(img, name);
      elementArr.append(div);
    });
    return elementArr;
  }
  result() {
    while (result.lastChild) {
      result.lastChild.remove();
    }
    result.append(
      this.#genderElement(this.gender),
      this.#ageElement(this.age),
      this.#picturNameElement(this.countres)
    );
    //this.#picturNameElement(this.countres);
  }
}
// Form Event listner
form.onsubmit = (e) => {
  e.preventDefault();
  let namee = name.value.toLowerCase();
  nameAfter.style.setProperty("--after-content", '""');
  if (nameValidator(namee)) {
    let guessedObj = {};
    addToLocalStorge(namee);
    writeHistory();
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
          // console.log(guessedObj.countres);
          let builder = new guessed(
            guessedObj.gender,
            guessedObj.age,
            guessedObj.countres
          );
          builder.result();
        });
      });
  } else {
    nameAfter.style.setProperty(
      "--after-content",
      '"Please Enter Valid Name (No special charcter or numbers"'
    );
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
function addToLocalStorge(name) {
  localStorage.setItem("names", localStorage.getItem("names") + "." + name);
}
function writeHistory() {
  let names = localStorage.getItem("names");
  while (serchedNames.lastChild) {
    serchedNames.lastChild.remove();
  }
  names = names.split(".");
  names.shift();
  names = [...new Set(names)];
  names
    .slice()
    .reverse()
    .forEach((element) => {
      let name = document.createElement("p");
      name.append(document.createTextNode(element));
      serchedNames.append(name);
    });
}
// test for before nameAfter.style.setProperty("--after-content", '"Yellow"');
