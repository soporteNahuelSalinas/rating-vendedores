$(document).ready(function () {
    // Lista de palabras clave para identificar las páginas relevantes
    var categoriasValidas = [
        "1470-notebook", "notebook-corporativa", "notebook-gamer-diseao", "notebook-uso-personal", "electrodomestico", "batidora", "cafetera", "exprimidor", "freidora", 
        "horno-de-pan", "hornos", "licuadora", "mate", "miniprimer-mixer", "multiprocesador", 
        "pava-electricas", "sandwichera", "tostadora", "vaporeras", "aspiradoras", "planchas", 
        "freezers", "heladera-con-freezer", "frigobar", "corta-barba", "planchita-de-cabello", 
        "depiladora", "masajeador", "secador-de", "corta-cabello", "de-vinos", "de-aceite"
    ];

    // Función para verificar si una URL (pasada como parámetro) pertenece a alguna de las categorías válidas
    function isValidCategory(url) {
        var pagina = url.toLowerCase();
        return categoriasValidas.some(function(categoria) {
            return pagina.indexOf(categoria) !== -1;
        });
    }

    // Función que aplica o actualiza la flag en cada producto, basándose en el hipervínculo de la tarjeta
    function updateProductFlags() {
        $('.product-miniature, .product').each(function () {
            var $producto = $(this);
            // Se obtiene el URL del hipervínculo de la tarjeta de producto
            var productUrl = $producto.find('a.thumbnail.product-thumbnail').attr('href');
            // Si no se encontró el URL o este no corresponde a una categoría válida, se omite este producto
            if (!productUrl || !isValidCategory(productUrl)) return;
            
            var estilosFlag = {
                "display": "block",
                "background-color": "#2966a7",
                "color": "#ffffff",
                "z-index": "9999",
                "text-align": "center",
                "font-size": "small",
                "max-height": "38px",
                "font-weight": "500",
                "line-height": "1.5em",
                "min-height": "calc(1.5em * 1.2)"
            };

            var $flag = $producto.find('.product-flag.on-sale');
            if ($flag.length) {
                $flag.text("¡Cuotas Sin Interés!").css(estilosFlag);
            } else {
                // Se ajusta la posición solo si es "static" para no interferir con otros estilos
                if ($producto.css("position") === "static") {
                    $producto.css("position", "relative");
                }
                var $nuevaFlag = $('<div class="product-flag on-sale">¡6 Cuotas Sin Interés En Todos Los Bancos!</div>').css(estilosFlag);
                $producto.prepend($nuevaFlag);
            }
        });
    }

    // Función que muestra un popup en el centro de la pantalla en páginas de detalle de producto.
    // Se utiliza la URL actual para validar si la categoría es válida.
    function showPopup() {
        var currentUrl = window.location.href.toLowerCase();
        if (!isValidCategory(currentUrl)) return;

        // Buscar el elemento de precio de forma genérica (usando la clase product-price con atributo content)
        var priceElement = $('#main-product-wrapper').find('.product-price[content]').first();
        var priceValue = parseFloat(priceElement.attr('content')) || 0;

        var precioCuota = priceValue / 6;
        var precioCuotaFormatted = precioCuota.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

        // Mostrar el popup solo si existe el contenedor de información del producto
        if ($('#main-product-wrapper > div.row.product-info-row').length) {
            // Evitar duplicar el popup
            if ($('#popup-cuotas').length === 0) {
                var $popup = $(
                    '<div id="popup-cuotas" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: x-large; line-height: 1em; min-height: calc(1em * 2); font-weight: bold; min-width: 340px; background-color: #8200c0; color: #ffffff; padding: 20px 30px; border-radius: 5px; z-index: 9999; text-align: center;">' +
                        '<span style="font-weight: 400;">¡Nueva Promo!</span><br>' + 
                        '<h1 style="font-size: 50px; margin-bottom: -16px; margin-top: 8px;">¡6 Cuotas Sin Interés!</h1><br>' +
                        '<div style="font-weight: 400; margin: 10px 0; font-size: large;">Llevá este producto en cuotas de <br>' + 
                        '<h2 style="font-size: 50px;">' + precioCuotaFormatted + '</h2><br>' +
                        '<span>¡TIEMPO LIMITADO!</span></div><br>' +
                        '<h3 style="font-weight: 400; font-size: medium;">(Exclusivo sucursales)</h3></div>' + 
                        '<button id="close-popup" style="margin-top: 10px; background: #ffffff; color: #8200c0; border: none; font-size: large; font-weight: bold; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Cerrar</button>' +
                    '</div>'
                );
                $('body').append($popup);

                $('#close-popup').click(function(){
                    $('#popup-cuotas').remove();
                });
            }
        }
    }

    // Función que ejecuta ambas funcionalidades
    function runAll() {
        updateProductFlags();
        showPopup();
    }

    // Configurar detección de cambios en la URL (incluye pushState, replaceState y popstate)
    (function() {
        var pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };

        var replaceState = history.replaceState;
        history.replaceState = function() {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event('locationchange'));
        });
    })();

    // Escuchar el evento personalizado de cambio de URL
    window.addEventListener('locationchange', runAll);

    // Ejecutar al cargar la página
    runAll();
});