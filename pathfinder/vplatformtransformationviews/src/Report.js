import React, { Component } from 'react';
import CommonQueries from './common/CommonGraphQLQueries';
import DataIndex from './common/DataIndex';
import SelectField from './SelectField';
import TemplateView from './TemplateView';
import Utilities from './common/Utilities';
import NarrativeView from './NarrativeView';
import Roadmap from './Roadmap';
import BlockColorDefinition from './BlockColorDefinition';

const LOADING_INIT = 0;
const LOADING_SUCCESSFUL = 1;
const LOADING_ERROR = 2;

const BC_BUSINESSMANAGEMENT = 'Business Management';
const BC_INTEGRATIONLAYER = 'Integration Layers';
const BC_ENTERPRISEOVERLAY = 'Enterprise Overlay Layer';

const CATEGORIES_ROADMAP = { // category names and their colors defined here
	prj0: { barColor: "#dff0d8", textColor: '#000' },
	prj1: { barColor: "#d9edf7", textColor: '#000' }
};
const MOCKED_DATA_ROADMAP = [
	{
        measure: "Channels",
        data: [
            ['prj1', "2017-01-01", "2019-04-01", 'One Sales Foundation', 10]
		]
	},
	{
        data: [
            ['prj1', "2017-01-01", "2018-04-01", 'One Login']
		]
	},
	{
        data: [
            ['prj1', "2017-01-01", "2018-04-01", 'One Customer Document Mgmt', 1]
		]
	},
	{
        measure: "Enterprise Overlay",
        data: [
            ['prj1', "2016-01-01", "2020-04-01", 'Digital Enterprise']
		]
	},
	{
        measure: "Contact Centre Operations",
        data: []
	},
	{
        measure: "Retail Ops & Logistics",
        data: []
	},
	{
        measure: "CRM, Billing and COM",
        data: [
            ['prj0', "2017-01-01", "2018-07-01", 'Ramp-Up and RFP'],
            ['prj1', "2018-07-01", "2022-04-01", 'Solstice', 50]
		]
	},
];

const CATEGORIES_ROADMAP_DEV = { // category names and their colors defined here
	bgPrimary: { barColor: "#377ab7", textColor: '#fff' },
	bgSuccess: { barColor: "#dff0d8", textColor: '#000' },
	bgInfo: { barColor: "#d9edf7", textColor: '#000' },
	bgWarning: { barColor: "#fcf8e3", textColor: '#000' },
	bgDanger: { barColor: "#f2dede", textColor: '#000' }
};
const MOCKED_DATA_ROADMAP_DEV = [
	{
        measure: "Category 0 www sakjdfsd sdfjsdiof sdfjsdwww www ",
        data: [
			// Category, FromDate, ToDate, Label, Info, Load
            ['bgPrimary', "2015-01-31", "2015-05-15", 'Label 1', 17, {a: 'abc', b: 'def', c: 'asidjsad ijadad', d: 15, e : new Date()}],
            ['bgSuccess', "2015-06-30", "2015-08-15", 'Label 2', 999],
            ['bgPrimary', "2015-09-30", "2015-10-15", 'Label 3'],
            ['bgPrimary', "2015-12-31", "2016-01-12"],
            ['bgPrimary', "2016-01-17", "2016-02-22", 'L4', 26214,
				{a: 'sfsdf sdfjsd', b: 'sfsdpf sfjsd djfsd', c: 12345, d: 15.6464, e: 1000*60*60*24, g: null, h:'saksdofksd sdfjksdpof jfpsdf sdjfposdfjs sdsdfkosd sdjfdf fjfdof'}
			],
            ['bgSuccess', "2016-03-31", "2016-04-15"],
            ['bgSuccess', "2016-06-30", "2016-07-15"],
            ['bgInfo', "2016-09-15", "2016-10-25"],
            ['bgWarning', "2016-12-31", "2017-01-15"],
            ['bgDanger', "2017-03-31", "2017-04-15", 'dkdkod fkdsfk'],
            ['bgSuccess', "2017-06-30", "2017-07-15", 'sadksakd sdjmsdfj'],
            ['bgDanger', "2017-09-30", "2017-10-15"],
            ['bgInfo', "2017-12-31", "2018-01-15"],
            ['bgDanger', "2018-03-31", "2018-04-15", 'asdsdjf sksdfko'],
            ['bgWarning', "2018-06-30", "2018-07-15"],
            ['bgSuccess', "2018-09-30", "2018-10-15"],
            ['bgInfo', "2018-10-16", "2019-05-15", 'djksajds sfjsdio sdfjsd']
        ]
    },
	{
        measure: 'ABS',
        data: [
            ['bgSuccess', "2015-12-01", "2016-02-15", 'Test', 55],
            ['bgInfo', "2016-02-28", "2016-04-15"],
            ['bgDanger', "2016-06-30", "2016-07-15", null, 222],
            ['bgSuccess', "2016-09-15", "2016-10-25"],
            ['bgDanger', "2016-12-01", "2017-03-17", 'xxx xx', 34],
            ['bgInfo', "2017-03-31", "2017-04-15", '', 1],
            ['bgDanger', "2017-06-30", "2017-07-15"],
            ['bgWarning', "2017-09-30", "2017-10-15"]
        ]
    },
	{
        measure: null,
        data: [
            ['bgSuccess', "2015-01-01", "2016-02-12", 'LABEL XXX', 15],
            ['bgInfo', "2016-02-13", "2016-05-15", 'abcdefg', 7],
            ['bgDanger', "2017-03-31", "2017-04-15", '', 34],
            ['bgDanger', "2017-06-30", "2017-07-15", '', 142],
            ['bgWarning', "2017-09-30", "2017-10-15", null, 76]
        ]
    },
	{
        data: [
            ['bgWarning', "2012-09-30", "2022-10-15", 'Under- and Overflow', 7777]
        ]
    },
	{
        measure: "Category 1",
        data: [
            ['bgWarning', "2015-01-01", "2015-06-01", 'Ansh dhdh jj', 177],
            ['bgPrimary', "2016-01-01", "2016-03-15", 'aksk akak'],
            ['bgDanger', "2017-01-01", "2017-10-10", 'jkddiuiwe dijdi', 1025],
            ['bgPrimary', "2018-01-01", "2018-02-20", 'AA']
        ]
    }
];

