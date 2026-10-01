# Layer and group property catalogue

> Every property a layer, a group or a layer-row button accepts, generated from the platform source: the declared API of a query's layer definitions.

Mappia reference, section "Model". Page: https://mappia.earth/reference/property-catalogue/


The complete property list of a layer definition, as the platform declares it. Which properties apply to which kind of layer is explained in the previous chapter; this is the exhaustive list, generated from the source.

## Layers

### LayersProperties — Layers Properties

You can define the following properties for a Layer:

| Name | Type | Description |
|---|---|---|
| `categorical` | `Boolean` | Switches the generated legend of a `source: 'calculate'` layer to categorical mode. When `true`, every distinct value returned by `expression()` becomes its own legend entry (values are grouped by value, never into ranges) and the colours come from… |
| `categoricalPalette` | `Array.<Array.<Number>>` | Colours of the legend entries of a categorical `source: 'calculate'` layer (see `categorical`), as an array of `[R, G, B]` triplets (0 to 255). The entries are assigned, in the sorted order of the values returned by `expression()`, spreading evenly over the… |
| `description` | `String` | Define the text that will be displayed when the mouse hover the Legend Window Title. This description applies when the 'source' of the map is 'xyz' or the Layer is a 'vector'. |
| `descriptionHtml` | `String` | Define the content that will be displayed at the Query section ("Exibir Consulta" button). This property accepts any string in HTML format. Besides that, you can also use predefined tools. |
| `disabledAttributes` | `String` | Define which styles will be hidden in the Style Chooser Combobox from Layers that has the 'source' property as 'local'. You need to pass the name of a style as in the GetCapabilities() xml. They follow the pattern of the map name, underline (_) and then the… |
| `exclusiveGroupDetails` | `String` | Define a name for a Layer Details. Between all Layers with the same ‘exclusiveGroupDetails’ name, only one Layer can have its Legend open each time. |
| `extents` | `Array.<Numeric>` | Define which tiles will be used to render the map. All the tiles that are within the 'extents' coordinates will be used to render the map. The extents must be in EPSG:4326 (coordinates in lat,long). Also, the array values need to be in the order: [minX, minY,… |
| `global` | `Object` | A second way to declare query globals from a layer: an object whose properties become temporary globals, passed to `ExtjsUtils.QUERY.setQueryGlobalProperties` while the layer is interpreted. The usual form is the… |
| `hideLegendButton` | `Boolean` | Hides the legend of the layer in its Legend Window. Set it to 'true' to hide it, 'false' to display it. It applies to every layer source: on a `local` layer it hides the "show legend" toggle button of the row; on a `calculate`, `file` or `xyz` layer it hides… |
| `hideListing` | `Boolean` | Define if should hide a Layer in the list that appears when the mouse hover the Group Title at the top of the screen. Set it to 'true' to hide that Layer in the list. Otherwise, set it to 'false' to show it. |
| `hideMetadata` | `Boolean` | If true, hides the metadata button in the Legend Window for this layer. When omitted, falls back to the plugin hideMetadata option (URL options=hidemetadata). |
| `hideStyleChooser` | `Boolean` | Define if should hide the Combobox with the map possible styles that can be applied to a map in a Layer that has the 'source' 'local'. |
| `hideTilePlaceholder` | `Boolean` | Removes the stretched placeholder tile that is shown while the real tiles load (the OpenLayers `resize` transition). Set it to `true` for layers whose content changes between loads, such as timeline or calculated maps, to avoid the previous image being… |
| `insideOpacity` | `Array.<Numeric>` | Defines the opacity for the maps defined in the 'name' property. This property is an array of values which are the opacity that will be applied in the same order that the map was defined in the 'name' property. For example, the first value in the… |
| `legendTitle` | `String` | Defines the text that will be displayed at the top of the 'legendhtml tool' declared at the 'descriptionHtml' property |
| `maxQntEntries` | `Number` | Maximum number of legend entries generated from the values returned by `expression()` on a non-categorical `source: 'calculate'` layer; when there are more distinct values than this they are grouped into value ranges. The value is clamped to the length of the… |
| `name` | `String` | Defines the maps that will be a part of the Layer. Every map defined in here will be shown when the Layer is active. Besides that, all of their information can be used to calculate a new map combining their data. In this website you will find some of the maps… |
| `opacity` | `Numeric` | Define the opacity of the Layer. The opacity is a value between 0 and 1 that is a scale for its transparency. 0 is completely transparent. 1 is completely visible. |
| `priority` | `Number` | Defines the order of which map will be rendered on top of the others. Layers with higher 'priority' will always be rendered on top of the layers with lower 'priority'. |
| `showLoadingModal` | `Boolean` | Shows the "generating legend" loading mask visibly over the page while the layer is paused (calculating or loading a resource). By default the mask is an invisible overlay that only changes the cursor to "wait"; set it to `true` to make it visible. Only shown… |
| `showRemoveBtn` | `Boolean` | Defines it the remove button at the top right of the Layer Legend Window show be displayed. Set it to 'true' to show it. Set it to 'false' to hide it. |
| `source` | `String` | Defines the source from where the maps declared at the name will be loaded from. The Source can be one of the following: - 'local': The maps in the name will be loaded from the CSR servers - 'calculate': The maps in the name gonna be used to calculate a new… |
| `startLegendOpen` | `Boolean` | Defines if the Legend Window should start or not. Set it to 'true' to make it start open. Set it to 'false' for it to start closed. |
| `startListed` | `Boolean` | Define if the Layer should start with its Legend Window visible or not. This does not make the Layer visible on the map by itself. For that, you need to set the 'visibility' property to 'true'. 'startListed' just displays the Legend Window associated with the… |
| `styles` | `String` | Defines which styles will be applied over the maps defined at the 'name' property. The styles are applied in the same order as the maps are declared in name. For example, if there are 3 maps in the 'name' property and 3 styles. The first style will be applied… |
| `thumbUrl` | `String` | Define the thumbnail image that is displayed when the mouse hovers the Legend Window title. You can define any image you would like to display as the map thumbnail. You just need to pass its URL. |
| `title` | `String` | Defines the Title that will be displayed at the Legend Window in the top left corner of the screen and inside the Group List at the top center of the screen. |
| `updateAutomatically` | `Boolean` | Define if a Layer with the 'source' value as 'calculate' should be updated automatically after any user interactions, like changing an input value. If you’re creating a Layer with the 'source: calculate' you need to set this property to 'true' for it to… |
| `viewColor` | `String` | HTML color to use on the group. |
| `visibility` | `Boolean` | Define if the Layer should start visible or not. Set it to 'true' for the Layer start visible. Otherwise, set it to 'false' and the Layer will start hidden. |

Full descriptions, defaults and examples: [LayersProperties in the API reference](/api/#category_LayersProperties).

### LayersFunctions — Layers Functions

You can use the following functions for a Layer:

| Name | Type | Description |
|---|---|---|
| `afterCalc` | `function` | This function is executed right after the 'expression()' calculations. This function is only available for a Layer with a 'source' of type 'calculate' and that has defined the 'expression()' function. @param inputs {Array} The value of each input defined in… |
| `beforeCalc` | `function` | This function is executed before any calculation is made in the 'expression()' function. This function is only available for a Layer with a 'source' of type 'calculate'. Also, it’s called even if there is no definition for the 'expression()' function. @param… |
| `expression` | `function` | This function is executed for every pixel in the map. It can be used to process the information of all maps in the Layer to create a new one. This function is called regularly to update the map. @param layerVals {Array.&lt;LayerValues&gt;} Is an array that has the… |
| `functions` | `Object` | Associate custom functions to handle events on layer callbacks such as button callbacks or any layer callbacks. These functions are scoped to the Layer and can be referenced by name on layer widget callbacks. Functions can also be accessed using… |
| `legendColor` | `function` | This function generates the color of each value/category of the calculated map generated by the 'expression()' function. The return value is the legend color that will be applied to the category. PS: This function callback is called in layer context. @param… |
| `onInputsReady` | `function` | This function is called when all inputs have been loaded and are ready. Even from Layers that aren’t visible. @param inputs {Array} The value of each input defined in the descriptionHtml. The order of the values is the same as the inputs (i.e. the first input… |
| `onVisibilityChange` | `function` | This function is called whenever a Layer changes its visibility. Like, when the user toggle the value in the visibility button at the top right in the Legend Window. @param visibility {Boolean} It’s true if the Layer is visible or false otherwise. @param… |

Full descriptions, defaults and examples: [LayersFunctions in the API reference](/api/#category_LayersFunctions).

## Groups

### GroupProperties — Groups Properties

Inside the brackets of a Group you can define their properties, which are the following:

| Name | Type | Description |
|---|---|---|
| `color` | `String` | Defines the Color of the group. This is the Color of the Title and some elements inside the sub menu on the top of the screen. |
| `customLayerClass` | `String` | Extra CSS class added to the node of a `viewTitle` group in the Legend Window, so the group title and its rows can be styled with `ExtjsUtils.CSS.defineClass` or a stylesheet. Only groups with a `viewTitle` create a node; on a layer the same key styles the… |
| `defaultProperties` | `Object` | Specifies properties that apply universally to all layers within a group, including nested subgroups and their respective layers. Priority is determined by specificity: a property defined at the layer level takes precedence, followed by properties defined in… |
| `elements` | `Array.<Layers>` | Defines the Layers that will be part of the Group. Each Layer can have multiple maps inside it. All maps inside a Layer will be shown together when that Layer is enabled. Besides that, all information about those maps can be used to calculate a new one using… |
| `global` | `Object` | A second way to declare query globals: an object whose properties become temporary globals, passed to `ExtjsUtils.QUERY.setQueryGlobalProperties` while the group is interpreted (before its layers). The usual form is the… |
| `openGroup` | `Boolean` | Defines if the 'viewTitle' should start opening or collapse. Set it to 'true' for the 'viewTitle' start open or 'false' for it to start closed. This property only applies to a group that has the 'viewTitle' property defined. If the Group View has any visible… |
| `title` | `String` | Defines the Title of the group. The Title is shown at the sub menu on the top of the screen. |
| `viewTitle` | `String` | Define the Title of the View that will gather together the elements inside it (Groups or other Views). If an external View has in its elements another definition of a 'viewTitle', subviews will be created, like in the second example. |

Full descriptions, defaults and examples: [GroupProperties in the API reference](/api/#category_GroupProperties).

### GroupFunctions — Groups Functions

You can also define the following functions for a Group:

| Name | Type | Description |
|---|---|---|
| `onClickViewGroup` | `function` | Called whenever the user clicks the title of a `viewTitle` group in the Legend Window. It belongs on a group that has `viewTitle`: the handler is bound to that group's tree node, so `this` is the node and `view.expanded` tells whether the group is open after… |
| `onToggleViewGroup` | `function` | Called whenever a `viewTitle` group of the Legend Window is expanded or collapsed (by the user or by code). It belongs on a group that has `viewTitle`: the handler is bound to that group's tree node, so `this` is the node and `view.expanded` is `true` after… |

Full descriptions, defaults and examples: [GroupFunctions in the API reference](/api/#category_GroupFunctions).

## Configuring Layers

### ConfigLayer — Layer properties configuration

Configurable exhibition of each map, defining interactions, possible internal maps and applied calculations among them.

| Name | Type | Description |
|---|---|---|
| `attribution` | `String` | Recognizes someone as the platform author, showing in the "Powered by: {insert name}". |
| `callFunction` | `function(name, anyArguments) : *` | Calls one of the layer's own `functions` by name with the layer as `this`. Extra arguments are passed through to the function. @param name {String} Key of the layer's `functions` object. @param anyArguments {*} Arguments forwarded to the function. |
| `customLayerClass` | `String` | Extra CSS class added to the row of the layer in the Legend Window and to its vertical options menu (see `verticalMenu`), so the layer can be styled with `ExtjsUtils.CSS.defineClass` or a stylesheet. The same key on a `viewTitle` group is added to the group… |
| `enableToggle` | `Boolean` | Defines the associated button as a regular button or toggle. PS: When its true the callback function name is 'toggle', otherwise the callback is 'handler'. |
| `getLayerLegend` | `function(composedLayer, index) : Array` | Gets the associated layer legend content by its index. PS: The legend format is the same as expected by the composedLayer.setCalculateLegend function. Usage:this.setCalculateLegend(ExtjsUtils.Layer.getLayerLegend(composedLayer, 0)); @param composedLayer… |
| `group` | `String` | Defines which group the layer is associated with. Layers from the same group can't be active simultaneously. Reserved value: "background" has special meaning, will make the layer act as background basemap. |
| `isCalculationPaused` | `function() : Boolean` | Returns calculation status. True if calculations are paused, false otherwise. |
| `maxExtent` | `OpenLayers.Bounds` | Defines a geographical limit for a map rendering. |
| `maxZoom` | `Numeric` | Defines the limit of the real max zoom of a given layer. When map zoom exceed this, the image is reused and stretched. |
| `maxscale` | `Numeric` | Defines the limit of the real max scale of a given layer. When the map scale value exceeds the defined one, the image is reused and stretched. |
| `metadataUrl` | `string\|null` | Defines the url to show custom layers metadata information. If empty, the default value is obtained from layer metadata from the WMS definition. PS: The linked domain must have CORS headers enabled. |
| `minscale` | `Numeric` | Defines the limit of the real min scale of a given layer. When the map scale reaches a value lower than the defined one, the image is reused and compressed. |
| `openGroup` | `Boolean` | Defines if the group starts opened, even without any visible layers. Set it true to start open, false otherwise. PS: If one layer is visible, the group will start open. It works at both levels: on a `viewTitle` group it makes that group start expanded; on a… |
| `operation` | `String` | Defines how the pixels of each map of a `source: 'calculate'` layer are decoded into the values that `expression()` receives in `layersVals`. It is a comma-separated list with one token per map in `name`, in the same order; an empty token keeps that map on… |
| `shouldKeepRecord` | `Boolean` | Defines what the 'X' (remove) button of the Legend Window does (see `showRemoveBtn`). When `true` the layer record is kept: the layer is only hidden and removed from the listing, so it can be listed again from the group menu at the top. When `false` the layer… |
| `toggleGroup` | `String` | Places a layer in a group of layers with mutually exclusive visibility. At most one layer of the same group will be visible, when one is shown, the others will be hidden. |
| `type` | `String` | Defines how a `source: 'file'` layer gets its features (case insensitive). One of: 'load': you load the data yourself in the `loadData` callback (`function(inputs, config)`, called with the layer as `this`). The callback must trigger… |
| `useLayerTooltip` | `Boolean\|Number` | If false, the layer tooltip is not shown. If a number, the layer tooltip is shown for the specified layer. (Only supported for layers with `source: "calculate"`) Otherwise follow tooltip default behavior that varies from map source |
| `verticalMenu` | `Boolean` | Uses the compact layout for the Legend Window of the layer: the secondary buttons (remove, metadata, download, zoom to extents) and a vertical opacity slider move into a small options menu opened by a gear button, instead of being drawn in the row with the… |

Full descriptions, defaults and examples: [ConfigLayer in the API reference](/api/#category_ConfigLayer).

### VectorLayer — VectorLayer configuration

Vector Layer configuration.

| Name | Type | Description |
|---|---|---|
| `activateDrawMode` | `function(mode) : Boolean` | Select polygon/line tool and enter edit mode when needed (split-button menu). @param mode {String} 'polygon' or 'line' — must be one of the layer's configured `drawModes`. |
| `applyFeatureChanges` | `function() : Boolean` | Finish sketch or deselect feature (triggers featureEditEnd when applicable). |
| `applyGeomOp` | `function(sourceGeoms, options) : Object` | Replace geometries on this **drawable VectorLayer** with id/attribute control via one options object. Only available on vector layers from ``VectorFileSource`` (e.g. ``drawable: true``). Implementation helpers live in {@link DrawableSplit.applyGeomOp}. @param… |
| `callFunction` | `function(name, anyArguments) : *` | Calls one of the layer's own `functions` by name with the layer as `this`; falls back to a method of the layer with that name. Extra arguments are passed through to the function. @param name {String} Key of the `functions` object (or a layer method name).… |
| `cancelDrawing` | `function() : Boolean` | Cancel the in-progress sketch/edit without committing changes. |
| `cluster` | `Object` | AnimatedCluster options. Truthy object enables clustering even when `clusterDistance` is omitted. Zoom / map state is **not** passed into callbacks — read it yourself via `this.layer.map` (call scope is the strategy) or `ExtjsUtils.JS.getMap()`. |
| `clusterDistance` | `Numeric` | Defines the minimum relative distance (in pixels) to clusterize points. Set 0 to never clusterize, or a value greater than 0 to set the minimum distance. For a membership key or dynamic distance, use {@link VectorLayer.cluster} instead (or together —… |
| `convertJsonEntryToFeature` | `function(curObj, optionalGetLonLat) :…` | Converts a JsonObject into a Layer Feature (that can be added to layer). @param curObj {JsonObject} Object with properties. @param optionalGetLonLat {function} Optional function to get position coordinates from JSON. P.S.: Optional function to get X,Y values… |
| `coordinates` | `Object` | Redefines the coordinate property names to {x, y}. PS: Used only if the 'VectorLayer.getVector' is not defined. |
| `defaultStyle` | `Object` | Defines the default style that will be applied to the geometry. PS: Accepts 'context' and 'rules'. Property 'context': allows definition of functions. Property 'rules': allows definition of filters (only the geometries that fit into this rule will be… |
| `deselectFeature` | `function() : Boolean` | Deselect the currently selected/edited feature without discarding it. |
| `drawable` | `Boolean\|Object` | Makes a vector layer editable: users can sketch, edit and delete polygon (optionally polygon+line) features, with configurable overlap resolution. Set to `true` for defaults, or an object to configure: - `maxGeomCount` {Number} — maximum number of features… |
| `fillGeometryLayer` | `function(config)` | Loads (or reloads) the layer's features from a data-loading config, following its `type` strategy: `load` calls `config.loadData`, `csv`/`jsonurl`/ `geojsonurl` fetch `config.url`, `json` uses the inline `config.json`, `empty` adds nothing. Unknown types fall… |
| `findFeatureById` | `function(featureId) : OpenLayers.Feature.Vector\|null` | Find a feature by the id returned from ``getFeatureId`` (fid, id, or index). Prefer this over OpenLayers ``getFeatureById`` when callers use getFeatureId ids. @param featureId {String\|Number} Id as returned by `getFeatureId`. |
| `finishDrawing` | `function() : Boolean` | Commit in-progress polygon sketch (same as double-click). |
| `fromProj` | `String` | Defines the projection of the JSON (accepts only EPSG:4326 and EPSG:900913). |
| `generateNewLegend` | `function()` | Runs the layer's `beforeCalc(inputs)` again with the current input values. It is the supported way to force a vector layer to refresh whatever `beforeCalc` builds (styles, filters, charts) from outside a normal cycle, for example from `onVisibilityChange`;… |
| `getEditingFeatureId` | `function() : String\|Number\|null` | Feature id currently selected for vertex edit (drawable modify control), if any. |
| `getFeatureId` | `function(feature) : String\|Number\|null` | Stable-enough id for a feature on this layer: ``fid``, then OpenLayers ``id``, otherwise the feature's index in ``layer.features`` (no synthetic attributes). @param feature {OpenLayers.Feature.Vector} Feature of this layer. |
| `getInputs` | `function() : Array` | Returns the current value of every input tool declared in `descriptionHtml`, in declaration order (the same array the layer callbacks receive as `inputs`). Use it from callbacks that do not receive `inputs`, such as a `{{button}}` handler or… |
| `getLayerDefinedFunctionsByName` | `function(name) : function\|Undefined` | Gets the layer inner function. Define the layer inner function at VectorLayer. Ex: { name: 'CSR:map_name', function: { nameFunctionExample: function(){alert('a');} } } @param name {String} Function name |
| `getVector` | `function` | Defines the callback function to parse the layer data and get the geometry. Callback Function getVector function(attribute, config) @param attribute {Object} Object with attributes. @param config {Object} Layer config. |
| `hoverSelectedStyle` | `Object` | Defines the style that will be applied to the geometry when the mouse hovers over a selected feature. Default hover selected style is the selected style PS: Accepts 'context' and 'rules'. Property 'context': allows definition of functions. Property 'rules':… |
| `hoverStyle` | `Object` | Defines the style that will be applied to the geometry when mouse is hovering. PS: Accepts 'context' and 'rules'. Property 'context': allows definition of functions. Property 'rules': allows definition of filters (only the geometries that fit into this rule… |
| `llbbox` | `OpenLayers.Bounds` | Bounds of the features currently on the layer, recomputed automatically after features are added or removed (and extended while drawing). Despite the name it is expressed in the map projection, not in lon/lat, so it can be passed straight to… |
| `loadGeojson` | `function()` | Function to load geojson and draw on the layer. |
| `onAdded` | `function()` | Defines the callback function that is called when the layer is added to the map, with its features already loaded: when the layer joins the map while its data is still being fetched (`jsonurl`, `geojsonurl`, `csv`, a `load` that fetches), the call waits for… |
| `onBeforeFeatureChangeCallback` | `function` | Defines the callback function that is called before a layer feature is added, removed or edited. PS: If it returns false, the change operation is canceled. @param operationType {String} Receive the operation type: 'add' or 'remove' when adding or removing… |
| `onClick` | `function` | Defines the callback function to the click event on Layer. @param event {Object} The click event Object. @param source {VectorFileSource} Auxiliary functions to deal with Vector Layer. @param inputs {Array.&lt;Object&gt;} Array with all layer input values. |
| `onClickCfg` | `function` | Defines the callback function to the Click Select controller. The additional parameters are listed in http://dev.openlayers.org/docs/files/OpenLayers/Control/SelectFeature-js.html. |
| `onFeatureChangeCallback` | `function` | Defines a function that is called after a layer feature is added, removed or edited. @param operationType {String} One of: ``'add'`` (features added in bulk, e.g. after loading data), ``'add1'`` (a single feature added interactively), ``'remove'`` (features… |
| `onHover` | `function` | Defines the callback function on 'Vector Layer' hover. @param evt {Object} Features. @param state {Boolean} True when hover starts, false when it ends. @param controller {Object} The controller itself. @param inputs {Object} Layer widget values. |
| `onInputsReady` | `function` | Called when all inputs are ready on layer. |
| `onLoad` | `function` | Defines the callback function to be called after the layer is loaded or added to a map. PS: You can use 'this' to access layer properties. @param widgetValues {Array} inputs for onLoad callback |
| `onSelectionToggle` | `function` | Defines the callback function to the unselect feature. @param event {Object} The click event Object. @param source {VectorFileSource} Auxiliary functions to deal with Vector Layer. @param inputs {Array.&lt;Object&gt;} Array with all layer input values. |
| `popupCallback` | `function` | Not implemented for file layers: accepted but never called (see `popupTemplate`). Use `onClick`, which receives the clicked feature. @param attributes {Array} attributes for popupCallback @param inputs {Array} inputs for popupCallback |
| `popupTemplate` | `String` | Not implemented for file layers: the value is accepted and kept on the layer, but nothing reads it, so no popup ever opens (the template belongs to the gxp feed sources this layer does not extend). Show a feature's attributes from `onClick` instead - for… |
| `resolveOverlap` | `function(editedGeoms, intersectingGeoms, options)` | Resolve overlaps between edited and existing polygons on this drawable VectorLayer. Uses ``drawable.onOverlap``: a single key applies immediately; an array prompts via ``ALERTIFY.confirmChoice`` (``merge`` / ``cut`` / ``keep``). @param editedGeoms… |
| `selectController` | `OpenLayers.Control.CustomSelectFeature` | The selection control created for the layer when `onClick`, `onSelectionToggle` or `onHover` is defined (undefined otherwise). It is the `OpenLayers.Control.CustomSelectFeature` instance, so you can call its `select(feature)`, `unselect(feature)`,… |
| `selectStyle` | `Object` | Defines the default style that will be applied to the selected geometry. PS: Accepts 'context' and 'rules'. Property 'context': allows definition of functions. Property 'rules': allows definition of filters (only the geometries that fit into this rule will be… |
| `setDrawing` | `function(enabled, callbackOnAdd)` | Defines drawing features on layers. PS: Function is available to the VectorLayer. @param enabled {Boolean} True to enable drawing, False otherwise. @param callbackOnAdd {function} Callback when a new feature is drew. P.S.: You can use 'this' to access layer… |
| `showLoadingModal` | `Boolean` | Shows the "generating legend" loading mask visibly over the page while the layer is paused (loading its data or another resource). By default the mask is an invisible overlay that only changes the cursor to "wait"; set it to `true` in the layer definition to… |
| `styleMap` | `Object\|OpenLayers.StyleMap` | Customizes the layer visualization. PS: It is an advanced parameter, so it might be easier to use selectedStyle, defaultStyle and hoverStyle. PS2: The 'hover' style is applied on hover event. |
| `waitingRenderAndLoadAssync` | `Number` | Number of asynchronous resources of the layer still loading (its own data for `csv`, `json`, `jsonurl`, `geojsonurl` and `load` types, plus `{{loadcsv}}`/`{{loadjson}}` inputs and any `startLoadingLayer` you trigger yourself). It is increased on… |

Full descriptions, defaults and examples: [VectorLayer in the API reference](/api/#category_VectorLayer).

### XYZLayer — XYZ configuration

XYZ Layer configuration.

| Name | Type | Description |
|---|---|---|
| `name` | `String` | Defines a map identifier. This name should be unique. |
| `source` | `Object` | Adds a layer to store the source. @param layerCfg {LayerConfig} Layer XYZ configuration. LayerConfig { url: url, name: name, isBaseLayer: isBaseLayer, sphericalMercator: sphericalMercator } |
| `url` | `String` | Defines the url where the map can be fetched from. Use the ${x} ${y} ${z} as placeholder for x, y and z coordinates. |

Full descriptions, defaults and examples: [XYZLayer in the API reference](/api/#category_XYZLayer).

### SourceConfig — Source

Layers sources configuration.

| Name | Type | Description |
|---|---|---|
| `onError` | `function` | Defines callback function to be called when the store failes to be loaded. |
| `onLoad` | `function` | Defines callback function to be called when the store is successfully loaded. |
| `ptype` | `String` | The source plugin type of a layer source: the `ptype` key of a source definition given to `ExtjsUtils.QUERY.addRemoteWMSServer`, or of a `sources` entry of a saved map. It defaults to `"gxp_customwmscsource"` (the platform's tiled WMS source, used whenever… |

Full descriptions, defaults and examples: [SourceConfig in the API reference](/api/#category_SourceConfig).

### FileLayer — File layer configuration

Additional configuration specific to layers loaded from local/inline data (source: 'file').

| Name | Type | Description |
|---|---|---|
| `json` | `Array.<Object>\|Object` | Inline data of a `source: 'file'` layer with `type: 'json'`. Either a GeoJSON object (FeatureCollection, Feature or a geometry; its projection is taken from `fromProj`, its `crs` or guessed from the coordinates) or an array of plain objects, each converted to… |
| `loadData` | `function` | Custom loader of a `source: 'file'` layer with `type: 'load'`: `function(inputs, config)` called with the layer as `this`, receiving the current input values and the layer definition. Add the features yourself (`this.addFeatures`, `this.loadGeojson`, ...) and… |
| `onVisibilityChange` | `function` | Callback when layer visibility is changed. PS: Is not called for the initial visibility of the layer. |
| `url` | `String` | URL of the data of a `source: 'file'` layer, used by the types `csv` (a CSV file), `jsonurl` (a JSON array of plain objects) and `geojsonurl` (a GeoJSON file). Relative URLs are resolved against the Mappia page. Also available inside `loadData` as… |

Full descriptions, defaults and examples: [FileLayer in the API reference](/api/#category_FileLayer).

## paramsButtonConfig

### paramsButtonConfigProperties — paramsButtonConfig Properties

You can define the following properties for a button:

| Name | Type | Description |
|---|---|---|
| `hideBottomButton` | `Boolean` | Hides the text buttons at the bottom of the query and legend sections of the Legend Window ("Show query"/"Hide query" and "Show legend"/"Hide legend"). Set it to 'true' to hide them or 'false' to display them. It only works inside a `paramsButtonConfig` entry… |
| `hideButton` | `Boolean` | Define if the associated button should be hidden. Set it to 'true' to hide the button or 'false' to show it. This property only applies to the type: 'query' |
| `iconCls` | `String` | Define a class that will be added to the html in the associated button. This class can be one that has a image on it like: - 'gxp-icon-togglevisibility' is the icon of the Show/Hide Map Button (The first icon on the Legend Window, from left to right) -… |
| `pressed` | `Boolean` | Defines if the button should start pressed or not. Set it to 'true' for it to start pressed or 'false' for start unpressed. For example, the 'query' button type set as pressed will display the Query region (where  the descriptionHtml content is) by default… |
| `toggleGroup` | `String` | Defines a group for all the buttons that has the same toggleGroup name. From all the buttons on the same group, only one can be active at each time. Whenever another one is activated the previous one collapses. |
| `tooltip` | `String` | Defines the help tooltip text that is displayed when the mouse hover the associated button. |
| `type` | `String` | Define which button will be affected by the configurations. The type can be one of the following: - 'query': The query button shows or hides the Query panel (where the descriptionHtml is drawn). - 'download': The download button is the one with a downward… |

Full descriptions, defaults and examples: [paramsButtonConfigProperties in the API reference](/api/#category_paramsButtonConfigProperties).

### paramsButtonConfigFunctions — paramsButtonConfig Functions

You can use the following functions for a button:

| Name | Type | Description |
|---|---|---|
| `handler` | `function` | Defines a function that will be called when the associated button is clicked. @param button {Object} is the button that was clicked by the mouse. @param clickEvent {MouseEvent} is the object that carries more information about the click event. |
| `toggleHandler` | `function` | This function is called whenever the associated button change its toggle state. PS: Using custom function, ignore the associatedButtonID "It doesnt have to even exists". @param button {Ext.Button} The button element that was clicked @param state {Boolean} The… |

Full descriptions, defaults and examples: [paramsButtonConfigFunctions in the API reference](/api/#category_paramsButtonConfigFunctions).

## General Information

### RawMaps — Web Raw Maps

The Raw Maps are some maps that are sent with each pixel value and not a RGBA color. All the manipulations are at most with integer or float precision so the colors must be applied on the client, after some calculation to, on the client, create each cell color value.

| Name | Type | Description |
|---|---|---|
| `operations` | `Object` | Enumeration of the operations a map of a `source: 'calculate'` layer can be decoded with. This is what the `operation` layer key selects, one token per map in `name`; the tokens are the lower-case names below, matched case and whitespace insensitive. The… |

Full descriptions, defaults and examples: [RawMaps in the API reference](/api/#category_RawMaps).

### QGIS — QGIS stylization

The style can be defined in QGIS and the automatic publication process will create the same looking style from the style file.

| Name | Type | Description |
|---|---|---|
| `styles` | `String` | Where a map's styles come from: they are not written in the query. A map is published with one or more styles, and when it is published from QGIS the layer's QGIS style is converted at publication time, so the classes, colours and legend labels the map shows… |

Full descriptions, defaults and examples: [QGIS in the API reference](/api/#category_QGIS).
