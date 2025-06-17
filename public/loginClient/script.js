const container = document.querySelector('.container');
const registrBtn = document.querySelector('.registr-btn');
const loginBtn = document.querySelector('.login-btn');
const btnR =  document.getElementById('btn-register');
const btnL =  document.getElementById('btn-login');

// Password toggle functionality
const togglePassword = document.getElementById('togglePassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const passwordInput = document.getElementById('pass');
const registerPasswordInput = document.getElementById('Password');

// Toggle password visibility for login form
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('bx-show');
        this.classList.toggle('bx-hide');
    });
}

// Toggle password visibility for registration form
if (toggleRegisterPassword && registerPasswordInput) {
    toggleRegisterPassword.addEventListener('click', function() {
        const type = registerPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        registerPasswordInput.setAttribute('type', type);
        this.classList.toggle('bx-show');
        this.classList.toggle('bx-hide');
    });
}

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

// Forgot Password functionality
const forgotPasswordLink = document.querySelector('.forgot-link a');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPassword = document.querySelector('.close-forgot-password');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetMessage = document.getElementById('resetMessage');
const resetEmailInput = document.getElementById('resetEmail');
const emailStep = document.getElementById('emailStep');
const verificationStep = document.getElementById('verificationStep');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const verificationCodeInput = document.getElementById('verificationCode');
let isModalOpen = false;
let resetEmail = '';

// Open Forgot Password modal with animation
function openForgotPasswordModal(e) {
    if (e) e.preventDefault();
    if (isModalOpen) return;
    
    isModalOpen = true;
    forgotPasswordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Trigger reflow
    void forgotPasswordModal.offsetWidth;
    
    // Add active class to trigger animations
    setTimeout(() => {
        forgotPasswordModal.classList.add('active');
    }, 10);
    
    // Set focus on email input after animation
    setTimeout(() => {
        resetEmailInput.focus();
    }, 400);
}

// Close Forgot Password modal with animation
function closeForgotPasswordModal() {
    if (!isModalOpen) return;
    
    forgotPasswordModal.classList.remove('active');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        forgotPasswordModal.style.display = 'none';
        document.body.style.overflow = '';
        resetMessage.textContent = '';
        resetMessage.className = 'reset-message';
        forgotPasswordForm.reset();
        isModalOpen = false;
    }, 300);
}

// Event Listeners
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', openForgotPasswordModal);
}

if (closeForgotPassword) {
    closeForgotPassword.addEventListener('click', closeForgotPasswordModal);
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        closeForgotPasswordModal();
    }
});

// Handle Verify Code button click
if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener('click', () => {
        const code = verificationCodeInput.value.trim();
        
        if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
            showErrorMessage('Please enter a valid 6-digit code');
            verificationCodeInput.focus();
            return;
        }
        
        // For demo purposes, accept any 6-digit code
        showSuccessMessage('Code verified! Please set your new password.');
        
        // Show password fields and update button
        document.getElementById('newPasswordSection').style.display = 'block';
        document.getElementById('updatePasswordBtn').style.display = 'block';
        verifyCodeBtn.style.display = 'none';
        verificationCodeInput.disabled = true;
    });
}

// Handle Update Password button click
const updatePasswordBtn = document.getElementById('updatePasswordBtn');
if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', () => {
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Simple validation
        if (!newPassword) {
            showErrorMessage('Please enter a new password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showErrorMessage('Passwords do not match');
            return;
        }
        
        // For demo purposes, show success message
        showSuccessMessage('Password updated successfully!');
        
        // Close the modal after 2 seconds
        setTimeout(() => {
            closeForgotPasswordModal();
            // Reset the form for next time
            setTimeout(() => {
                emailStep.style.display = 'block';
                verificationStep.style.display = 'none';
                document.getElementById('newPasswordSection').style.display = 'none';
                document.getElementById('updatePasswordBtn').style.display = 'none';
                verifyCodeBtn.style.display = 'block';
                verificationCodeInput.disabled = false;
                resetEmail = '';
                forgotPasswordForm.reset();
            }, 300);
        }, 2000);
    });
}

// Handle Forgot Password form submission
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = resetEmailInput.value.trim();
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        resetMessage.textContent = '';
        resetMessage.className = 'reset-message';
        
        // Hide any previous error messages
        const verificationError = document.getElementById('verificationError');
        if (verificationError) {
            verificationError.style.display = 'none';
            verificationError.textContent = '';
        }
        
        // Simple email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showErrorMessage('Please enter a valid email address');
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            resetEmailInput.focus();
            return false;
        }
        
        // Simulate API call delay with a timeout instead of await
        setTimeout(() => {
            try {
                // Save the email and show verification step
                resetEmail = email;
                emailStep.style.display = 'none';
                verificationStep.style.display = 'block';
                verificationCodeInput.focus();
                
                // Update the message
                showSuccessMessage(`A verification code has been sent to ${email}`);
                
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Error processing your request. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
            }
        }, 1000);
    });
}

// Helper functions for showing messages
function showSuccessMessage(message) {
    resetMessage.textContent = message;
    resetMessage.className = 'reset-message success';
    // Add subtle animation
    resetMessage.style.animation = 'none';
    void resetMessage.offsetWidth; // Trigger reflow
    resetMessage.style.animation = 'slideUp 0.4s forwards';
}

function showErrorMessage(message) {
    resetMessage.textContent = message;
    resetMessage.className = 'reset-message error';
    // Add shake animation for errors
    resetMessage.style.animation = 'none';
    void resetMessage.offsetWidth; // Trigger reflow
    resetMessage.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
}

// Add shake animation for errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
        40%, 60% { transform: translate3d(3px, 0, 0); }
    }
`;
document.head.appendChild(style);