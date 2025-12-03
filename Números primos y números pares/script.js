/**
 * Función para encontrar números primos en un rango
 * Versión simplificada para que parezca hecha por estudiante
 */
function encontrarPrimos() {
    // Obtener valores de los inputs
    let inicio = parseInt(document.getElementById("inicio").value) || 2;
    let fin = parseInt(document.getElementById("fin").value) || 100;
    
    // Crear variable para almacenar resultados
    let resultado = "Números primos encontrados:<br>";
    let contador = 0;
    
    // Verificar cada número en el rango
    for (let num = inicio; num <= fin; num++) {
        // Saltar números menores que 2
        if (num < 2) continue;
        
        // Asumir que es primo al inicio
        let esPrimo = true;
        
        // Verificar si es divisible por algún número
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                esPrimo = false;
                break;
            }
        }
        
        // Si es primo, añadirlo al resultado
        if (esPrimo) {
            resultado += num + " ";
            contador++;
            
            // Agregar salto de línea cada 10 números
            if (contador % 10 === 0) {
                resultado += "<br>";
            }
        }
    }
    
    // Mostrar total
    resultado += "<br><br>Total: " + contador + " números primos";
    
    // Mostrar en la página
    document.getElementById("resultadoPrimos").innerHTML = resultado;
}

/**
 * Función para verificar si un número es par
 * Versión simplificada para que parezca hecha por estudiante
 */
function verificarPar() {
    // Obtener el número del input
    let numero = parseInt(document.getElementById("numero").value);
    
    // Verificar si es un número válido
    if (isNaN(numero)) {
        document.getElementById("resultadoPar").innerHTML = 
            "Por favor, ingresa un número válido";
        return;
    }
    
    // Verificar si es par o impar
    let mensaje;
    if (numero % 2 === 0) {
        mensaje = numero + " es un número PAR";
    } else {
        mensaje = numero + " es un número IMPAR";
    }
    
    // Mostrar resultado
    document.getElementById("resultadoPar").innerHTML = mensaje;
}



/*---分割线---*/
/*function 质数() {
    let inicio = prompt("请输入起始数字（默认为 2):");
    let fin = prompt("请输入结束数字（默认为 100):");
    inicio = inicio !== null ? parseInt(inicio) : 2;
    fin = fin !== null ? parseInt(fin) : 100;

    console.log(`在区间 [${inicio}, ${fin}] 中的质数有：`);

    for (let num = inicio; num <= fin; num++) { // 遍历区间内的每个数字
        if (num < 2) continue; // 跳过小于 2 的数字
        let esPrimo = true; // 假设当前数字是质数
        // 优化：只需要检查到该数的平方根
        for (let i = 2; i < num; i++) { // 检查是否有因子
            if (num % i === 0) { // 找到因子
                esPrimo = false; // 说明不是质数
                break;
            }
        }
        if (esPrimo) { // 1 不是质数
            console.log(num); // 打印质数
        }
    }
}


function 偶数() {
    let num = prompt("请输入一个正整数（检查是否为偶数）：");
    num = parseInt(num);
    if (isNaN(num) || num <= 0) {
        console.log("输入无效：请输入一个大于 0 的正整数。");
        return;
    }
    if (num % 2 === 0) {
        console.log(num + " 是一个偶数。");
    } else {
        console.log(num + " 不是一个偶数。");
    }
}*/
/*---分割线---*/
