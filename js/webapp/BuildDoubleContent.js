var buildDoubleContent = function(database1, querySet1, database2, querySet2) {
	var controls1 = $('<div class="visControls controlPanel" mode="single"></div>');
	var controls2 = $('<div class="visControls controlPanel" mode="single"></div>');
	var contents = $('<div class="visContents" mode="compare2"></div>');

	var queryTable1 = CVLIB.UIFactory.createSimpleQueryTable(querySet1);
	controls1.append(queryTable1);
	var queryTable2 = CVLIB.UIFactory.createSimpleQueryTable(querySet2);
	controls2.append(queryTable2);

	var viewport1 = CVLIB.UIFactory.createViewport();
	contents.append(viewport1);
	var viewport2 = CVLIB.UIFactory.createViewport();
	contents.append(viewport2);

	var renderer = new CVLIB.RendererSpecA();

	var renderFunction1 = function(resultSet) {
		renderer.render(resultSet.data, viewport1.canvas, false);
	};
	var renderFunction2 = function(resultSet) {
		renderer.render(resultSet.data, viewport2.canvas, false);
	};

	var updateFunction1 = function(e, parameter){
		database1.processQuery(querySet1, renderFunction1);
	};
	var updateFunction2 = function(e, parameter){
		database2.processQuery(querySet2, renderFunction2);
	};

	querySet1.emitter.on('change', updateFunction1);
	querySet2.emitter.on('change', updateFunction2);

	updateFunction1();
	updateFunction2();

	var title1 = $('<div class = "controlTitle">'+
					'Database 1</div>')
	title1.insertBefore(queryTable1);
	var title2 = $('<div class = "controlTitle">'+
					'Database 2</div>')
	title2.insertBefore(queryTable2);

	return {controls1: controls1, controls2: controls2, content: contents};
}