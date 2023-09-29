const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.getElementById("login");


btnLogin.addEventListener("click", (e)=>{
    e.preventDefault ();
    /*const formData = new FormData(e.target);
    const login = Object.fromEntries(formData);
    console.log("Datos enviados", login);*/
    fetch('/api/sessions/login',{
        method:"POST",
        body: {
            email,
            password
        }
    })
    .then(res=>res.json())
    .then(data =>console.log("Los datos del usuario son:", data))
    Swal.fire(
        "Inicio de sesión correcto",
        "succes"
    )
})