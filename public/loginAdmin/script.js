const container = document.querySelector('.container');
const registrBtn = document.querySelector('.registr-btn');
const loginBtn = document.querySelector('.login-btn');
const btnR =  document.getElementById('btn-register');
const btnL =  document.getElementById('btn-login');

// Forgot Password Modal Elements
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPassword = document.querySelector('.close-forgot-password');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetEmail = document.getElementById('resetEmail');
const resetMessage = document.getElementById('resetMessage');

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
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Close Forgot Password Modal
function closeForgotPasswordModal() {
    forgotPasswordModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
    // Reset form
    forgotPasswordForm.reset();
    resetMessage.style.display = 'none';
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        closeForgotPasswordModal();
    }
});

// Close button event
closeForgotPassword.addEventListener('click', closeForgotPasswordModal);

// Handle Forgot Password form submission
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = resetEmail.value.trim();
    const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.innerHTML;
    
    if (!email) {
        showResetMessage('Please enter your email address', 'error');
        return;
    }
    
    // Simple email validation
    if (!isValidEmail(email)) {
        showResetMessage('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('btn-loading');
        submitButton.innerHTML = '<span class="btn-text">Sending...</span>';
        
        // Simulate API call (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful response (replace with actual API response handling)
        showResetMessage('Password reset link has been sent to your email!', 'success');
        forgotPasswordForm.reset();
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closeForgotPasswordModal();
        }, 3000);
        
    } catch (error) {
        console.error('Error:', error);
        showResetMessage('An error occurred. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        submitButton.innerHTML = buttonText;
    }
});

// Helper function to show reset message
function showResetMessage(message, type) {
    resetMessage.textContent = message;
    resetMessage.className = 'reset-message';
    resetMessage.classList.add(type);
    resetMessage.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        resetMessage.style.opacity = '0';
        setTimeout(() => {
            resetMessage.style.display = 'none';
            resetMessage.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Simple email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

//login Admin
btnL.addEventListener('click', async function (e) {
    e.preventDefault();
    const socket = io('http://localhost:3000');
    const nameUser = document.getElementById('nameUser').value.trim();
    const pass = document.getElementById('pass').value.trim();
    console.log(nameUser);
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
        console.log(data.adminId)
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