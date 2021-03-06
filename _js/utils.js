window.DocUtils = {

    HOST: "https://maps.csr.ufmg.br",

    QUERY: {
        getQueryIdFromURL: function (requestedUrl) {
            return parseInt(requestedUrl.toLowerCase().split("queryid=")[1].split("&")[0]);
        },

        /**
         * Show a query contents by its ID.
         *
         * @param queryID {Number} Queryid of the query.
         */
        showQueryContent: function (queryID) {
            if (DocUtils.TYPE.isString(queryID)) {
                queryID = DocUtils.QUERY.getQueryIdFromURL(queryID);
            }
            var request = $.ajax({
                url: DocUtils.HOST + "/query/description/" + queryID + "/",
                method: "GET",
                dataType: "text"
            });

            request.done(function (msg) {
                var queryDescription = eval(
                    "(function(){return (" + msg + ").description;})();");
                alert(queryDescription);
            });

            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });

        },

        /**
         * Modifica o iframe e o header associado de um mapa para exibir outro link.
         * @param {String} newURL Nova URL para exibição de outra query no iframe e nos botões.
         * @param {String} newTitle Título a ser exibido acima do mapa.
         */
        changeIframeURL: function (newURL, newTitle) {
            document.getElementById("mapViewer").src = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById("openEditorMode").href = DocUtils.HOST + "/editor/?" + newURL;
            document.getElementById("openCalculatorMode").href = DocUtils.HOST + "/calculator/?" + newURL;
            document.getElementById("showQueryContent").href = "javascript:DocUtils.QUERY.showQueryContent('" + newURL + "')";
            document.getElementById("mapTitle").innerHTML = newTitle;
        }
    },

    TYPE: {
        /**
         * Verify if arg is a string.
         * @param arg Object to be checked if is a string.
         * @returns {boolean} Returns True if 'arg' a string, otherwise returns False.
         */
        isString: function (arg) {
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
        togglePropertyOpen: function (element) {
            $(element).closest(".property").toggleClass("open");
        },

        /**
         * Toggle na classe CSS "open" de uma categoria para exibir ou esconder
         * as propriedades pertencentes a ela.
         *
         * @param {HTMLElement} element Elemento presente na árvore da 
         *   categoria que se deseja alterar.
         * @param {boolean} state Opcional. Caso seja definido, irá forçar 
         *   a categoria a abrir ou fechar, conforme o valor. True para abrir e
         *   false para fechar.
         */
        toggleCategoryOpen: function (element, state) {
            $(element).closest(".property-category").toggleClass("open", state);
            $(element).closest(".property-category__metadata").toggleClass("open", state);
        },

        /**
         * Expande ou recolhe todas as propriedades de uma vez.
         * 
         * @param {boolean} state Opcional. Caso seja definido, irá forçar 
         *   todas as propriedades a abrir ou fechar, conforme o valor. True para
         *   abrir e false para fechar.
         */
        toggleAllProperties: function (state) {
            var toggleAllElement = $("#toggle-all-properties");
            var openAllProperties = state !== undefined ? state : !toggleAllElement.hasClass("open");
            var childrenSelector = $(".api-container").find(".property, .property-category, .property-category__metadata");
            var title = openAllProperties ? "Collapse all properties" : "Expand all properties";
            toggleAllElement.toggleClass("open", openAllProperties);
            toggleAllElement.attr("title", title);
            if (openAllProperties) {
                childrenSelector.addClass("open");
            } else {
                childrenSelector.removeClass("open");
            }
        },

        /**
         * Filtra as propriedades visíveis conforme entrada do usuário no input
         * de filtro. Exibe somente aquelas propriedades ou categorias que
         * contenham a string inserida pelo usuário
         */
        filterVisibleProperties: function () {
            var eventTimeout;
            var propertySelector = $("#api-container").find(".property");
            var categorySelector = $("#api-container").find(".property-category");
            var emptyResultsElement = $("#empty-filter-results");
            return function filterVisibleProperties() {
                clearTimeout(eventTimeout);
                eventTimeout = setTimeout(function () {
                    propertySelector.removeClass("lastVisible");
                    var filterText = $("#filter-members").val();
                    if (!filterText) {
                        // Close all properties and categories, so that there
                        // isn't so much space being used when everything show
                        // up again.
                        DocUtils.API.toggleAllProperties(false);
                        emptyResultsElement.addClass("hidden");
                        propertySelector.removeClass("hidden");
                        categorySelector.removeClass("hidden");
                    } else {
                        var querySelector = "div:contains(" + filterText + ")";
                        var filteredProperties = propertySelector.filter(querySelector);
                        var filteredCategories = categorySelector.filter(querySelector);
                        var propertiesToHide = propertySelector.not(filteredProperties);
                        var categoriesToHide = categorySelector.not(filteredCategories);

                        if (filteredProperties.length === 0 && filteredCategories.length === 0) {
                            emptyResultsElement.removeClass("hidden");
                        } else {
                            emptyResultsElement.addClass("hidden");
                        }

                        // Can't use "hide" and "show" methods here, as they overwrite
                        // the "open" class funcionality.
                        filteredProperties.removeClass("hidden");
                        filteredCategories.removeClass("hidden");
                        categoriesToHide.addClass("hidden");
                        propertiesToHide.addClass("hidden");

                        // Only add this when there is a filter, so the the CSS
                        // selectors can get the last visible property by class.
                        filteredCategories.find(".property:not(.hidden):last").addClass("lastVisible");

                        // Open parent categories to show the properties.
                        filteredCategories.filter(":not( .open )").each(function (index, element) {
                            DocUtils.API.toggleCategoryOpen(element, true);
                        });
                    }
                }, 500);
            }
        }(),

        /**
         * Apenas permite visualizar a propriedade instanciada. Caso a visualização já 
         * seja apenas desta proprieade, volta a mostrar todas as outras. 
         */
        filterById: function (element) {

            //  Obtem o nó relativo a este elemento na API
            let key = element.getAttribute("key");
            let filteredNodeId = "category_" + key;
            let filteredNode = document.getElementById(filteredNodeId);

            //  Obtem todos os nós pais da API
            let allNodes = Array.from(document.getElementsByClassName("property-category"));

            //  Verifica se todos os outros nós não estão visiveis
            let allNodesNotVisible = allNodes.every(el => (el.id != filteredNodeId && el.classList.contains("hidden")) || el.id == filteredNodeId);

            //  Aplica ou retira a classe "hiden" para,
            //  respectivamente, esconder ou mostrar o elemento
            allNodes.forEach((el) => {
                if (allNodesNotVisible) {
                    el.classList.remove("hidden");
                } else {
                    el.classList.add("hidden");
                }
            })

            //  Remove a cor primária de todos os elementos do indice
            let indexItems = Array.from(document.getElementsByClassName("index-item"));
            indexItems.forEach(el => el.classList.remove("text-primary"));

            //  Quando a filtragem for feita
            if (!allNodesNotVisible) {
                //  Permite a visualização unica do elemento
                filteredNode.classList.remove("hidden")

                //  Adiciona a cor primária no 
                //  elemento selecionado do indice
                element.classList.add("text-primary")
            }
        },

        /**
         * Faz o rolamento do indice lateral acompanhar o da página 
         */
        scrollUpdate: function (event) {
            //  Obtem o primeiro container visivel na tela 
            let containers = document.querySelectorAll(".property-category");
            for(let i = 0; i < containers.length; i++){
                var container = containers[i];
                if(container.offsetTop > window.pageYOffset && i > 0){
                    container = containers[i - 1];
                    break;
                }
            }

            //  Obtem o elemento do indice referente ao container
            let id = container.id;
            let keyArray = id.split("_");
            let key = keyArray[keyArray.length - 1];
            let filterNode = document.querySelector(`[key="${key}"]`);

            //  Move o scroll para que o elemento do indice seja visivel
            let parentNode = filterNode.parentElement;
            parentNode.scrollTop = filterNode.offsetTop;
        }
    }
};
