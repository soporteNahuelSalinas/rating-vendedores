    // Inicio del mensaje de Cuotas Sin Interés
    $(document).ready(function () {
        var categoriasValidas = [
            "1470-notebook", "notebook-corporativa", "notebook-gamer-diseao", "notebook-uso-personal", "electrodomestico", "batidora", "cafetera", "exprimidor", "freidora", 
            "horno-de-pan", "hornos", "licuadora", "mate", "miniprimer-mixer", "multiprocesador", 
            "pava-electricas", "sandwichera", "tostadora", "vaporeras", "aspiradoras", "planchas", 
            "freezers", "heladera-con-freezer", "frigobar", "corta-barba", "planchita-de-cabello", 
            "depiladora", "masajeador", "secador-de", "corta-cabello", "de-vino", "de-aceite"
        ];

        var categoriasNotebook = [
            "1470-notebook", "notebook-corporativa", "notebook-gamer-diseao", "notebook-uso-personal"
        ];

        function isValidCategory(url) {
            return categoriasValidas.some(categoria => url.toLowerCase().includes(categoria));
        }

        function isNotebookCategory(url) {
            return categoriasNotebook.some(categoria => url.toLowerCase().includes(categoria));
        }

        function showPopupCuotas() {
            var currentUrl = window.location.href.toLowerCase();
            if (!isValidCategory(currentUrl)) return;

            var priceElement = $('#main-product-wrapper').find('.product-price[content]').first();
            var priceValue = parseFloat(priceElement.attr('content')) || 0;
            var precioCuota = priceValue / 6;
            var precioCuotaFormatted = precioCuota.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 });

            if ($('#popup-cuotas').length === 0) {
                var popupHtml = 
                    '<div id="popup-cuotas" class="popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: x-large; min-width: 340px; background-color: #8200c0; color: #ffffff; padding: 20px 30px; border-radius: 5px; z-index: 9999; text-align: center;">' +
                        '<span style="font-weight: 400;">¡Nueva Promo!</span><br>' + 
                        '<h1 style="font-size: 50px; margin-bottom: -16px; margin-top: 8px;">¡6 Cuotas Sin Interés!</h1><br>' +
                        '<div style="font-weight: 400; margin: 10px 0; font-size: large;">Llevá este producto en cuotas de <br>' + 
                        '<h2 style="font-size: 50px;">' + precioCuotaFormatted + '</h2><br>' +
                        '<span>¡TIEMPO LIMITADO!</span></div><br>' +
                        '<h3 style="font-weight: bold; font-size: 16px;">(Exclusivo sucursales)</h3>' +
                        '<button id="close-popup-cuotas" style="margin-top: 10px; background: #ffffff; color: #8200c0; border: none; font-size: large; font-weight: bold; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Cerrar</button>' +
                    '</div>';

                $('body').append(popupHtml);

                $('#close-popup-cuotas').click(function(){
                    $('#popup-cuotas').remove();
                    if (isNotebookCategory(currentUrl)) {
                        showPopupCupon();
                    }
                });
            }
        }

        function showPopupCupon() {
            if ($('#popup-cupon').length === 0) {
                var popupHtml = 
                    '<div id="popup-cupon" class="popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: x-large; min-width: 340px; background-color: #8200c0; color: #fff; padding: 20px 30px; border-radius: 5px; z-index: 9999; text-align: center;">' +
                        '<h2 style="line-height: normal; font-size: 30px; font-weight: 400;">¡Te regalamos <b>$30.000</b> para usarlos en cualquier Notebook!</h2>' +
                        '<p style="line-height: normal;">Adquirilo enviando la palabra <b>CUPON</b> al <b>3764898888</b>.</p>' +
                        '<a href="https://api.whatsapp.com/send?phone=543764898888&text=Cupon" target="_blank" style="display: inline-block; margin-top: 10px; background: #ffbf00; color: #ffffff; padding: 10px 15px; border-radius: 5px; font-size: 16px; text-decoration: none; font-weight: bold;">OBTENER</a>' +
                        '<br><button id="close-popup-cupon" style="margin-top: 10px; background: #ffffff; color: #8200c0; border: none; font-size: large; font-weight: bold; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Cerrar</button>' +
                    '</div>';

                $('body').append(popupHtml);

                $('#close-popup-cupon').click(function(){
                    $('#popup-cupon').remove();
                });
            }
        }

        function runAll() {
            showPopupCuotas();
        }

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

        window.addEventListener('locationchange', runAll);
        runAll();
    });
    // Fin del mensaje de Cuotas Sin Interés