
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<title>Formulaire de Connexion</title>
<style>
  body {
    margin: 0px;
    padding: 0;
    font-family: 'Inter';
    border-radius: 10px;
    background:
        url('assets/background.png') no-repeat center top fixed,
        url('assets/point1.png') no-repeat top fixed,
        url('assets/point2.png') no-repeat bottom fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  header {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px;
  }

  .logo {
      height: 80px; 
  }

  .login-container {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width: 500px;
    height: 400px;
  }
  .login-container h2 {
    text-align: center;
  }
  label {
    display: block;
    margin-top: 30px;
  }
  input[type="email"], input[type="password"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 10px;
  }
  .form-group button {
    width: 200px; 
    padding: 10px;
    border: none;
    background-color: #e74c3c;
    color: white;
    border-radius: 30px;
    cursor: pointer;
    margin: 0 auto; 
    display: block; 
    margin-top: 30px;
    font-size: 18px;
}

.form-group button:hover {
    background-color: #c0392b;
  }
  .forgot-password {
    text-align: center;
    display: block;
    margin-top: 10px;
  }
</style>
</head>
<body>

<header>
    <img src="assets/logo.png" alt="Votre Logo" class="logo" id="logo-light" height="80px">
</header>
<div class="login-container">
  <h2>Bienvenue Administrateur !</h2>
  <form id="loginForm" method="POST"> 
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" required>
    </div>
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input type="password" name="password" id="password" required>
    </div>
    <div class="form-group">
      <button type="submit">Connexion</button>
    </div>
    <p>Mot de passe oublié ?</p>
    <a href="#" class="forgot-password">Changer mon mot de passe</a>
  </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('email')) {
        window.location.href = "accueil-admin.php";
    }

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://127.0.0.1:8000/api/admin/login-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                mot_de_passe: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            sessionStorage.setItem('email', email);
            window.location.href = "accueil-admin.php";
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la connexion.');
        });
    });
});
</script>
</body>
</html>
