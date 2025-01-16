document.addEventListener("DOMContentLoaded", () => {
  const elem = document.documentElement; // Selecciona todo el documento para fullscreen
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
});
