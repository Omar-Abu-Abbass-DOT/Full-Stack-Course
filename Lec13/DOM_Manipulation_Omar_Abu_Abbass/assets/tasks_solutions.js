/* ==========================================
   🎯 TASK 1: innerText vs innerHTML vs textContent
   ========================================== */
console.log("--- TASK 1 ---");
const task1Div = document.querySelector("#task1-div");

// 1. innerText:
// يقرأ النص الظاهر فقط (يتجاهل العناصر المخفية بـ CSS).
console.log("innerText: ", task1Div.innerText); 
// النتيجة: "Hello World" (تجاهل كلمة Hidden Text لأنها مخفية)

// 2. textContent:
// يقرأ كل النصوص الموجودة في الكود (حتى لو كانت مخفية بـ CSS).
console.log("textContent: ", task1Div.textContent); 
// النتيجة: "Hello Hidden Text World"

// 3. innerHTML:
// يقرأ النص مع الـ HTML Tags (العلامات) الموجودة داخله.
console.log("innerHTML: ", task1Div.innerHTML); 
// النتيجة: "Hello <span style="display: none;">Hidden Text</span> <strong>World</strong>"


/* ==========================================
   🎯 TASK 3: appendChild vs prepend vs append
   ========================================== */
console.log("\n--- TASK 3 ---");
const task3Div = document.querySelector("#task3-div");

// 1. appendChild():
// يضيف عنصراً واحداً فقط في "نهاية" العنصر الأب. لا يقبل نصوصاً عادية، يقبل فقط عناصر HTML (Nodes).
const btnChild = document.createElement("button");
btnChild.innerText = "Added via appendChild";
task3Div.appendChild(btnChild);

// 2. prepend():
// يضيف عنصراً أو نصاً في "بداية" العنصر الأب (أول شيء).
const newFirstElement = document.createElement("h3");
newFirstElement.innerText = "I am the new First Child!";
task3Div.prepend(newFirstElement); // تم إضافته في البداية

// 3. append():
// يضيف عنصراً أو نصاً في "نهاية" العنصر الأب (مثل appendChild)، 
// لكنه يتميز بأنه يستطيع إضافة نصوص عادية (Strings) ويمكنه إضافة عدة عناصر في نفس الوقت.
task3Div.append(" | This is a text added via append()", document.createElement("br"));


/* ==========================================
   🎯 TASK 4: Add / Remove / Toggle Classes
   ========================================== */
console.log("\n--- TASK 4 ---");
const title = document.querySelector("#task4-title");
const toggleBtn = document.querySelector("#toggleBtn");

// 1. Add Class:
// إضافة كلاس جديد للعنصر.
title.classList.add("active"); 
console.log("Class 'active' added!");

// 2. Remove Class:
// إزالة كلاس من العنصر (قمنا بإزالته بعد ثانيتين للتوضيح).
setTimeout(() => {
    title.classList.remove("active");
    console.log("Class 'active' removed after 2 seconds!");
}, 2000);

// 3. Toggle Class:
// التبديل (إذا كان الكلاس موجوداً يحذفه، وإذا لم يكن موجوداً يضيفه).
// ربطناه بزر لتوضيح الفكرة عملياً.
toggleBtn.addEventListener("click", () => {
    title.classList.toggle("active");
    console.log("Class 'active' toggled!");
});