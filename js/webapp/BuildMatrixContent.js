var buildMatrixContent = function(database, querySet) {
	var controls = $('<div class="visControls controlPanel" mode="matrix"></div>');
	var contents = $('<div class="visContents" mode="matrix"></div>');

	var queryTable = CVLIB.UIFactory.createVersusQueryTable(querySet);
	var icon = $('<span>'+CVLIB.UIFactory.getTypeSymbol('range')+'</span>')
	icon.insertAfter(queryTable.find('ul:first'))

	controls.append(queryTable);

	var matrix = null;
	var renderer = new CVLIB.RendererSpecA();
	var label = buildLabel('matrix');

	var renderFunction = function(resultSet) {
		if (matrix) //remove the matrix if one is already there
			matrix.remove();

		matrix = CVLIB.UIFactory.createMatrix(resultSet);
		contents.append(matrix);

		var map = matrix.viewportMap;
		var x = 0;
		for (var i in resultSet.data) {
			for (var j in resultSet.data[i]) {
				var viewport = map[i][j];
				viewport.label.html(resultSet.data[i][j].label);
				renderer.render(resultSet.data[i][j],viewport.canvas, false);
				//new CVLIB.ControlsBasic(viewport);
				viewport.hide().delay((x++)*100).animate({opacity : 'toggle'}, 200);

				//Create a modal to display image when viewport is clicked
				viewport.on('click', function(){
				var modal = $('<div class="modalBackground"></div>');
				var canvas = $(this).find('.cvlib_canvas').clone().addClass('modalCanvas').appendTo(modal)[0];
				canvas.getContext('2d').drawImage($(this).find('.cvlib_canvas')[0],0,0);
				modal.on('click', function(){
					$(this).remove();
				});
				$('body').append(modal);
			});
			}
		}
	};

	var updateFunction = function(e, parameter){
		database.processQueryWithLabels(querySet, label, renderFunction );
	};

	var loadButton = $('<button class="loadButton" mode="matrix">Load</button>');
	loadButton.on('click', updateFunction);
	queryTable.find('tr:first td').append(loadButton);

	updateFunction();

	var title = $('<div class = "controlTitle">'+
					'Matrix View</div>')
	title.insertBefore(queryTable);

	var help = $('<div class="controlSubPanel">'+
				'Select the two parameters to compare across.<br>'+
				'Define the range to view for the two properties.<br>'+
				'Press \'Load\' to create matrix.<br>'+
				'Click an image to view in full-size.</div>');
	controls.append(help);

	return {controls: controls, content: contents};
}