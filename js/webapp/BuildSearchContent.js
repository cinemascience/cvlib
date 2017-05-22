var buildSearchContent = function(database, querySet) {
	var controls = $('<div class="visControls controlPanel" mode = "search"></div');
	var contents = $('<div class="visContents" mode="search"></div>');

	//Create searchBar and its controls
	var searchBar = CVLIB.UIFactory.createSearchBar(querySet);
	var searchMessage = searchBar.message;
	searchMessage.addClass('controlSubPanel')
	//Create search options
	var searchOptionsContainer = $('<div id="searchOptionsContainer" class="controlSubPanel"></div>');
	//Create selection box to specify how to sort results
	var sortSelectionContainer = $('<div id="sortSelectionContainer"></div>');
	var sortSelectionLabel = $('<span id="sortSelectionLabel">Sort results by: </span>');
	var sortSelection = CVLIB.UIFactory.createRawParameterSelect(querySet);
	sortSelection.addClass('sortSelection');
	sortSelectionContainer.append(sortSelectionLabel,sortSelection);
	//Create checkbox to reverse order of results
	var reverseSortContainer = $('<div id=reverseSortContainer"></div>');
	var reverseSortLabel = $('<span id="reverseSortLabel">Reverse Order:</span>');
	var reverseSortBox = $('<input type="checkbox" id="reverseSortBox"></input>');
	reverseSortContainer.append(reverseSortLabel, reverseSortBox);
	//Create selection box to specify results shown per page
	var resultsPerPageContainer = $('<div id="resultsPerPageContainer"></div>');
	var resultsPerPageLabel = $('<span id="resultsPerPageLabel">Results per page: </span>')
	var resultsPerPageSelection = $('<select id="resultsPerPageSelection"></select>');
	for (var i = 25; i <= 200; i *= 2) { //Add options to selection (set default to 50)
		var option = $('<option value="'+i+'" class="resultsPerPageOptions">'+i+'</option>');
		if (i == 50)
			option.attr('selected','selected');
		resultsPerPageSelection.append(option);
	}
	resultsPerPageContainer.append(resultsPerPageLabel, resultsPerPageSelection);
	//Add controls to search options container
	searchOptionsContainer.append(sortSelectionContainer,reverseSortContainer,resultsPerPageContainer);
	controls.append(searchBar, searchOptionsContainer);

	//Store results data
	var results;
	var resultsPerPage = resultsPerPageSelection.val();
	var currentPage = 1;

	//DOM used in displaying results
	var resultsContainer = null;
	var renderer = new CVLIB.RendererSpecA();
	var label = buildLabel('search', querySet);

	var renderFunction = function(resultSet) {
		if (resultsContainer) //remove and recreate the results container if it's already there
			resultsContainer.remove();
		resultsContainer = $('<div class="searchResultsContainer"></div>');
		contents.append(resultsContainer);

		//Iterate through results and add viewports to page
		var x = 0;
		for (var i = ((currentPage-1)*resultsPerPage);
					i < currentPage*resultsPerPage && i < results.count;
					i++) {
			var viewport = CVLIB.UIFactory.createViewport();
			viewport.label.html(results.data[i].label);
			renderer.render(results.data[i],viewport.canvas, false);
			resultsContainer.append(viewport);
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
	};

	//Recalculate the number of pages needed and re-create the pageNav widget accordingly
	var updatePagesFunction = function() {
		currentPage = 1;
		$('.pageNav').remove();
		if (results.count > resultsPerPage) {
			var pageNav = $('<ul class="pageNav"></ul>');
			var numPages = Math.floor(results.count / resultsPerPage);
			if (results.count % resultsPerPage > 0)
				numPages += 1;
			//Create a pageButton for every page
			for (var i = 1; i <= numPages; i++) {
				var pageButton = $('<li class="pageButton">'+i+'</li>');
				if (i == 1)
					pageButton.attr('mode', 'selected');
				else
					pageButton.attr('mode', 'default');
				//pageButton changes selected page and re-renders results when clicked
				pageButton.on('click', function(e){
					if ($(this).attr('mode')!='selected') {
						currentPage = parseInt($(this).text());
						$('.pageButton[mode=selected]').attr('mode', 'default');
						$(this).attr('mode', 'selected');
						renderFunction();
					}
				});
				pageNav.append(pageButton);
			}
			//$('body').append(pageNav);
			controls.append(pageNav);
		}
	};

	//Re-order the results by the given Parameter
	var sortResultsByParam = function(param) {
		if (results) {
			var paramKey;
			for (var p in querySet.parameters) {
				if (querySet.parameters[p] === param) {
					paramKey = p;
					break;
				}
			}
			console.log(paramKey);
			results.data.sort(function(a,b) {
				var aIndex = param.values.findIndex(function(val){return val == a.values[paramKey];});
				var bIndex = param.values.findIndex(function(val){return val == b.values[paramKey];});
				return aIndex - bIndex;
			});
		}
	};

	var processSearch = function(e, parameter){
		database.processQueryWithLabels( querySet, label, function(resultSet) {
			results = resultSet;
			$.extend(results, {count : results.data.length});
			searchMessage.text(results.count + " results found!");
			searchMessage.attr('mode', 'done');
			sortResultsByParam(querySet.parameters[sortSelection.val()]);
			if (reverseSortBox.is(':checked'))
				results.data.reverse();
			updatePagesFunction();
			renderFunction();
		});
	};

	//Add listener to sortSelection to re-sort results when changed
	sortSelection.on('change', function(){
		if (results) {
			sortResultsByParam(querySet.parameters[sortSelection.val()]);
			if (reverseSortBox.is(':checked'))
				results.data.reverse();
			renderFunction();
		}
	});

	//Add listener to reverseSortBox to reverse the order of results when changed
	reverseSortBox.on('change', function() {
		if (results) {
			results.data.reverse();
			renderFunction();
		}
	});

	//Add listener to resultsPerPageSelection to update pages when changed
	resultsPerPageSelection.on('change', function(){
		resultsPerPage = resultsPerPageSelection.val();
		if (results) {
			updatePagesFunction();
			renderFunction();
		}
	});

	var searchButton = $('<button class="loadButton" mode="search">Search</button>');
	searchButton.on('click', processSearch);
	searchButton.insertAfter(searchBar.bar);

	var title = $('<div class = "controlTitle">'+
					'Search Mode</div>')
	title.insertBefore(searchBar);

	var help = $('<div class="controlSubPanel">'+
				'Enter a query into the search box and press \'Search.\'<br>'+
				'Click an image to view in full-size.</div>');
	controls.append(help);

	return {controls: controls, content: contents};
}