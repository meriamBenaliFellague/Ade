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
let isModalOpen = false;

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

// Handle Forgot Password form submission
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = resetEmailInput.value.trim();
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        resetMessage.textContent = '';
        resetMessage.className = 'reset-message';
        
        // Simple email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showErrorMessage('Please enter a valid email address');
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            resetEmailInput.focus();
            return;
        }
        
        try {
            // Here you would typically make an API call to your backend
            // For example:
            /*
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            */
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes, we'll simulate a successful response
            const success = true; // Replace with actual API response check
            
            if (success) {
                showSuccessMessage('Password reset link has been sent to your email address.');
                
                // Clear the form and hide the message after 3 seconds
                setTimeout(() => {
                    forgotPasswordForm.reset();
                    closeForgotPasswordModal();
                }, 3000);
            } else {
                throw new Error('Failed to send reset link');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Error sending reset link. Please try again later.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
        }
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