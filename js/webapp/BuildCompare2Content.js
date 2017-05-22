var buildCompare2Content = function(database, querySet) {
	var controls = $('<div class="visControls controlPanel" mode="compare2"></div>');
	var contents = $('<div class="visContents" mode="compare2"></div>');

	var queryTable = CVLIB.UIFactory.createCompareQueryTable(querySet, 2);
	controls.append(queryTable);
	var viewport1 = CVLIB.UIFactory.createViewport();
	contents.append(viewport1);
	var viewport2 = CVLIB.UIFactory.createViewport();
	contents.append(viewport2);

	var renderer = new CVLIB.RendererSpecA();
	var label = buildLabel('compare2');
	console.log(label);

	var renderFunction = function(resultSet) {
		viewport1.label.html(resultSet.data[0].label);
		renderer.render(resultSet.data[0], viewport1.canvas, false);
		viewport2.label.html(resultSet.data[1].label);
		renderer.render(resultSet.data[1], viewport2.canvas, false);
	};

	var updateFunction = function(e, parameter){
		database.processQueryWithLabels(querySet, label, renderFunction);
	};

	querySet.emitter.on('change', updateFunction);

	updateFunction();

	var title = $('<div class = "controlTitle">'+
					'Compare View (2)</div>')
	title.insertBefore(queryTable);

	var help = $('<div class="controlSubPanel">'+
				'Select a parameter to compare on.<br>'+
				'Select the 2 values of that parameter to see.</div>');
	controls.append(help);

	return {controls: controls, content: contents};
}