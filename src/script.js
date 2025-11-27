// LOGIN Y REGISTRO
const inputNombre = document.getElementById("nombre");
const inputPassword = document.getElementById("password");
const resultado = document.getElementById("resultado");

function login() {
    const usuario = inputNombre.value.trim();
    const password = inputPassword.value.trim();

    const usuarioLocal = localStorage.getItem("usuario");
    const passwordLocal = localStorage.getItem("password");

    if (!usuarioLocal || !passwordLocal) {
        resultado.textContent = "No hay usuarios registrados";
        resultado.className = "error";
        return;
    }

    if (usuario === usuarioLocal && password === passwordLocal) {
        resultado.textContent = "¡Login correcto! ✅";
        resultado.className = "correcto";
    } else {
        resultado.textContent = "Usuario o contraseña incorrectos ❌";
        resultado.className = "error";
    }
}

function registrar() {
    const usuario = inputNombre.value.trim();
    const password = inputPassword.value.trim();

    if (usuario === "" || password === "") {
        resultado.textContent = "Completa ambos campos para registrarte ❌";
        resultado.className = "error";
        return;
    }

    localStorage.setItem("usuario", usuario);
    localStorage.setItem("password", password);

    resultado.textContent = "Usuario registrado correctamente ✅";
    resultado.className = "correcto";
}

// POSTS Y BÚSQUEDA
let postsCargados = [];

// Normaliza cadenas (quita acentos y pasa a minúsculas)
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Precargar posts desde data.json en memoria
async function precargarPosts() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();

        postsCargados = data.map(item => ({
            titulo: item.nombre,
            subtitulo: item.descripcion,
            imagen: item.imagen
        }));
    } catch (error) {
        console.error("Error al cargar data.json:", error);
    }
}

// Mostrar posts en el DOM (igual que tu versión original)
function mostrarPosts(postsArray) {
    const listaPosts = document.getElementById("listaPosts");
    listaPosts.innerHTML = '';

    if (postsArray.length === 0) {
        listaPosts.innerHTML = "<p>No se encontraron resultados</p>";
        return;
    }

    postsArray.forEach(post => {
        const h2 = document.createElement("h2");
        h2.textContent = post.titulo;
        h2.classList.add("post-animado");

        const h3 = document.createElement("h3");
        h3.textContent = post.subtitulo;
        h3.classList.add("post-animado");

        const img = document.createElement("img");
        img.src = post.imagen;
        img.width = 150;
        img.classList.add("post-animado");
        img.loading = "lazy"; // Lazy-loading para mejorar la carga

        listaPosts.appendChild(h2);
        listaPosts.appendChild(h3);
        listaPosts.appendChild(img);
    });
}

// Función de búsqueda
function buscarPosts() {
    const filtro = normalizeString(document.getElementById("busqueda").value.trim());
    const listaPosts = document.getElementById("listaPosts");

    if (filtro === "") {
        listaPosts.innerHTML = "<p>Escribe algo para buscar...</p>";
        return;
    }

    const resultados = postsCargados.filter(post =>
        normalizeString(post.titulo).includes(filtro) ||
        normalizeString(post.subtitulo).includes(filtro)
    );

    mostrarPosts(resultados);
}

// Eventos
document.getElementById("Posts").addEventListener("click", () => mostrarPosts(postsCargados));

// Permite buscar al presionar Enter en el input
document.getElementById("busqueda").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        buscarPosts();
    }
});

// Precarga los posts en memoria al abrir la página (pero no los muestra hasta que se haga clic)
precargarPosts();