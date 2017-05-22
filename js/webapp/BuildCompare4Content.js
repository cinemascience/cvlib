var buildCompare4Content = function(database, querySet) {
	var controls = $('<div class="visControls controlPanel" mode="compare4"></div>');
	var contents = $('<div class="visContents" mode="compare4"></div>');

	var queryTable = CVLIB.UIFactory.createCompareQueryTable(querySet, 4);
	controls.append(queryTable);

	var row1 = $('<div id="compare4_row1"></div>');
	var viewport1 = CVLIB.UIFactory.createViewport();
	var viewport2 = CVLIB.UIFactory.createViewport();
	row1.append(viewport1, viewport2);

	var row2 = $('<div id="compare4_row2"></div>');
	var viewport3 = CVLIB.UIFactory.createViewport();
	var viewport4 = CVLIB.UIFactory.createViewport();
	row2.append(viewport3, viewport4);

	contents.append(row1, row2);

	var renderer = new CVLIB.RendererSpecA();
	var label = buildLabel('compare4');

	var renderFunction = function(resultSet) {
		viewport1.label.html(resultSet.data[0].label);
		renderer.render(resultSet.data[0], viewport1.canvas, false);
		viewport2.label.html(resultSet.data[1].label);
		renderer.render(resultSet.data[1], viewport2.canvas, false);
		viewport3.label.html(resultSet.data[2].label);
		renderer.render(resultSet.data[2], viewport3.canvas, false);
		viewport4.label.html(resultSet.data[3].label);
		renderer.render(resultSet.data[3], viewport4.canvas, false);
	};

	var updateFunction = function(e, parameter){
		database.processQueryWithLabels( querySet, label, renderFunction );
	};

	querySet.emitter.on('change', updateFunction);

	updateFunction();

	var title = $('<div class = "controlTitle">'+
					'Compare View (4)</div>')
	title.insertBefore(queryTable);

	var help = $('<div class="controlSubPanel">'+
				'Select a parameter to compare on.<br>'+
				'Select the 4 values of that parameter to see.</div>');
	controls.append(help);

	return {controls: controls, content: contents};
}