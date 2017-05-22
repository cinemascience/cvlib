var buildSingleContent = function(database, querySet) {
	var controls = $('<div class="visControls controlPanel" mode="single"></div>');
	var contents = $('<div class="visContents" mode="single"></div>');

	var queryTable = CVLIB.UIFactory.createSimpleQueryTable(querySet);
	controls.append(queryTable);
	var viewport = CVLIB.UIFactory.createViewport();
	contents.append(viewport);
	new CVLIB.ControlsPhiTheta(viewport, querySet);

	var renderer = new CVLIB.RendererSpecA();
	//var label = buildLabel('single');

	var renderFunction = function(resultSet) {
		//viewport.label.html(resultSet.data.label);
		renderer.render(resultSet.data, viewport.canvas, true);
	};

	var updateFunction = function(e, parameter){
		//database.processQueryWithLabels( querySet, label, renderFunction );
		database.processQuery(querySet, renderFunction);
	};

	querySet.emitter.on('change', updateFunction);

	updateFunction();

	var title = $('<div class = "controlTitle">'+
					'Single View</div>')
	title.insertBefore(queryTable);

	var help = $('<div class="controlSubPanel">'+
				'Ctrl + Right-Click and drag on image to rotate camera.<br>'+
				'Ctrl + Scroll to scale image.</div>');
	controls.append(help);

	return {controls: controls, content: contents};
}