const MOCKED_DATA_NARRATIVE = [
    {
        platform: 'Channels',
        plans: [
			'First release of My Vodafone Transformation launched, supported by the new CSM compliant Micro Services architecture',
			'Plan to transition My Vodafone developments to TSSC by FY 18/19',
			'Started transformation to deliver new solutions for corporate site, eCare & eShop and decommission legacy based on Oracle CMS & ATG',
			'New applications will be cloud ready and will be hosted on Converged Infrastructure in Dublin'
		]
    },
    {
        platform: "Contact-Centre Operations",
        plans: [
			"Target systems in place based Genesis contact centre and Siebel CTI",
			"No transformations in the pipeline, only incremental enhancements"
		]
    },
    {
        platform: "Retail Ops & Logistics",
        plans: [
			"Retail operations and logistics are handled by a customised local solution and plan is still not clear for the future evolution",
			"Siebel Partners portal is used in retail stores for customer information, service provisioning, TT etc",
			"Rollout of a new etupup solution within partners portal",
			"Ongoing VOdafone of Retail program to deliver new capabilities as per roadmap"
		]
    },
    {
        platform: "CRM, Billing & COM",
        plans: [
			"Target platform in place based on Oracle stack - Siebel/AIA Fusiion Middlewar/BRM.",
			"Siebel will be enhanced through implementation of the Open UI",
			"Improve CRM resilience through splitting infrastructure in two different building in Dublin DC",
			"Both Soebel and BRM are part of the IT resilience prgram to improve the solution's resilience"
		]
    }
];
const MOCKED_DATA_NARRATIVE_DEV = [
    {
        platform: '   ',
        plans: ['xxx', 'yyy', 'zzz']
    },
    {
        platform: "0 No List items",
        plans: ["", "   "]
    },
    {
        platform: "1 Democritum Conclusionemque",
        plans: [
            "1 Lorem ipsum dolor sit amet, at sit dicta zril. ... corrumpit te!",
            "",
            "2 Id eam debitis explicari? Eius voluptatibus at  ... per cibo urbanitas?",
            "3 Id duo nobis possim hendrerit? Iusto verterem cu vim, ridens ... quis ipsum cotidieque te pro?"
        ]
    },
    {
        platform: "2 Omnes volutpat ex mel",
        plans: [
            "Ea atqui fastidii scribentur vis, homero conclusionemque sea an. Cum ad  ... eum. Expetenda percipitur ex nam.",
            "Vix cu iudico pertinax persecuti, an ius simul accusamus. Id movet  ... populo concludaturque.",
            "Sit ad soleat doctus. No esse fabulas argumentum ius, vocent antiopam  ... veniam audiam eu."
        ]
    },
    {
        platform: "3 Usu mundi viderer ne",
        plans: [
            "Id duo erat sadipscing, vero iudicabit his no, sed ad  ... appetere recusabo vis?"
        ]
    },
    {
        platform: "4 Empty list: Per ea errem democritum conclusionemque",
        plans: []
    },
    {
        platform: "5 Tale consul numquam mei cu",
        plans: [
            "Tale consul numquam mei cu, in enim exerci graece vim, nam ad  ... diceret indoctum recteque.",
            "Ut nam voluptua electram? Ut vel vidisse verterem omittantur? Eum cibo  ... odio option vim.",
            "Per ea errem democritum conclusionemque, ex eos possim audire iuvaret. Discere officiis philosophia  ... mel augue posidonium."
        ]
    }
];

