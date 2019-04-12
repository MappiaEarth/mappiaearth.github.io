window.DocUtils = {

    HOST: "https://maps.csr.ufmg.br",

    QUERY: {
        getQueryIdFromURL: function( requestedUrl ) {
            return parseInt( requestedUrl.toLowerCase().split( "queryid=" )[ 1 ].split( "&" )[ 0 ] );
        },

        /**
         * Show a query contents by its ID.
         *
         * @param queryID {Number} Queryid of the query.
         */
        showQueryContent: function( queryID ) {
            if ( DocUtils.TYPE.isString( queryID ) ) {
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
            document.getElementById( "mapViewer" ).src = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById( "openEditorMode" ).href = DocUtils.HOST + "/editor/?" + newURL;
            document.getElementById( "openCalculatorMode" ).href = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById( "showQueryContent" ).href = "javascript:DocUtils.QUERY.showQueryContent('" + newURL + "')";
            document.getElementById( "mapTitle" ).innerHTML = newTitle;
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
        togglePropertyOpen: function( element ) {
            $( element ).closest( ".property" ).toggleClass( "open" );
        },

        /**
         * Toggle na classe CSS "open" de uma categoria para exibir ou esconder
         * as propriedades pertencentes a ela.
         *
         * @param {HTMLElement} element Elemento que foi clicado.
         */
        toggleCategoryOpen: function( element ) {
            $( element ).closest( ".property-category" ).toggleClass( "open" );
            $( element ).closest( ".property-category__metadata" ).toggleClass( "open" );
        },
        
        /**
         * Expande ou recolhe todas as propriedades de uma vez.
         * 
         * @param {HTMLElement} toggleAllElement Botão que abre ou fecha todas
         * as propriedades.
         */
        toggleAllProperties: function( toggleAllElement ) {
            $( toggleAllElement ).toggleClass( "open" )
            var openAllProperties = $( toggleAllElement ).hasClass( "open" );
            var childrenSelector = $( ".api-container" ).find( ".property, .property-category, .property-category__metadata" );
            var title = openAllProperties ? "Collapse all properties" : "Expand all properties";
            $( toggleAllElement ).attr( "title", title );
            if ( openAllProperties ) {
                childrenSelector.addClass( "open" );
            } else {
                childrenSelector.removeClass( "open" );
            }
        }
    }
};
