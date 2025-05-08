# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Aap yeh line likh rahe ho:

const token = localStorage.getItem("token");

Jab user ne login kiya tha, backend ne ek token diya (mostly JWT).

Frontend ne us token ko localStorage me store kar diya:

localStorage.setItem("token", tokenFromBackend);


Ab jab bhi aapko protected backend route hit karna hai,

aapko yeh token uthana padega aur request me bhejna padega.

🔍 2️⃣ Axios request me headers me bhejna
Aap yeh likh rahe ho:


axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
    headers: { Authorization: `Bearer ${token}` },
});

Aap request ke HTTP headers me ek key Authorization bhej rahe ho.

value ha Bearer <token>

req.headers.authorization ko read karta hai.

Check karta hai:

Kya header hai?

Kya Bearer se start ho raha hai?

Fir token ko verify karta hai (JWT verify, ya custom logic).

Agar token valid hai → backend data bhejta hai.
Agar invalid hai → backend 401 Unauthorized return karta hai.







https://chatgpt.com/c/68173a2b-63d4-800b-b583-f7093d9fe4ca\

<!-- 
profile ek object hai jo Google OAuth tumhe deta hai, jab user successfully authenticate ho jata hai.

👉 Jab user Google ke login page pe apna email/password enter karta hai aur "Allow" karta hai → Google tumhare backend ko user ke profile ka data bhejta hai.

Ye data OAuth (Open Authorization) ke zariye aata hai. -->
<!-- profile ek object hai jo Google OAuth tumhe deta hai, jab user successfully authenticate ho jata hai.

👉 Jab user Google ke login page pe apna email/password enter karta hai aur "Allow" karta hai → Google tumhare backend ko user ke profile ka data bhejta hai.

Ye data OAuth (Open Authorization) ke zariye aata hai. -->
profile ek JavaScript object hota hai → iske andar user ke Google account ka basic data hota hai.
profile.id → Google ke taraf se diya gaya unique ID hota hai (har Google account ke liye unique hota hai).

💡 Isko tumhare database me googleId field me store kiya jata hai → taaki pata chale ki yeh user Google ke kaunse account se login hua tha.

👀 5. Why googleId is important?
Isliye important hai:

Agar ek user ne pehle Google se login kiya tha → agle login pe hum googleId se user ko pehchaan lenge

Agar googleId se koi user nahi mila → ho sakta user ne normal email/password se register kiya ho

Phir hum email se check karte hain (taaki duplicate account na bane)