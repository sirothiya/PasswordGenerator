const inputSlider = document.querySelector("[data-lengthSlider]");
const LengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generate = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolString = "~`!@#$%^&*()_-+=?/>.<,;:{[}]|";

let password = "";
let passwordLength = 10;
let checkCount = 0;
LengthDisplay.innerText = passwordLength;

// handleSlider is used to reflect the passwordlength in the UI
const handleSlider = () => {
  inputSlider.value = passwordLength;
  LengthDisplay.innerText = passwordLength;

  const minValue=inputSlider.min;
  const maxValue=inputSlider.max;

  inputSlider.style.backgroundSize = `${((passwordLength - minValue) * 100) / (maxValue - minValue)}%`;
  // console.log(inputSlider.style.backgroundSize)
};

// console.log(allCheckBox)

//setIndicator will set the color of UI indicator to the given color
const setIndicator = (color) => {
  // console.log(indicator)
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow =
    "1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue";
};
handleSlider()
setIndicator("#ccc")
// to generate randomvalue between min and max

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min; // an integer between min and max
};

const getRandomNumber = () => {
  return getRandomInteger(0, 9);
};

const getLowerCase = () => {
  return String.fromCharCode(getRandomInteger(97, 123));
};

const getUpperCase = () => {
  return String.fromCharCode(getRandomInteger(65, 91));
};
const getSymbol = () => {
  let len = symbolString.length;
  return symbolString[getRandomInteger(0, len)];
};

// check the checked checkbox and according identify the strength of password and change
//the color of indicator in the UI
const CalculateStrength = () => {
  let upper = false;
  let lower = false;
  let symbol = false;
  let num = false;
  if (upperCase.checked) upper = true;
  if (lowerCase.checked) lower = true;
  if (numbers.checked) num = true;
  if (symbols.checked) symbol = true;
  if (upper && lower && (symbol || num) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((lower || upper) && (num || symbol) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else setIndicator("#f00");
};
// to copy the input password field data to clipboard
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed ";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 3000);
};

const shufflePassword = (arr) => {
  for (let i = arr.lower - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  let str = "";
  arr.forEach((el) => (str += el));
  return str;
};

const generatePassword = () => {
  if (checkCount <= 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // find new password
  password = "";

  // use only checked checkbox
  // if(upperCase.checked){
  //     password+=getUpperCase()
  // }
  // if(lowerCase.checked){
  //     password+=getLowerCase();
  // }
  // if(numbers.checked){
  //     password+=getRandomNumber();
  // }
  // if(symbols.checked){
  //     password+=getSymbol();
  // }
  // if(passwordLength!=password.length){

  // }
  let funcArr = [];
  if (upperCase.checked) funcArr.push(getUpperCase);
  if (lowerCase.checked) funcArr.push(getLowerCase);
  if (numbers.checked) funcArr.push(getRandomNumber);
  if (symbols.checked) funcArr.push(getSymbol);

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    password += funcArr[getRandomInteger(0, funcArr.length)]();
  }

  // suffle the password

  password = shufflePassword(Array.from(password));

  //show password
  passwordDisplay.value = password;

  // calculate strength function
  CalculateStrength();
};

// change in slider will change the value of passwordlength
inputSlider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

// everytime change in the checkbox selection will count the checked and compare with the passwordlength
const handleChangeCheckbox = () => {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
};

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleChangeCheckbox);
});
