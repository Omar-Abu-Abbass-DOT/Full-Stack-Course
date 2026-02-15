/*
  Task: JavaScript Basics
  Student: Omar Abu Abbass
  Date: 2026-02-16
*/

// ==========================================
// 1️⃣ Question 1: Predict the Output
// ==========================================
console.log("--- Q1 Outputs ---");

let x;
console.log(x); // Output: undefined

console.log("5" + 3); // Output: "53"

console.log("5" - 3); // Output: 2

console.log(5 == "5"); // Output: true

console.log(5 === "5"); // Output: false

let ageCheck = 16;
if (ageCheck >= 18) {
  console.log("Adult");
} else {
  console.log("Minor"); // Output: Minor
}


// ==========================================
// 2️⃣ Question 2: Fix the Code
// ==========================================
console.log("\n--- Q2 Fixed Code ---");

// Fix 1: Use 'let' instead of 'const' for reassignable variables
let age = 20; 
age = 25;
console.log("Age is:", age);

// Fix 2: Add parentheses ( ) for condition
let name = "Ali";
if (name == "Ali") {
  console.log("Hello Ali");
}

// Fix 3: Use comparison operator (===) instead of assignment (=)
let num = 10;
if (num === 10) {
  console.log("Ten");
}


// ==========================================
// 3️⃣ Question 3: Write the Code
// ==========================================
console.log("\n--- Q3 Written Code ---");

// 1. Student Name & Age
let studentName = "Omar";
let studentAge = 24;
console.log(`Student: ${studentName}, Age: ${studentAge}`);

// 2. Positive/Negative Check
let number = -10; 
if (number > 0) {
    console.log(`${number} is Positive`);
} else if (number < 0) {
    console.log(`${number} is Negative`);
} else {
    console.log("Number is Zero");
}

// 3. Pass or Fail
let mark = 65;
if (mark >= 50) {
    console.log("Result: Pass");
} else {
    console.log("Result: Fail");
}

// 4. For Loop (1 to 10)
console.log("Loop 1-10:");
for (let i = 1; i <= 10; i++) {
    process.stdout.write(i + " "); // Printing in one line (optional) or use console.log
}
console.log(""); // New line

// 5. While Loop (10 to 1)
console.log("Loop 10-1:");
let count = 10;
while (count >= 1) {
    process.stdout.write(count + " ");
    count--;
}
console.log(""); // New line