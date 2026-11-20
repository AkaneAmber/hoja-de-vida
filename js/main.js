/* Hoja de vida - Isabel Piñeros */

document.addEventListener("DOMContentLoaded", () => {
  marcarPaginaActiva();
  configurarTema();
  crearParticulas();
  semaforoDeLargada();
  animarMedidores();
  configurarGaleria();
  configurarMenuMovil();
  animarAlHacerScroll();
  efectoEscritura();
  ponerAnioActual();
  filtrarProyectosConGET();
  configurarFormularioPOST();
  configurarFormularioPUT();
});

/* Menú activo */
function marcarPaginaActiva() {
  const actual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach((enlace) => {
    if (enlace.getAttribute("href") === actual) enlace.classList.add("activo");
  });
}

/* Cambio de tema */
function configurarTema() {
  const boton = document.getElementById("boton-tema");
  if (!boton) return;
  let guardado = null;
  try { guardado = localStorage.getItem("tema"); } catch (e) {}
  if (guardado === "pandora") document.body.classList.add("pandora");
  actualizarBoton();

  boton.addEventListener("click", () => {
    document.body.classList.toggle("pandora");
    const tema = document.body.classList.contains("pandora") ? "pandora" : "f1";
    try { localStorage.setItem("tema", tema); } catch (e) {}
    actualizarBoton();
  });

  function actualizarBoton() {
    const pandora = document.body.classList.contains("pandora");
    boton.innerHTML = pandora
      ? '» <span class="texto-tema">Modo F1</span>'
      : '✦ <span class="texto-tema">Modo Pandora</span>';
    boton.setAttribute("aria-label", pandora ? "Cambiar a Modo F1" : "Cambiar a Modo Pandora");
  }
}

/* Partículas */
function crearParticulas() {
  const capa = document.createElement("div");
  capa.className = "particulas";
  capa.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("span");
    p.className = "particula";
    p.style.left = Math.random() * 100 + "%";
    const tam = 3 + Math.random() * 6;
    p.style.width = p.style.height = tam + "px";
    p.style.animationDuration = 9 + Math.random() * 14 + "s";
    p.style.animationDelay = -Math.random() * 20 + "s";
    capa.appendChild(p);
  }
  const selva = document.createElement("div");
  selva.className = "selva";
  selva.setAttribute("aria-hidden", "true");
  document.body.prepend(selva);
  document.body.prepend(capa);
}

/* Semáforo de largada */
function semaforoDeLargada() {
  const largada = document.getElementById("largada");
  if (!largada) return;
  let visto = false;
  try { visto = sessionStorage.getItem("largada") === "si"; } catch (e) {}
  if (visto || document.body.classList.contains("pandora")) { largada.remove(); return; }

  const luces = largada.querySelectorAll(".luz");
  const texto = largada.querySelector("p");
  const terminar = () => {
    largada.classList.add("salir");
    setTimeout(() => largada.remove(), 700);
    try { sessionStorage.setItem("largada", "si"); } catch (e) {}
  };
  luces.forEach((luz, i) => setTimeout(() => luz.classList.add("on"), 400 + i * 500));
  setTimeout(() => {
    luces.forEach((luz) => luz.classList.remove("on"));
    texto.textContent = "Y arrancamos ε=ε=┌( >_<)┘";
    setTimeout(terminar, 700);
  }, 400 + luces.length * 500 + 600);
  largada.querySelector("button").addEventListener("click", terminar);
}

/* Medidores */
function animarMedidores() {
  const diales = document.querySelectorAll(".dial[data-nivel]");
  setTimeout(() => {
    diales.forEach((d) => d.style.setProperty("--valor", d.dataset.nivel));
  }, 300);
}

/* Galería */
function configurarGaleria() {
  document.querySelectorAll(".galeria button").forEach((boton) => {
    boton.addEventListener("click", () => {
      const img = boton.querySelector("img");
      const visor = document.createElement("div");
      visor.className = "visor";
      visor.innerHTML = '<button type="button" aria-label="Cerrar">✕</button>';
      const grande = document.createElement("img");
      grande.src = img.src;
      grande.alt = img.alt;
      visor.appendChild(grande);
      visor.addEventListener("click", () => visor.remove());
      document.body.appendChild(visor);
    });
  });
}

/* Menú en celular */
function configurarMenuMovil() {
  const boton = document.getElementById("boton-menu");
  const menu = document.querySelector(".menu");
  if (!boton || !menu) return;
  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto);
    boton.textContent = abierto ? "✕" : "☰";
  });
}

