// script.js

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL; // Obtiene la URL de Supabase desde las variables de entorno
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Obtiene la clave de Supabase desde las variables de entorno
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// -------------------------------------------------- 
//  MANEJADORES DE EVENTOS
// -------------------------------------------------- 

// Manejador del formulario de suscripción
document.getElementById("subscription-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario
  const email = document.getElementById("email").value; // Obtiene el valor del campo de correo electrónico

  try {
    // Intenta registrar al usuario con Supabase
    const { user, error } = await supabase.auth.signUp({
      email: email,
    });

    if (error) {
      // Muestra una alerta si hay un error al registrarse
      alert("Error al registrarse: " + error.message);
      return;
    }

    // Muestra una alerta si el registro es exitoso
    alert("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
  } catch (err) {
    // Muestra un error en la consola si hay un error en el proceso de registro
    console.error("Error en el registro: ", err);
  }
});

// Manejadores de autenticación con Google, GitHub y Apple
document.getElementById("google-auth").addEventListener("click", () => {
  supabase.auth.signInWithOAuth({ provider: "google" }); // Inicia sesión con Google
});

// Manejador de inicio de sesión con GitHub
document.getElementById("github-auth").addEventListener("click", signInWithGithub);

document.getElementById("apple-auth").addEventListener("click", () => {
  supabase.auth.signInWithOAuth({ provider: "apple" }); // Inicia sesión con Apple
});

// -------------------------------------------------- 
//  VERIFICACIÓN DE CORREO CON VIRUSTOTAL
// -------------------------------------------------- 

const VIRUS_TOTAL_API_KEY = process.env.VIRUS_TOTAL_API_KEY; // Obtiene la clave de VirusTotal desde las variables de entorno

// Manejador del formulario de verificación de correo
document.getElementById("email-check-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario
  const email = document.getElementById("check-email").value; // Obtiene el valor del campo de correo electrónico

  try {
    // Intenta verificar el correo electrónico con VirusTotal
    const response = await fetch("https://www.virustotal.com/api/v3/domains/" + email, {
      headers: {
        "x-apikey": VIRUS_TOTAL_API_KEY,
      },
    });

    if (!response.ok) {
      // Muestra una alerta si hay un error al verificar el correo
      alert("Error al verificar el correo.");
      return;
    }

    // Muestra el resultado de la verificación en la página
    const data = await response.json();
    document.getElementById("email-check-result").textContent =
      `Estado: ${data.data.attributes.last_analysis_stats.harmless} análisis sin problemas.`;
  } catch (err) {
    // Muestra un error en la consola si hay un error en el proceso de verificación
    console.error("Error verificando correo: ", err);
  }
});

// -------------------------------------------------- 
//  GESTOR DE CONTRASEÑAS
// -------------------------------------------------- 

// Manejador del formulario del gestor de contraseñas
document.getElementById("password-manager-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario
  const siteName = document.getElementById("site-name").value; // Obtiene el nombre del sitio
  const username = document.getElementById("username").value; // Obtiene el nombre de usuario
  const password = document.getElementById("password").value; // Obtiene la contraseña

  // Encriptación simple con btoa (recomendado reemplazar con una librería de cifrado más fuerte como CryptoJS)
  const encryptedPassword = btoa(password); // Encripta la contraseña

  try {
    // Intenta guardar la contraseña en Supabase
    const { data, error } = await supabase
      .from("password_manager")
      .insert([{ site: siteName, username: username, password: encryptedPassword }]);

    if (error) {
      // Muestra una alerta si hay un error al guardar la contraseña
      alert("Error guardando la contraseña: " + error.message);
      return;
    }

    // Muestra un mensaje en la página si la contraseña se guarda correctamente
    document.getElementById("password-manager-result").textContent = "Contraseña guardada correctamente.";
  } catch (err) {
    // Muestra un error en la consola si hay un error en el proceso de guardar la contraseña
    console.error("Error en gestor de contraseñas: ", err);
  }
});

// -------------------------------------------------- 
//  MENÚ DESPLEGABLE
// -------------------------------------------------- 

// Obtiene todos los elementos con la clase 'dropdown-toggle'
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

// Recorre cada elemento y agrega un evento 'click'
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    // Obtiene el elemento padre (el <li>)
    const dropdown = toggle.parentNode;
    // Alterna la clase 'show' para mostrar/ocultar el submenú
    dropdown.classList.toggle('show');
  });
});
// -------------------------------------------------- 
//  FUNCIONES DE AUTENTICACIÓN
// -------------------------------------------------- 

// Función para iniciar sesión con GitHub
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  });

  if (error) {
    console.error('Error al iniciar sesión con GitHub:', error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
  } else {
    console.log('Inicio de sesión con GitHub exitoso:', data);
    // Redirigir al usuario a la página principal o a una página protegida
  }
}

// Función para cerrar sesión
async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error al cerrar sesión:', error);
    // Manejar el error
  } else {
    console.log('Sesión cerrada correctamente');
    // Redirigir al usuario a la página de inicio de sesión
  }
}