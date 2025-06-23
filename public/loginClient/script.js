const container = document.querySelector('.container');
const registrBtn = document.querySelector('.registr-btn');
const loginBtn = document.querySelector('.login-btn');
const btnR = document.getElementById('btn-register');
const btnL = document.getElementById('btn-login');

// Form validation elements
const usernameInput = document.getElementById('Username');
const emailInput = document.getElementById('Email');
const registerPasswordInput = document.getElementById('Password');
const usernameValidation = document.querySelector('.username-availability');
const emailValidation = document.querySelector('.email-valid');
const passwordStrengthText = document.querySelector('.strength-text span');
const strengthSegments = document.querySelectorAll('.strength-segment');
const requirementItems = document.querySelectorAll('.requirement');

// Password toggle functionality
const togglePassword = document.getElementById('togglePassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const loginPasswordInput = document.getElementById('pass');

// Username validation
let usernameTimeout;
const checkUsernameAvailability = async (username) => {
    // Simulate API call (replace with actual API call)
    return new Promise(resolve => {
        // Simulate network delay
        setTimeout(() => {
            // For demo purposes, consider a username taken if it's 'admin' or 'user'
            const isAvailable = !['admin', 'user', 'test'].includes(username.toLowerCase());
            resolve(isAvailable);
        }, 500);
    });
};

const validateUsername = async (username) => {
    clearTimeout(usernameTimeout);
    
    if (username.length === 0) {
        usernameValidation.textContent = '';
        usernameValidation.className = 'username-availability';
        return false;
    }

    // Check length requirements
    if (username.length < 3 || username.length > 20) {
        usernameValidation.textContent = '✕';
        usernameValidation.className = 'username-availability';
        return false;
    }

    // Check allowed characters (letters, numbers, underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        usernameValidation.textContent = '✕';
        usernameValidation.className = 'username-availability';
        return false;
    }

    // Show loading state
    usernameValidation.textContent = '...';
    usernameValidation.className = 'username-availability checking';

    // Debounce the API call
    return new Promise((resolve) => {
        usernameTimeout = setTimeout(async () => {
            const isAvailable = await checkUsernameAvailability(username);
            if (isAvailable) {
                usernameValidation.textContent = '✓';
                usernameValidation.className = 'username-availability available';
                resolve(true);
            } else {
                usernameValidation.textContent = '✕';
                usernameValidation.className = 'username-availability';
                resolve(false);
            }
        }, 800);
    });
};

// Email validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (email.length === 0) {
        emailValidation.textContent = '';
        emailValidation.className = 'email-valid';
        return false;
    }
    
    if (isValid) {
        emailValidation.textContent = '✓';
        emailValidation.className = 'email-valid valid';
    } else {
        emailValidation.textContent = '✕';
        emailValidation.className = 'email-valid';
    }
    
    return isValid;
};

// Password strength checker
const checkPasswordStrength = (password) => {
    let strength = 0;
    const requirements = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    };

    // Check length
    if (password.length >= 8) {
        strength += 1;
        requirements.length = true;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        strength += 1;
        requirements.uppercase = true;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        strength += 1;
        requirements.lowercase = true;
    }

    // Check for numbers
    if (/[0-9]/.test(password)) {
        strength += 1;
        requirements.number = true;
    }


    // Check for special characters
    if (/[!@#$%^&*]/.test(password)) {
        strength += 1;
        requirements.special = true;
    }

    // Update requirement indicators
    requirementItems.forEach(item => {
        const requirement = item.getAttribute('data-requirement');
        if (requirements[requirement]) {
            item.classList.add('valid');
        } else {
            item.classList.remove('valid');
        }
    });

// Update strength meter
    updatePasswordStrengthMeter(strength);
    
    return strength;
};

const updatePasswordStrengthMeter = (strength) => {
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#ff4444', '#ff6b6b', '#ffd166', '#06d6a0', '#4CAF50'];
    
    // Update text
    passwordStrengthText.textContent = strengthTexts[strength - 1] || 'Very Weak';
    passwordStrengthText.style.color = strengthColors[strength - 1] || '#ff4444';
    
    // Update segments
    strengthSegments.forEach((segment, index) => {
        if (index < strength) {
            segment.style.backgroundColor = strengthColors[strength - 1];
            segment.style.flexGrow = '1';
        } else {
            segment.style.backgroundColor = '#e0e0e0';
            segment.style.flexGrow = '0.5';
        }
    });
};