/* Animación al hacer scroll */
function animarAlHacerScroll() {
  const elementos = document.querySelectorAll(".aparecer");
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  elementos.forEach((el) => observador.observe(el));
}

/* Texto que se escribe solo */
function efectoEscritura() {
  const destino = document.getElementById("texto-escribiendo");
  if (!destino) return;
  const frases = ["Ingeniería de Software", "Desarrollo con Java y Python", "Pruebas de software", "Automatización de procesos"];
  let frase = 0, letra = 0, borrando = false;

  function paso() {
    const texto = frases[frase];
    destino.textContent = texto.slice(0, letra);
    if (!borrando && letra < texto.length) { letra++; setTimeout(paso, 85); }
    else if (!borrando) { borrando = true; setTimeout(paso, 1600); }
    else if (letra > 0) { letra--; setTimeout(paso, 40); }
    else { borrando = false; frase = (frase + 1) % frases.length; setTimeout(paso, 300); }
  }
  paso();
}

/* Año del pie de página */
function ponerAnioActual() {
  document.querySelectorAll(".anio").forEach((el) => { el.textContent = new Date().getFullYear(); });
}

/* Filtro con GET */
function filtrarProyectosConGET() {
  const formulario = document.getElementById("form-filtro");
  if (!formulario) return;

  const parametros = new URLSearchParams(location.search);
  const tecnologia = (parametros.get("tecnologia") || "todas").toLowerCase();
  const buscar = (parametros.get("buscar") || "").trim().toLowerCase();
  formulario.tecnologia.value = tecnologia;
  formulario.buscar.value = parametros.get("buscar") || "";

  const tarjetas = document.querySelectorAll(".proyecto");
  let visibles = 0;
  tarjetas.forEach((tarjeta) => {
    const tags = tarjeta.dataset.tecnologias.toLowerCase();
    const texto = tarjeta.textContent.toLowerCase();
    const coincideTec = tecnologia === "todas" || tags.includes(tecnologia);
    const coincideTexto = buscar === "" || texto.includes(buscar);
    const mostrar = coincideTec && coincideTexto;
    tarjeta.classList.toggle("oculto", !mostrar);
    if (mostrar) visibles++;
  });

  document.getElementById("contador-proyectos").textContent = visibles;
  document.getElementById("sin-resultados").classList.toggle("oculto", visibles !== 0);

  const urlActual = document.getElementById("url-get");
  if (urlActual) urlActual.textContent = location.search ? "proyectos.html" + location.search : "(aún no has filtrado)";
}

/* Muestra la respuesta del servidor */
function mostrarRespuesta(caja, estado, ok, datos) {
  caja.classList.remove("oculto");
  caja.innerHTML = "";
  const linea = document.createElement("span");
  linea.className = ok ? "estado-ok" : "estado-error";
  linea.textContent = ok ? `✔ Respuesta ${estado} del servidor` : `✖ Error ${estado}`;
  caja.appendChild(linea);
  caja.appendChild(document.createTextNode("\n" + JSON.stringify(datos, null, 2)));
}

/* Formulario POST */
function configurarFormularioPOST() {
  const formulario = document.getElementById("form-contacto");
  if (!formulario) return;
  const caja = document.getElementById("respuesta-post");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    const boton = formulario.querySelector("button[type=submit]");
    boton.disabled = true; boton.textContent = "Enviando…";
    try {
      const respuesta = await fetch(formulario.action, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(datos)
      });
      const json = await respuesta.json();
      mostrarRespuesta(caja, respuesta.status, respuesta.ok, json);
      if (respuesta.ok) formulario.reset();
    } catch (error) {
      mostrarRespuesta(caja, "de conexión", false, { detalle: error.message });
    } finally {
      boton.disabled = false; boton.textContent = "Enviar mensaje";
    }
  });
}

/* Formulario PUT */
function configurarFormularioPUT() {
  const formulario = document.getElementById("form-disponibilidad");
  if (!formulario) return;
  const caja = document.getElementById("respuesta-put");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    datos.id = 1;
    datos.remoto = formulario.remoto.checked;
    try {
      const respuesta = await fetch(formulario.dataset.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(datos)
      });
      const json = await respuesta.json();
      mostrarRespuesta(caja, respuesta.status, respuesta.ok, json);
      if (respuesta.ok) {
        document.getElementById("estado-disponibilidad").textContent = datos.estado;
      }
    } catch (error) {
      mostrarRespuesta(caja, "de conexión", false, { detalle: error.message });
    }
  });
}