const viewOneLegend = [
	// also valid for view 2
	// can be made a static constant
	{
		color: 'green',

		text: 'Target Platform already in place'
	}, {
		color: 'yellow',
		text: 'Plan to Adopt platform from another market'
	}, {
		color: 'orange',
		text: 'Step-wise evolution to target'
	}, {
		color: 'red',
		text: 'Plan to build new target capability'
	}, {
		color: 'gray',
		text: 'Plan to wrap existing legacy'
	}, {
		color: 'white',
		text: 'Plan to remove capability'
	}, {
		color: 'blue',
		text: 'Plan is not clear'
	}, {
		color: 'pink',
		text: 'No information available'
	}
];
const viewOneColorScheme = {}; // will be specified later
const viewOneAdditionalContent = undefined; // not relevant for view 1

class Report extends Component {

	constructor(props) {
		super(props);
		this._initReport = this._initReport.bind(this);
		this._getFilteredBCs = this._getFilteredBCs.bind(this);
		this._handleData = this._handleData.bind(this);
		this._handleError = this._handleError.bind(this);
		this._handleClickViewArea = this._handleClickViewArea.bind(this);
		this._handleViewSelect = this._handleViewSelect.bind(this);
		this._renderSuccessful = this._renderSuccessful.bind(this);
		this._renderViewList = this._renderViewList.bind(this);
		this._renderHeading = this._renderHeading.bind(this);
		this._renderViewArea = this._renderViewArea.bind(this);
		this.state = {
			loadingState: LOADING_INIT,
			setup: null,
			data: [],
			showView: 0,
			selectedMarket: null

		};
	}

	componentDidMount() {
		lx.init().then(this._initReport).catch(this._handleError);
	}

	_initReport(setup) {
		lx.ready(this._createConfig());
		lx.showSpinner('Loading data...');
		this.setState({
			setup: setup
		});
		// get all tags, then the data
		lx.executeGraphQL(CommonQueries.tagGroups).then((tagGroups) => {
			const index = new DataIndex();
			this.index = index;
			index.put(tagGroups);
			const platformId = index.getFirstTagID('BC Type', 'Platform');
			lx.executeGraphQL(this._createQuery(platformId)).then((data) => {
				index.put(data);
				this._handleData(index, platformId);
			}).catch(this._handleError);
		}).catch(this._handleError);
	}

	_createConfig() {
		return {
			allowEditing: false,
			export: {
				autoScale: true,
				exportElementSelector: '#export',
				format: 'a1',
				inputType: 'HTML',
				orientation: 'landscape'
			},
		};
	}