// Toggle password visibility for login form
if (togglePassword && loginPasswordInput) {
    togglePassword.addEventListener('click', function() {
        const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPasswordInput.setAttribute('type', type);
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

// Event listeners for real-time validation
if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        validateUsername(e.target.value.trim());
    });
}

if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        validateEmail(e.target.value.trim());
    });
}

if (registerPasswordInput) {
    registerPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        checkPasswordStrength(password);
    });
}

// Create account with validation
btnR.addEventListener('click', async function (e) {
    e.preventDefault();
    
    const Username = usernameInput ? usernameInput.value.trim() : '';
    const Email = emailInput ? emailInput.value.trim() : '';
    const Password = registerPasswordInput ? registerPasswordInput.value.trim() : '';
    
    // Validate all fields
    const isUsernameValid = await validateUsername(Username);
    const isEmailValid = validateEmail(Email);
    const isPasswordValid = checkPasswordStrength(Password) >= 3; // At least 'Fair' strength
    
    // Show validation errors
    if (!Username) {
        usernameInput.classList.add('is-invalid');
        usernameInput.focus();
        return;
    } else if (!isUsernameValid) {
        usernameInput.classList.add('is-invalid');
        usernameInput.focus();
        return;
    }
    
    if (!Email) {
        emailInput.classList.add('is-invalid');
        if (Username) emailInput.focus();
        return;
    } else if (!isEmailValid) {
        emailInput.classList.add('is-invalid');
        emailInput.focus();
        return;
    }
    
    if (!Password) {
        registerPasswordInput.classList.add('is-invalid');
        if (Email) registerPasswordInput.focus();
        return;
    } else if (!isPasswordValid) {
        registerPasswordInput.classList.add('is-invalid');
        registerPasswordInput.focus();
        return;
    }
    
    // Additional email format validation
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)) {
        document.getElementById('Email').classList.add('is-invalid');
        emailInput.focus();
        return;
    }
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
        if (data.message === "the account exists") {
            alert('⚠️ This email or username is already in use. Please log in or use a different information.'); // ✅ انتقال إلى صفحة أخرى
        }else{
             alert('The account has been added successfully.');
        }

       
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
    if (nameUser === '' || pass === '') {
        document.getElementById('nameUser').classList.add('is-invalid');
        document.getElementById('pass').classList.add('is-invalid');
        return;
  }
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
            alert("❌ Incorrect username or password!");
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
async function closeForgotPasswordModal() {
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
    verifyCodeBtn.addEventListener('click', async() => {
        const code = verificationCodeInput.value.trim();

        resetMessage.textContent = '';
        resetMessage.className = 'reset-message';
        
        if (!code || code.length !== 5 || !/^\d+$/.test(code)) {
            showErrorMessage('Please enter a valid 5-digit code');
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
                showErrorMessage('Reset code invalide or expired. Please try again.');
                emailStep.style.display = 'block';
                verificationStep.style.display = 'none';
                resetEmail = '';
                verificationCodeInput.disabled = true;
                resetEmailInput.value = '';
            }, 300);
        } else if(data.message === "Reset code valide") {  
            setTimeout(() => { 
            
                showSuccessMessage('Code verified! Please set your new password.');
        
        // Show password fields and update button
        emailStep.style.display = 'none';
        document.getElementById('newPasswordSection').style.display = 'block';
        document.getElementById('updatePasswordBtn').style.display = 'block';
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
const updatePasswordBtn = document.getElementById('updatePasswordBtn');
if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', async() => {
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
            showErrorMessage('Error processing your request. Please try again.');
        } else if(data.message === "code sent to email") {
            setTimeout(() => {
           
                // Save the email and show verification step
                verificationCodeInput.value = '';
                resetEmail = email;
                emailStep.style.display = 'none';
                verificationStep.style.display = 'block';
                verificationCodeInput.focus();
                
                // Update the message
                showSuccessMessage(`A verification code has been sent to ${email}`);
            }, 1000);
        }  
         submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
    } catch (error) {
        console.error("Error fetching data:", error);
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
}

