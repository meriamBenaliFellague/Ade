const container = document.querySelector('.container');
const registrBtn = document.querySelector('.registr-btn');
const loginBtn = document.querySelector('.login-btn');
const btnR =  document.getElementById('btn-register');
const btnL =  document.getElementById('btn-login');

// Forgot Password Modal Elements
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPassword = document.querySelector('.close-forgot-password');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetEmailInput = document.getElementById('resetEmail');
const resetMessage = document.getElementById('resetMessage');
const emailStep = document.getElementById('emailStep');
const verificationStep = document.getElementById('verificationStep');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const verificationCodeInput = document.getElementById('verificationCode');
const newPasswordSection = document.getElementById('newPasswordSection');
const updatePasswordBtn = document.getElementById('updatePasswordBtn');
let resetEmail = '';

// Password Visibility Toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('pass');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('bx-show');
        this.classList.toggle('bx-hide');
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    });
}

// Login Button Animation
const loginForm = document.querySelector('form[action="/api/Admin"]');
const loginButton = document.getElementById('btn-login');

if (loginForm && loginButton) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const username = document.getElementById('nameUser').value.trim();
        const password = document.getElementById('pass').value;
        
        if (!username || !password) {
            // Add shake animation for empty fields
            if (!username) {
                document.getElementById('nameUser').classList.add('shake');
                setTimeout(() => document.getElementById('nameUser').classList.remove('shake'), 500);
            }
            if (!password) {
                document.getElementById('pass').classList.add('shake');
                setTimeout(() => document.getElementById('pass').classList.remove('shake'), 500);
            }
            return;
        }
        
        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual fetch)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // If login is successful, add success animation
            loginButton.classList.add('success');
            loginButton.innerHTML = '<i class="bx bx-check"></i> Success! Redirecting...';
            
            // Redirect after a delay (replace with actual redirect)
            setTimeout(() => {
                // window.location.href = '/dashboard'; // Uncomment for actual redirect
                console.log('Login successful, redirecting...');
            }, 1000);
            
        } catch (error) {
            // Show error state
            loginButton.classList.remove('loading');
            loginButton.classList.add('error');
            loginButton.innerHTML = '<i class="bx bx-error"></i> Login Failed';
            
            // Reset button after delay
            setTimeout(() => {
                loginButton.classList.remove('error');
                loginButton.innerHTML = '<span class="btn-text">Login</span><i class="bx bx-log-in-circle"></i>';
                loginButton.disabled = false;
            }, 2000);
        }
    });
}

// Open Forgot Password Modal
function openForgotPasswordModal(e) {
    e.preventDefault();
    forgotPasswordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset the form and show email step
    emailStep.style.display = 'block';
    verificationStep.style.display = 'none';
    newPasswordSection.style.display = 'none';
    verifyCodeBtn.style.display = 'block';
    if (updatePasswordBtn) updatePasswordBtn.style.display = 'none';
    if (verificationCodeInput) verificationCodeInput.disabled = false;
    resetEmail = '';
    forgotPasswordForm.reset();
}

// Close Forgot Password Modal
function closeForgotPasswordModal() {
    forgotPasswordModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form state
    emailStep.style.display = 'block';
    verificationStep.style.display = 'none';
    newPasswordSection.style.display = 'none';
    verifyCodeBtn.style.display = 'block';
    if (updatePasswordBtn) updatePasswordBtn.style.display = 'none';
    if (verificationCodeInput) verificationCodeInput.disabled = false;
    resetEmail = '';
    forgotPasswordForm.reset();
    resetMessage.textContent = '';
    resetMessage.className = 'reset-message';
}

// Close modal when clicking outside of it or on close button
if (closeForgotPassword) {
    closeForgotPassword.addEventListener('click', closeForgotPasswordModal);
}

window.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        closeForgotPasswordModal();
    }
});