	_createQuery(platformId) {
		let platformIdFilter = ''; // initial assume tagGroup.name changed or the id couldn't be determined otherwise
		let platformTagNameDef = 'tags { name }'; // initial assume to get it
		if (platformId) {
			platformIdFilter = `, {facetKey: "BC Type", keys: ["${platformId}"]}`;
			platformTagNameDef = '';
		}
		return `{userGroups: allFactSheets(
					sort: { mode: BY_FIELD, key: "displayName", order: asc },
					filter: {facetFilters: [
						{facetKey: "FactSheetTypes", keys: ["UserGroup"]},
						{facetKey: "hierarchyLevel", keys: ["1"]}
					]}
				) {
					edges { node {
						id name tags { name }
						... on UserGroup {
							relToRequires { edges { node { description factSheet { id } } } }
						}
					}}
				}
				businessCapabilitiesLvl2: allFactSheets(
					sort: { mode: BY_FIELD, key: "displayName", order: asc },
					filter: {facetFilters: [
						{facetKey: "FactSheetTypes", keys: ["BusinessCapability"]},
						{facetKey: "hierarchyLevel", keys: ["1"]}
						${platformIdFilter}
					]}
				) {
					edges{node{
						id name ${platformTagNameDef}
						...on BusinessCapability { relToChild{edges{node{factSheet{id displayName type tags {name} } } } } }
					}}
				}
				businessCapabilitiesLv2: allFactSheets(
					filter: {facetFilters: [
						{facetKey: "FactSheetTypes" , keys: ["BusinessCapability"]},
						{facetKey: "hierarchyLevel", keys: ["2"]}, 
						${platformIdFilter}
					]}
				) {
					edges {node{id
						... on BusinessCapability { relPlatformToApplication {edges {node {factSheet{id} } } } }
					}}
				}
				applications: allFactSheets(
					filter: {facetFilters: [
						{facetKey: "FactSheetTypes", keys: ["Application"]}
					]}
				) {
					edges {node {id
						...on Application {
							lifecycle {phases}
							relApplicationToPlatform {edges {node{factSheet{id}}}}}						
						}
					
					}
				}
				}`;
	}

	_handleError(err) {
		console.error(err);
		this.setState({
			loadingState: LOADING_ERROR
		});
		lx.hideSpinner();
	}

	_handleData(index, platformId) {
		const selectFieldData = this._getMarkets(index.userGroups.nodes);
		this.setState({data: this._getFilteredBCs(index.businessCapabilitiesLvl2.nodes, platformId, 'Platform')});
		const sideAreaData = this._handleDataSideArea(this.state.data);
		const mainAreaData = this._handleDataMainArea(this.state.data);
		const mainIntermediateAreaData = this._handleDataMainIntermediateArea(this.state.data);
		lx.hideSpinner();
		this.setState({
			loadingState: LOADING_SUCCESSFUL,
			selectFieldData: selectFieldData,
			// access 'userGroups'
			selectedMarket: index.byID[selectFieldData[0].value],
			sideArea: sideAreaData,
			mainArea: mainAreaData,
			mainIntermediateArea: mainIntermediateAreaData
		});
	}

	_handleDataSideArea (bcs) {
		const sideAreaData= {};
		const items = [];
		bcs.map((bcselement) =>
			{
				if(bcselement.name === BC_BUSINESSMANAGEMENT) {
					sideAreaData.id = bcselement.id;
					sideAreaData.name = bcselement.name;
					if(bcselement.relToChild != null) {
						bcselement.relToChild.nodes.forEach((e) => {
							items.push({
								id: e.id,
								name: e.displayName
							});
						})
						sideAreaData.items = items;
					}
				}
			}
		);
		return sideAreaData;
	}

	_handleDataMainArea (bcs) {
		const mainAreaData= [];
		bcs.map((bcselement) =>
			{
				if(bcselement.name != BC_BUSINESSMANAGEMENT && bcselement.name != BC_INTEGRATIONLAYER && bcselement.name != BC_ENTERPRISEOVERLAY) {
					const bc = {};
					const items = [];
					bc.id = bcselement.id;
					bc.name = bcselement.name;
					if(bcselement.relToChild != null) {
						bcselement.relToChild.nodes.forEach((e) => {
							items.push({
								id: e.id,
								name: e.displayName
							});
							bc.items = items;
						})
						mainAreaData.push(bc);
					}
				}
			}
		);
		return mainAreaData;
	}

	_handleDataMainIntermediateArea(bcs) {
		const mainIntermediaAreaData= {};
		let child = [];
		bcs.map((bcselement) =>
			{
				if(bcselement.name === BC_INTEGRATIONLAYER) {
					child = bcselement.relToChild.nodes[0];
					mainIntermediaAreaData.id = child.id;
					mainIntermediaAreaData.name = child.displayName;
					return mainIntermediaAreaData;
				}
			}
		);
		return mainIntermediaAreaData;
	}

	_getFilteredBCs(nodes, tagId, tagName) {
		if (!tagId) {
			return nodes.filter((e) => {
				return this.index.includesTag(e, tagName);
			});
		}
		return nodes;
	}

	_getMarkets(nodes) {
		return nodes.map((e) => {
			return {
				value: e.id,
				label: e.name
			}
		});
	}

