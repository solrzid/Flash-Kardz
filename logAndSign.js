
window.addEventListener("load", function () {
    setTimeout(function () {
      const logoContainer = document.querySelector(".logo-container");
      const loginContainer = document.querySelector(".login-container");
      if (logoContainer) logoContainer.style.display = "none";
      if (loginContainer) loginContainer.style.display = "block";
    }, 2000);
  });
  
  function showPopup(message) {
    document.getElementById("popup-message").textContent = message;
    document.getElementById("popup-modal").style.display = "flex";
  }
  
  function closePopup() {
    document.getElementById("popup-modal").style.display = "none";
  }
  
  

  function validateSignUp(event) {
    event.preventDefault(); 
  
   
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
  
    
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      showPopup("Passwords do not match. Please try again.");
      return;
    }
  
   
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      showPopup("Username already exists. Please choose a different username.");
      return;
    }
  
    users[username] = { email, password };
    localStorage.setItem("users", JSON.stringify(users));
    showPopup("Sign-up successful! You can now log in.");
    window.location.href = "logIn.html"; 
  }
  
  function handleLogIn(event) {
    event.preventDefault(); 
  
    
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
  
    
    if (!username || !password) {
      showPopup("Please fill in both username and password.");
      return;
    }
  

    const users = JSON.parse(localStorage.getItem("users")) || {};
  
    if (users[username] && users[username].password === password) {
      showPopup("Login successful!");
     
      setTimeout(() => {
        window.location.href = "home.html"; 
      }, 2000); 
    } else {
      showPopup("Invalid username or password. Please try again.");
    }
  }

  
  function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const eyeIcon = document.getElementById("eye-icon");
  
    if (passwordField.type === "password") {
      passwordField.type = "text";
      if (confirmPasswordField) confirmPasswordField.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    } else {
      passwordField.type = "password";
      if (confirmPasswordField) confirmPasswordField.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  }