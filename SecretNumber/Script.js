let intentos; // número de intentos
let num; // número aleatorio

//Obtener un número random
function piensaRandom() {  
    intentos = 0; // reiniciamos el número de intentos
    num = parseInt(Math.random() * 100); // generamos el número aleatorio entre 0 y 99
    console.log("El número es: " + num) // mostramos el número en consola para pruebas
}

// Compara si el número del user es mayor, menor o igual.
function comprueba() { 
    let numUser = parseInt(document.getElementById("numUser").value); // obtenemos el número introducido por el usuario
    let msg = ""  //console.log(numUser)
        ; console.log(numUser) // mostramos el número introducido en consola para pruebas
    if (numUser < num) {  // comprobamos si el número es menor, mayor o igual al número aleatorio
        msg = "El número es más grande";  // mensaje para el usuario
        intentos++; // incrementamos el número de intentos
    } else {
        if (numUser > num) {
            msg = "El número es más pequeño";
            intentos++;
        } else {
            msg = "Has acertado el número: " + num + " en " + intentos + " intentos.";
        }
    }
    console.log(msg);
    document.getElementById("mensajeUser").innerHTML=msg; //console.log(msg);
}