	_handleClickViewArea(evt) {
		const showView = parseInt(evt.target.name, 10);
		if (this.state.showView === showView) {
			return;
		}
		this.setState(
			{showView: showView}
		)
	};

	_handleViewSelect(option) {
		const marketID = option.value;
		if (this.state.selectedMarket.id === marketID) {
			return;
		}
		// access 'userGroups'
		const market = this.index.byID[marketID];
		this.setState({selectedMarket: market});
	};

	render() {
		switch (this.state.loadingState) {
			case LOADING_INIT:
				return this._renderProcessingStep('Loading data...');
			case LOADING_SUCCESSFUL:
				if (this.state.data.length === 0) {
					return this._renderProcessingStep('There is no fitting data.');
				}
				return this._renderSuccessful();
			case LOADING_ERROR:
				return this._renderError();
			default:
				throw new Error('Unknown loading state: ' + this.state.loadingState);
		}
	}

	_renderProcessingStep(stepInfo) {
		return (<h4 className='text-center'>{stepInfo}</h4>);
	}

	_renderError() {
		return null;
	}

	_renderSuccessful() {
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-lg-2'>
						<SelectField useSmallerFontSize
						 id='market'
						 label='Market'
						 options={this.state.selectFieldData}
						 value={this.state.selectedMarket.id}
						 onChange={this._handleViewSelect}/>
					</div>
					<div className='col-lg-10'>
						<br/>
						<p>Choose a market for which one you want to see more details.</p>
					</div>
				</div>
				<div className='row'>
					<div className='col-lg-2'>
						{this._renderViewList()}
					</div>
					<div className='col-lg-10'>
						{this._renderHeading()}
						<div id='export'>
							{this._renderViewArea()}
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderViewList() {
		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>Views</div>
				<div className='panel-body'>
					<p>Choose a view down below by clicking on it. The chosen one can be exported directly.</p>
				</div>
				<div className='list-group'>
					<button type='button' name='0' className='list-group-item' onClick={this._handleClickViewArea}>Platform transformation</button>
					<button type='button' name='1' className='list-group-item' onClick={this._handleClickViewArea}>CSM adoption</button>
					<button type='button' name='2' className='list-group-item' onClick={this._handleClickViewArea}>Simplification & Obsolescence</button>
					<button type='button' name='3' className='list-group-item' onClick={this._handleClickViewArea}>Narrative</button>
					<button type='button' name='4' className='list-group-item' onClick={this._handleClickViewArea}>Project Roadmap</button>
				</div>
			</div>
		);
	}

	_renderHeading() {
		switch (this.state.showView) {
			case 0:
				return (<h2>Platform transformation view for Market {this.state.selectedMarket.name}</h2>);
			case 1:
				return (<h2>CSM adoption view for Market {this.state.selectedMarket.name}</h2>);
			case 2:
				return (<h2>Simplification & Obsolescence view for Market {this.state.selectedMarket.name}</h2>);
			case 3:
				return (<h2>Narrative view for Market {this.state.selectedMarket.name}</h2>);
			case 4:
				return (<h2>Project roadmap view for Market {this.state.selectedMarket.name}</h2>);
			default:
				throw new Error('Unknown showView state: ' + this.state.showView);
		}
	}

	_renderViewArea() {
		switch (this.state.showView) {
			case 0:
				return <TemplateView
					sideArea={this.state.sideArea}
					mainArea={this.state.mainArea}
					mainIntermediateArea={this.state.mainIntermediateArea}
					legend={viewOneLegend}
					colorScheme={viewOneColorScheme}
					additionalContent={viewOneAdditionalContent} />;
			case 1:
				return <TemplateView/>;
			case 2:
				return <TemplateView/>;
			case 3:
				return <NarrativeView data={MOCKED_DATA_NARRATIVE}/>;
			case 4:
				const chartConfig = {
					timeSpan: ['2016-01-01', '2019-01-01'],
					gridlinesXaxis: true,
					gridlinesYaxis: true,
					infoLabel: 'CSM',
					bar: { height: 24, border: false },
					labelYwidth: 260
				};
				return (
					<Roadmap
						data={MOCKED_DATA_ROADMAP}
						categories={CATEGORIES_ROADMAP}
						config={chartConfig}
					/>);
			default:
				throw new Error('Unknown showView state: ' + this.state.showView);
		}
	}
}

export default Report;
