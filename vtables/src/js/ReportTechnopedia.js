var ReportTechnopedia = (function () {

	'use strict';

	function ReportTechnopedia(reportSetup, tagFilter, title) {
		this.reportSetup = reportSetup;
		this.tagFilter = tagFilter;
		this.title = title;
	}

	ReportTechnopedia.prototype.render = function () {
		var that = this;
		var documentsUrl = '/documents?relations=false&referenceSystem=technopedia';
		var documentsPromise = $.get(this.reportSetup.apiBaseUrl + documentsUrl).then(function (documents) {
				return documents;
			});
		var factsheetsUrl = '/factsheets?'
			// add information about relations
			 + 'relations=true'
			// use maximum result limit
			 + '&pageSize=-1'
			// include services (applications)
			 + '&types[]=10'
			// include resources (IT components)
			 + '&types[]=19'
			// define wanted relations
			 + '&filterRelations[]=serviceHasResources'
			 + '&filterRelations[]=factSheetHasDocuments'
			// define wanted attributes
			 + '&filterAttributes[]=ID'
			 + '&filterAttributes[]=fullName'
			 + '&filterAttributes[]=objectCategoryID'
			 + '&filterAttributes[]=resourceType'
			 + '&filterAttributes[]=displayName';
		var factsheetsPromise = $.get(this.reportSetup.apiBaseUrl + factsheetsUrl).then(function (response) {
				return response.data;
			});
		$.when(documentsPromise, factsheetsPromise).then(function (documents, factsheets) {
			var reportUtils = new ReportUtils();
			// extract data
			var fsIndex = new FactSheetIndex(factsheets);
			var services = fsIndex.getSortedList('services');
			var resources = fsIndex.getSortedList('resources');
			var resourceTypes = {
				1: 'Software',
				2: 'Hardware',
				3: 'Service'
			};
			var resourceTypesArray = [// objectCategoryID
				'Software',
				'Hardware',
				'Service'
			];
			var docIndex = {};
			for (var i = 0; i < documents.length; i++) {
				docIndex[documents[i].ID] = documents[i];
			}
			var getTechnopediaDocument = function (serviceResource) {
				if (!serviceResource.factSheetHasDocuments) {
					return;
				}
				for (var i = 0; i < serviceResource.factSheetHasDocuments.length; i++) {
					var documentRef = serviceResource.factSheetHasDocuments[i];
					if (documentRef && documentRef.documentID) {
						var document = docIndex[documentRef.documentID];
						if (document) {
							return document;
						}
					}
				}
			};
			var technopediaStates = [
				'URL',
				'Ignore',
				'Missing',
				'Blank'
			];
			var getTechnopediaStateFromDoc = function (document) {
				if (!document || !document.referenceType) {
					return 3;
				}
				switch (document.referenceType) {
				case 'skipped':
					return 1;
				case 'missing':
					return 2;
				default:
					return 0;
				}
			};
			// transform data
			var output = [];
			for (var i = 0; i < services.length; i++) {
				var service = services[i];
				var serviceResources = service.serviceHasResources;
				for (var j = 0; j < serviceResources.length; j++) {
					var serviceResourceId = serviceResources[j].resourceID;
					var serviceResource = fsIndex.index.resources[serviceResourceId];
					var technopediaDoc = getTechnopediaDocument(serviceResource);
					output.push({
						id: service.ID,
						name: service.fullName,
						resourceId: serviceResourceId,
						resourceName: serviceResource.fullName,
						resourceType: resourceTypes[serviceResource.objectCategoryID],
						state: getTechnopediaStateFromDoc(technopediaDoc),
						stateRef: technopediaDoc ? technopediaDoc.url : '',
						stateTitle: technopediaDoc ? technopediaDoc.name : '',
						count: serviceResource.serviceHasResources ? serviceResource.serviceHasResources.length - 1 : 0 // TODO
					});
				}
			}
			// data & functions for BootstrapTable
			function formatApplication(cell, row) {
				return '<a href="' + that.reportSetup.baseUrl + '/services/' + row.id + '" target="_blank">' + row.name + '</a>';
			}

			function formatResource(cell, row) {
				return '<a href="' + that.reportSetup.baseUrl + '/resources/' + row.resourceId + '" target="_blank">' + row.resourceName + '</a>';
			}
			
			function formatState(cell, row) {
				switch (row.state) {
				case 0:
					return '<a href="' + row.stateRef + '" target="_blank" title="' + row.stateTitle + '">' + technopediaStates[0] + '</a>';
				case 1:
				case 2:
					return '<span title="' + row.stateTitle + '">' + technopediaStates[row.state] + '</span>';
				case 3:
					return technopediaStates[3];
				}
				return '';
			}
			
			ReactDOM.render(
				<BootstrapTable
					data={output}
					striped hover search pagination exportCSV>
					<TableHeaderColumn isKey hidden
						dataField='id'>ID</TableHeaderColumn>
					<TableHeaderColumn dataSort
						dataField='name'
						dataAlign='left'
						dataFormat={formatApplication}
						filter={{
							type: 'TextFilter',
							placeholder: 'Please enter a value'
						}}>Application name</TableHeaderColumn>
					<TableHeaderColumn dataSort
						dataField='resourceName'
						dataAlign='left'
						dataFormat={formatResource}
						filter={{
							type: 'TextFilter',
							placeholder: 'Please enter a value'
						}}>IT Component name</TableHeaderColumn>
					<TableHeaderColumn dataSort
						dataField='resourceType'
						width='180'
						dataAlign='left'
						filter={{
							type: 'SelectFilter',
							placeholder: 'Select a type',
							options: reportUtils.getLookup(resourceTypesArray)
						}}>IT Component type</TableHeaderColumn>
					<TableHeaderColumn dataSort
						dataField='state'
						width='180'
						dataAlign='left'
						dataFormat={formatState}
						filter={{
							type: 'SelectFilter',
							placeholder: 'Select a status',
							options: reportUtils.getLookup(technopediaStates)
						}}>Technopedia status</TableHeaderColumn>
					<TableHeaderColumn dataSort
						dataField='count'
						width='180'
						dataAlign='right'
						filter={{
							type: 'NumberFilter',
							placeholder: ' ',
							delay: 1000
						}}>Count</TableHeaderColumn>
				</BootstrapTable>
			, document.getElementById('app'));
		});
	};

	return ReportTechnopedia;
})();