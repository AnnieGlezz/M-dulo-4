let preguntas = []; // Variable global para almacenar las preguntas

document.addEventListener("DOMContentLoaded", function () {
    let token = sessionStorage.getItem('token');

    if (!token) {
        generarToken();
    }
}); 

const generarToken = () => {
    fetch('https://opentdb.com/api_token.php?command=request')
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.token) {
            sessionStorage.setItem('token', datos.token);
        } 
    })
    .catch(error => {
        console.error('Hubo un error generando el token: ', error)
    })
}

const obtenerPreguntas = () => {
    let token = sessionStorage.getItem('token');
    if (!token) {
        generarToken();
        return;
    }
    
    const categoria = document.getElementById('select1').value;
    const dificultad = document.getElementById('select2').value;
    const tipo = document.getElementById('select3').value;

    if (categoria === "" || dificultad === "" || tipo === "" ) {
        alert('Debes seleccionar las opciones correspondientes para continuar');
        return;
    } 

    const url = `https://opentdb.com/api.php?amount=10&category=${categoria}&difficulty=${dificultad}&type=${tipo}&token=${token}`;
    
    fetch(url) 
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.results && datos.results.length > 0) {
            preguntas = datos.results;
            mostrarPreguntas();
        } else {
            alert('No hay una trivia disponible con las características seleccionadas');
        }
    })
    .catch(error => {
        console.error('Hubo un error obteniendo las preguntas:', error);
    });
};

const mostrarPreguntas = () => {
    const preguntaContainer = document.getElementById('questionario');
    preguntaContainer.innerHTML = ''; // Limpiar contenido anterior

    preguntas.forEach((pregunta, index) => {
        const preguntaHtml = document.createElement('div');
        preguntaHtml.innerHTML = `
            <h3>Pregunta ${index + 1}: ${pregunta.question}</h3>
            <ul>
                ${pregunta.incorrect_answers.map(respuesta => `<li><input type="radio" name="respuesta${index}" data-index="${index}" value="${respuesta}"> ${respuesta}</li>`).join('')}
                <li><input type="radio" name="respuesta${index}" data-index="${index}" value="${pregunta.correct_answer}"> ${pregunta.correct_answer}</li>
            </ul>
        `;
        preguntaContainer.appendChild(preguntaHtml);
    });

    preguntaContainer.hidden = false;
};

document.addEventListener('DOMContentLoaded', function () {
    const botonesRespuesta = document.querySelectorAll('input[type="radio"]');
    botonesRespuesta.forEach(boton => {
        boton.addEventListener('click', function () {
            verificarRespuestas();
        });
    });
});
const verificarRespuestas = () => {
    let puntaje = 0;
    const botonesRespuesta = document.querySelectorAll('input[type="radio"]:checked');
    botonesRespuesta.forEach(boton => {
        const respuestaSeleccionada = boton.value;
        const preguntaIndex = boton.getAttribute('data-index');
        const pregunta = preguntas[preguntaIndex];

        if (respuestaSeleccionada === pregunta.correct_answer) {
            puntaje++;
        }
    });

    // Mostrar la puntuación en el círculo
    const puntuacionElement = document.getElementById('puntuacion');
    puntuacionElement.textContent = puntaje;

    // Mostrar el mensaje de revisión
    const revisionMensaje = document.getElementById('revision-mensaje');
    revisionMensaje.textContent = `Respuestas correctas: ${puntaje}`;
};
