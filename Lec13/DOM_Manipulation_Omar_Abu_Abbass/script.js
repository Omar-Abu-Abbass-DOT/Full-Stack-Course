// 1. الوصول للعناصر (Accessing HTML elements)
const loginForm = document.querySelector("#loginForm");
const loginBox = document.querySelector("#loginBox");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const toggleBtn = document.querySelector("#toggleBtn");
const loginBtn = document.querySelector("#loginBtn");
const btnText = document.querySelector("#btnText");
const spinner = document.querySelector("#spinner");
const messageBox = document.querySelector("#message");

// 2. تفاعل إظهار/إخفاء كلمة المرور
toggleBtn.addEventListener("click", () => {
    // تبديل نوع الحقل بين text و password
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    // تغيير شكل الأيقونة
    toggleBtn.classList.toggle("fa-eye");
    toggleBtn.classList.toggle("fa-eye-slash");
});

// 3. التفاعل عند الإرسال (Submit Event)
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // منع تحديث الصفحة

    // تفريغ الرسالة القديمة
    messageBox.innerText = "";
    messageBox.className = "";
    loginBox.classList.remove("shake-animation");

    // الحصول على القيم
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    // تشغيل حالة التحميل (Loading State) - تعديل الـ DOM
    btnText.innerText = "Authenticating...";
    spinner.classList.remove("hidden");
    loginBtn.disabled = true; // تعطيل الزر لمنع الضغط المتكرر

    // استخدام setTimeout لمحاكاة انتظار رد السيرفر (تأخير ثانية ونصف)
    setTimeout(() => {
        // إرجاع الزر لحالته الطبيعية
        btnText.innerText = "Sign In";
        spinner.classList.add("hidden");
        loginBtn.disabled = false;

        // التحقق من صحة البيانات
        if (user === "admin" && pass === "12345") {
            // تسجيل الدخول ناجح
            messageBox.innerText = "✅ Login Successful! Redirecting...";
            messageBox.classList.add("success");
            
            // إضافة تأثير اختفاء تدريجي للنموذج بأكمله (Update UI)
            loginForm.style.opacity = "0.5";
            loginForm.style.pointerEvents = "none";

        } else {
            // بيانات خاطئة
            messageBox.innerText = "❌ Invalid username or password!";
            messageBox.classList.add("error");
            
            // إضافة كلاس الارتجاج (DOM Update)
            loginBox.classList.add("shake-animation");
            
            // إزالة الكلاس بعد انتهاء الأنيميشن لكي يعمل في المرة القادمة
            setTimeout(() => {
                loginBox.classList.remove("shake-animation");
            }, 400);
        }
    }, 1500); // تأخير 1.5 ثانية
});