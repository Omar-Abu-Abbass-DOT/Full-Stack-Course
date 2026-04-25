import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    home: "Home", cart: "Cart", myOrders: "My Orders", admin: "Admin Panel",
    login: "Login", register: "Register", logout: "Logout",
    // Home
    heroTitle: "Discover Amazing Products",
    heroSubtitle: "Shop the best deals — fast shipping, top quality, unbeatable prices.",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    noProducts: "No products found",
    loading: "Loading...",
    // Product Detail
    description: "Description",
    quantity: "Quantity",
    category: "Category",
    available: "available",
    backToHome: "← Back to Home",
    // Cart
    shoppingCart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    remove: "Remove",
    total: "Total",
    placeOrder: "Place Order",
    subtotal: "Subtotal",
    // Orders
    myOrdersTitle: "My Orders",
    noOrders: "You have no orders yet.",
    orderNumber: "Order",
    orderTotal: "Total",
    // Status
    pending: "Pending",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    // Admin
    adminDashboard: "Admin Dashboard",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    addProduct: "Add New Product",
    editProduct: "Edit Product",
    addCategory: "Add New Category",
    editCategory: "Edit Category",
    name: "Name",
    price: "Price ($)",
    stock: "Stock",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    imageUrl: "Image URL",
    selectCategory: "Select Category",
    updateStatus: "Update Status",
    customer: "Customer",
    // Auth
    email: "Email Address",
    password: "Password",
    fullName: "Full Name",
    loginTitle: "Welcome Back!",
    loginSubtitle: "Sign in to continue shopping",
    registerTitle: "Create Account",
    registerSubtitle: "Join thousands of happy shoppers",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign Up",
    signIn: "Sign In",
    confirmPassword: "Confirm Password",
    // Favorites & Profile
    favorites: "Favorites",
    noFavorites: "No favorites yet",
    noFavoritesHint: "Click the heart icon on any product to save it here.",
    startShopping: "Start Shopping",
    addedToFav: "added to favorites",
    removedFromFav: "removed from favorites",
    addToFav: "Save to Favorites",
    savedToFav: "Saved ❤️",
    addedToCart: "added to cart",
    myProfile: "My Profile",
    totalOrders: "Total Orders",
    memberSince: "Member Since",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    newPassword: "New Password",
    leaveBlank: "Leave blank to keep current",
    profileUpdated: "Profile updated successfully",
    updateFailed: "Failed to update profile",
    passwordMismatch: "Passwords do not match",
    products: "Products",
    description: "Description",
  },
  ar: {
    // Navbar
    home: "الرئيسية", cart: "السلة", myOrders: "طلباتي", admin: "لوحة الإدارة",
    login: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج",
    // Home
    heroTitle: "اكتشف منتجات رائعة",
    heroSubtitle: "تسوق أفضل العروض — شحن سريع، جودة عالية، أسعار لا تُقارن.",
    searchPlaceholder: "ابحث عن منتجات...",
    allCategories: "جميع الفئات",
    addToCart: "أضف إلى السلة",
    outOfStock: "نفد المخزون",
    inStock: "متوفر",
    noProducts: "لا توجد منتجات",
    loading: "جاري التحميل...",
    // Product Detail
    description: "الوصف",
    quantity: "الكمية",
    category: "الفئة",
    available: "متوفر",
    backToHome: "→ العودة للرئيسية",
    // Cart
    shoppingCart: "سلة التسوق",
    emptyCart: "سلتك فارغة",
    remove: "حذف",
    total: "المجموع",
    placeOrder: "إتمام الطلب",
    subtotal: "المجموع الفرعي",
    // Orders
    myOrdersTitle: "طلباتي",
    noOrders: "لا توجد طلبات بعد.",
    orderNumber: "طلب",
    orderTotal: "المجموع",
    // Status
    pending: "قيد الانتظار",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
    // Admin
    adminDashboard: "لوحة الإدارة",
    products: "المنتجات",
    categories: "الفئات",
    orders: "الطلبات",
    addProduct: "إضافة منتج جديد",
    editProduct: "تعديل المنتج",
    addCategory: "إضافة فئة جديدة",
    editCategory: "تعديل الفئة",
    name: "الاسم",
    price: "السعر ($)",
    stock: "المخزون",
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    cancel: "إلغاء",
    imageUrl: "رابط الصورة",
    selectCategory: "اختر الفئة",
    updateStatus: "تحديث الحالة",
    customer: "العميل",
    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    loginTitle: "مرحباً بعودتك!",
    loginSubtitle: "سجل دخولك لمتابعة التسوق",
    registerTitle: "إنشاء حساب",
    registerSubtitle: "انضم لآلاف المتسوقين السعداء",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    signUp: "إنشاء حساب",
    signIn: "تسجيل الدخول",
    confirmPassword: "تأكيد كلمة المرور",
    // Favorites & Profile
    favorites: "المفضلة",
    noFavorites: "لا توجد مفضلات بعد",
    noFavoritesHint: "اضغط على أيقونة القلب على أي منتج لحفظه هنا.",
    startShopping: "ابدأ التسوق",
    addedToFav: "أُضيف إلى المفضلة",
    removedFromFav: "حُذف من المفضلة",
    addToFav: "حفظ في المفضلة",
    savedToFav: "محفوظ ❤️",
    addedToCart: "أُضيف إلى السلة",
    myProfile: "ملفي الشخصي",
    totalOrders: "إجمالي الطلبات",
    memberSince: "عضو منذ",
    editProfile: "تعديل الملف الشخصي",
    saveChanges: "حفظ التغييرات",
    changePassword: "تغيير كلمة المرور",
    newPassword: "كلمة مرور جديدة",
    leaveBlank: "اتركها فارغة للإبقاء على الحالية",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح",
    updateFailed: "فشل تحديث الملف الشخصي",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    products: "المنتجات",
    description: "الوصف",
  },
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
