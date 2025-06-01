const container = document.querySelector('.container');
const registrBtn = document.querySelector('.registr-btn');
const loginBtn = document.querySelector('.login-btn');
const btnR =  document.getElementById('btn-register');
const btnL =  document.getElementById('btn-login');

registrBtn.addEventListener('click',()=> {
    container.classList.add('active');
})
loginBtn.addEventListener('click',()=> {
    container.classList.remove('active');
})

//create count client
btnR.addEventListener('click', async function (e) {
    e.preventDefault();
    const Username = document.getElementById('Username').value.trim();
    const Email = document.getElementById('Email').value.trim();
    const Password = document.getElementById('Password').value.trim();
    
    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ 
            username: Username, 
            email: Email, 
            password: Password }) 
        });
        const data = await response.json();
        alert('تمت العملية بنجاح');
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}); 
//login client
btnL.addEventListener('click', async function (e) {
    e.preventDefault();
    const nameUser = document.getElementById('nameUser').value.trim();
    const pass = document.getElementById('pass').value.trim();
    console.log(nameUser);
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
            username: nameUser,  
            password: pass }) 
        });
        const data = await response.json();
        if (data.message === "the account exists") {
            window.location.href = "/Reclamation"; // ✅ انتقال إلى صفحة أخرى
        } else {
            alert("❌ Incorrect username or password!                                                    ❌ اسم المستخدم أو كلمة المرور غير صحيحة!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

//forget password