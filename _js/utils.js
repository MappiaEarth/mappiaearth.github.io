window.DocUtils = {

    HOST: "https://maps.csr.ufmg.br",

    QUERY: {
        getQueryIdFromURL: function( requestedUrl ) {
            return parseInt( requestedUrl.toLowerCase().split( "queryid=" )[1].split( "&" )[0] );
        },

        //Danilo ou o URL ou diretamente a queryID (em number)
        showQueryContent: function( queryID ) {
            if (DocUtils.TYPE.isString( queryID )) {
                queryID = DocUtils.QUERY.getQueryIdFromURL( queryID );
            }
            var request = $.ajax( {
                url: DocUtils.HOST + "/query/description/" + queryID + "/",
                method: "GET",
                dataType: "text"
            } );

            request.done( function( msg ) {
                var queryDescription = eval(
                    "(function(){return (" + msg + ").description;})();" );

                // $( "#log" ).html( queryDescription );
                alert( queryDescription );
            } );

            request.fail( function( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            } );

        },

        /**
         * Modifica o iframe e o header associado de um mapa para exibir outro link.
         * @param {String} newURL Nova URL para exibição de outra query no iframe e nos botões.
         * @param {String} newTitle Título a ser exibido acima do mapa.
         */
        changeIframeURL: function( newURL, newTitle ) {
            document.getElementById("mapViewer").src = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById("openEditorMode").href = DocUtils.HOST + "/editor/?" + newURL;
            document.getElementById("openCalculatorMode").href = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById("showQueryContent").href = "javascript:DocUtils.QUERY.showQueryContent('" + newURL +"')";
            document.getElementById("mapTitle").innerHTML = newTitle;
        }
    },

    TYPE: {
        /**
         * Verify if arg is a string.
         * @param arg Object to be checked if is a string.
         * @returns {boolean} Returns True if 'arg' a string, otherwise returns False.
         */
        isString: function( arg ) {
            return typeof arg === "string" || arg instanceof String;
        }
    },

    API: {
        /**
         * Toggle na classe CSS "open" para abrir ou fechar os detalhes de uma
         * propriedade na API.
         * 
         * @param {HTMLElement} element Elemento que foi clicado.
         */
        toggleOpenClass: function( element ) {
            $(element).closest(".property").toggleClass("open");
        }
    }
};
