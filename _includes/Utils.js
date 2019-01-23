var DocUtils = {

    HOST: "//maps.csr.ufmg.br",

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
    }
};