// Handle Verify Code button click
if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener('click', async () => {
        const code = verificationCodeInput.value.trim();
        
        if (!code || code.length !== 5 || !/^\d+$/.test(code)) {
            showResetMessage('Please enter a valid 5-digit code', 'error');
            verificationCodeInput.focus();
            return;
        }
        
        try {
        const response = await fetch("http://localhost:3000/api/VerifyResetCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
            code: code }) 
        });
        const data = await response.json();
       
        if (data.message === "Reset code invalide or expired") {
            setTimeout(() => {
                 showResetMessage('Reset code invalide or expired. Please try again.','error');
                emailStep.style.display = 'block';
                verificationStep.style.display = 'none';
                resetEmail = '';
                verificationCodeInput.disabled = true;
                resetEmailInput.value = '';
            }, 300);
        } else if(data.message === "Reset code valide") {  
            setTimeout(() => {
                showResetMessage('Code verified! Please set your new password.','success');
        
       // Show password fields and update button
        newPasswordSection.style.display = 'block';
        emailStep.style.display = 'none';
        if (updatePasswordBtn) updatePasswordBtn.style.display = 'block';
        verifyCodeBtn.style.display = 'none';
        verificationCodeInput.disabled = true;
            }, 1000);
        } 
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    });
}

// Handle Update Password button click
if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', async () => {
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Simple validation
        if (!newPassword) {
            showResetMessage('Please enter a new password', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showResetMessage('Passwords do not match', 'error');
            return;
        }
        
        try {
        const response = await fetch("http://localhost:3000/api/ResetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
            newPass: newPassword }) 
        });
        const data = await response.json();
       
        if (data.message === "Update password") {
            // For demo purposes, show success message
            console.log('Password updated successfully!')
            showResetMessage('Password updated successfully!','success');
        
        // Close the modal after 2 seconds
        setTimeout(() => {
            closeForgotPasswordModal();
        }, 2000);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    });
}

// Handle Forgot Password form submission
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = resetEmailInput.value.trim();
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        resetMessage.textContent = '';
        resetMessage.className = 'reset-message';
        
        // Simple email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showResetMessage('Please enter a valid email address', 'error');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            resetEmailInput.focus();
            return false;
        }
        
         try {
        const response = await fetch("http://localhost:3000/api/forgetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
            email: email }) 
        });
        const data = await response.json();
       
        if (data.message === "the account not exists") {
            showResetMessage('Error processing your request. Please try again.','error');
        } else if(data.message === "code sent to email") {
            setTimeout(() => {
           
                // Save the email and show verification step
                verificationCodeInput.value = '';
                resetEmail = email;
                emailStep.style.display = 'none';
                verificationStep.style.display = 'block';
                verificationCodeInput.focus();
                
                // Update the message
                showResetMessage(`A verification code has been sent to ${email}`,'success');
            }, 1000);
        }  
         submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    });
}

// Helper function to show reset message
function showResetMessage(message, type) {
    resetMessage.textContent = message;
    resetMessage.className = 'reset-message';
    
    if (type === 'success') {
        resetMessage.classList.add('success');
    } else if (type === 'error') {
        resetMessage.classList.add('error');
        
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (resetMessage.textContent === message) {
                resetMessage.textContent = '';
                resetMessage.className = 'reset-message';
            }
        }, 5000);
    }
}


//login Admin
btnL.addEventListener('click', async function (e) {
    e.preventDefault();
    const socket = io('http://localhost:3000');
    const nameUser = document.getElementById('nameUser').value.trim();
    const pass = document.getElementById('pass').value.trim();
    console.log(nameUser);
     if (!nameUser || !pass) {
            // Add shake animation for empty fields
            if (!nameUser) {
                document.getElementById('nameUser').classList.add('is-invalid');
            }
            if (!pass) {
                document.getElementById('pass').classList.add('is-invalid');
            }
            return;
        }
    try {
        const response = await fetch("http://localhost:3000/api/Admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
            username: nameUser,  
            password: pass }) 
        });
        const data = await response.json();
        console.log(data.message)
       const socket = io("http://localhost:3000");
        if (data.message === "the account admin exists") {
            window.location.href = "/Home/LoginAdmin/Dashboard"; 
            socket.emit("register", data.adminId);
            socket.emit("get receiverId", data.adminId);
            sessionStorage.setItem("adminId", data.adminId);
        } else if(data.message === "the account leader exists") {
            window.location.href = "/Home/LoginLeader/Dashboard";
            socket.emit("register", data.leaderId);
            sessionStorage.setItem("leaderId", data.leaderId);
        } else{
            alert("❌ Incorrect username or password!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});