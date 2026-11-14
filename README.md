# Plataforma de Huertas Urbanas Colaborativas (EcoHuertos)

Proyecto enfocado en fortalecer la soberanía alimentaria mediante la creación y gestión de huertas urbanas comunitarias.

## Páginas

| Archivo | Sección |
| --- | --- |
| `index.html` | Inicio |
| `calendario.html` | Calendario público |
| `huertas.html` | Huertas públicas + formulario de registro |
| `foro.html` | Foro público |
| `nosotros.html` | Equipo y motivación |
| `mi-proyecto.html` | Espacio personal (requiere iniciar sesión) |

Los datos (usuarios, sesión y huertas) se guardan en `localStorage` del navegador.

## Integrantes

- Darlyn Dayana Grisales Orozco
- David Alejandro Clavijo Guevara 1105368090
- Andres Felipe Gelpud Calvache

## Estado del proyecto

Navegación entre páginas completada. Aún en desarrollo.

## Accesibilidad (WCAG 2.2)

Se trabajaron tres principios: **Perceptible**, **Operable** y **Comprensible**.

**Perceptible**
- 1.1.1 La imagen informativa tiene texto alternativo descriptivo y los emojis decorativos se ocultan a los lectores de pantalla (`aria-hidden`).
- 1.3.1 Estructura semántica (`header`, `nav`, `main`, `footer`), un `h1` por página y jerarquía de encabezados sin saltos; las fechas del calendario se leen completas ("4 de octubre").
- 1.3.4 / 1.4.10 Sin bloqueo de orientación y reflow sin scroll horizontal a 320 px.
- 1.4.1 Los enlaces dentro de texto van subrayados (no dependen solo del color).
- 1.4.3 Contraste de texto de al menos 4.5:1.
- 1.4.4 / 1.4.12 Texto ampliable al 200% y espaciado de texto modificable sin cortes ni pérdida de contenido.
- 1.4.5 Sin imágenes de texto.
- 1.4.11 Contraste de componentes: bordes de los campos con 4.5:1 (antes 1.3:1).
- Soporte para modo de alto contraste del sistema (`forced-colors`).
- 1.2 (medios con tiempo) no aplica: el sitio no tiene audio ni video.

**Operable**
- 2.1.1 / 2.1.2 Todo funciona con teclado; los diálogos atrapan el foco mientras están abiertos y se cierran con `Esc` (sin trampas).
- 2.4.1 Enlace "Saltar al contenido principal".
- 2.4.2 Título único y descriptivo en cada página.
- 2.4.3 / 2.4.7 / 2.4.13 Orden de foco lógico e indicador de foco visible con alto contraste.
- 2.4.11 El foco no queda oculto bajo la barra superior ni la inferior (`scroll-padding`).
- 2.3.3 Respeta `prefers-reduced-motion`.
- 2.5.8 Objetivos táctiles de al menos 24x24 px (los botones miden 44 px).
- Navegación con `aria-label` y página actual marcada con `aria-current="page"`.

**Comprensible**
- 3.1.1 Idioma de la página (`lang="es"`).
- 3.2.3 / 3.2.4 Navegación idéntica y en el mismo lugar en todas las páginas.
- 3.3.1 / 3.3.3 Errores descritos en texto, asociados al campo (`aria-invalid`, `role="alert"`) y con sugerencia de corrección.
- 3.3.2 Etiquetas visibles, campos marcados como "(obligatorio)" y ayuda para la contraseña.
- 1.3.5 Atributos `autocomplete` en los formularios.
- 4.1.3 Mensajes de estado (huerta registrada, sesión iniciada/cerrada) anunciados a lectores de pantalla.

**Mejoras de apoyo:** jerarquía de encabezados correcta (un `h1` por página), contrastes de color de al menos 4.5:1 y reflow sin scroll horizontal a 320 px.
