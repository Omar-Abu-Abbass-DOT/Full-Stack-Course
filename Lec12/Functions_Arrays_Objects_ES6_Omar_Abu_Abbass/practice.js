/*
  Task: Functions, Arrays, Objects & ES6 Practice
  Omar Abu Abbass
*/

// ==========================================
// 1. average
// ==========================================
const average = (num1, num2) => {
  return (num1 + num2) / 2;
};

// ==========================================
// 2. toThePowerOf
// ==========================================
const toThePowerOf = (base, exponent) => {
  return Math.pow(base, exponent);
};

// ==========================================
// 3. oneOrZero
// ==========================================
const oneOrZero = () => {
  return Math.round(Math.random());
};

// ==========================================
// 4. incrementOne
// ==========================================
const incrementOne = (number) => {
  return number + 1;
};

// ==========================================
// 5. addToArray
// ==========================================
const addToArray = (array, string) => {
  array.push(string);
  return array;
};

// ==========================================
// 6. accessElement
// ==========================================
const accessElement = (array, index) => {
  return array[index];
};

// ==========================================
// 7. arrayMiddle
// ==========================================
const arrayMiddle = (arr) => {
  const midIndex = Math.floor(arr.length / 2);
  if (arr.length % 2 === 0) {
    return (arr[midIndex - 1] + arr[midIndex]) / 2;
  } else {
    return arr[midIndex];
  }
};

// ==========================================
// 8. oddIndexEvenLength
// ==========================================
const oddIndexEvenLength = (arr) => {
  return arr.filter((word, index) => index % 2 !== 0 && word.length % 2 === 0);
};

// ==========================================
// 9. convertToString
// ==========================================
const convertToString = (arr) => {
  return arr.join("");
};

// ==========================================
// 10. olderThan
// ==========================================
const olderThan = (personOne, personTwo) => {
  if (personOne.age > personTwo.age) {
    return `${personOne.name} is older than ${personTwo.name}`;
  } else if (personTwo.age > personOne.age) {
    return `${personTwo.name} is older than ${personOne.name}`;
  } else {
    return `${personOne.name} and ${personTwo.name} are the same age`;
  }
};

// ==========================================
// 11. numberOfKeys
// ==========================================
const numberOfKeys = (obj) => {
  return Object.keys(obj).length;
};

// ==========================================
// 12. factorial
// ==========================================
const factorial = (num) => {
  if (num === 0 || num === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
};


// ==========================================
// 🧪 Testing Section (لتجربة الكود ورؤية النتائج)
// ==========================================
console.log("--- Test Results ---");
console.log("1. average(10, 20) =>", average(10, 20));
console.log("2. toThePowerOf(2, 3) =>", toThePowerOf(2, 3));
console.log("3. oneOrZero() =>", oneOrZero());
console.log("4. incrementOne(5) =>", incrementOne(5));
console.log("5. addToArray(['A', 'B'], 'C') =>", addToArray(['A', 'B'], 'C'));
console.log("6. accessElement([100, 200, 300], 1) =>", accessElement([100, 200, 300], 1));
console.log("7. arrayMiddle([1, 2, 3]) =>", arrayMiddle([1, 2, 3]));
console.log("7. arrayMiddle([1, 2, 3, 4]) =>", arrayMiddle([1, 2, 3, 4]));
console.log("8. oddIndexEvenLength(['Hi', 'Hello', 'Cool', 'Code']) =>", oddIndexEvenLength(['Hi', 'Hello', 'Cool', 'Code']));
console.log("9. convertToString(['H', 'e', 'l', 'l', 'o']) =>", convertToString(['H', 'e', 'l', 'l', 'o']));
console.log("10. olderThan =>", olderThan({ name: "Ahmad", age: 14 }, { name: "Arwa", age: 16 }));
console.log("11. numberOfKeys =>", numberOfKeys({ math: 90, english: 85, arabic: 66 }));
console.log("12. factorial(5) =>", factorial(5));