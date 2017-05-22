var buildViewer = function(databasePath, viewMode, callback) {
	var database
	var querySet;
	var contents;

	database = new CVLIB.DatabaseSpecA(databasePath, function(qs) {
		querySet = qs;
		doneLoading();
	});

	var doneLoading = function() {
		switch (viewMode) {
			case 'single':
				contents = buildSingleContent(database, querySet);
				break;
			case 'matrix':
				contents = buildMatrixContent(database, querySet);
				break;
			case 'search':
				contents = buildSearchContent(database, querySet);
				break;
			case 'compare2':
				contents = buildCompare2Content(database, querySet);
				break;
			case 'compare4':
				contents = buildCompare4Content(database, querySet);
				break;
			default:
				contents = buildSingleContent(database, querySet);
		}
		
		$('#controlsPane').append(contents.controls);
		var controlPaneWidth = $(contents.controls).outerWidth(true);
		$('#controlsPane').css('width',controlPaneWidth + 'px');
		$('#contentPane').css('margin-left',controlPaneWidth + 50 + 'px');
		$('#contentPane').append(contents.content);

		callback();
	}
}