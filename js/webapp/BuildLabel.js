var buildLabel = function(mode, querySet) {
	switch (mode) {
		case 'single':
			//No labels on the single view by default
			return '<div class="labelContents" mode="single"></div>';
		case 'matrix':
			//Label shows the values of the two properties being compared
			return '<div class="labelContents" mode="matrix">'+
					'<b>{vs1_label}:</b> {vs1}<br>'+
					'<b>{vs2_label}:</b> {vs2}</div>';
		case 'search':
			//Label shows the values of all properties
			var label = '<div class="labelContents" mode="search">'+
						'<b>Result #:</b> {result}<br>';
			for (p in querySet.parameters) {
				var name = querySet.parameters[p].label;
				label += ('<b>'+name+':</b> {'+name+'}<br>'); 
			}
			label += '</div>';
			return label;
		case 'compare2':
			//Label shows values of properties being compared
			return '<div class="labelContents" mode="compare2">'+
					'<b>{compare_label}:</b> {compare}</div>';
		case 'compare4':
			//Label shows values of properties being compared
			return '<div class="labelContents" mode="compare4">'+
					'<b>{compare_label}:</b> {compare}</div>';
	}
}