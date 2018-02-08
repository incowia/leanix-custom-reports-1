import React, { Component } from 'react';
import CommonQueries from './common/CommonGraphQLQueries';
import DataIndex from './common/DataIndex';
import SelectField from './SelectField';
import Utilities from './common/Utilities';

const LOADING_INIT = 0;
const LOADING_SUCCESSFUL = 1;
const LOADING_ERROR = 2;

class Report extends Component {

	constructor(props) {
		super(props);
		this._initReport = this._initReport.bind(this);
		this._handleData = this._handleData.bind(this);
		this._handleError = this._handleError.bind(this);
		this._handleClickViewArea = this._handleClickViewArea.bind(this);
		this._renderSuccessful = this._renderSuccessful.bind(this);
		this._renderViewList = this._renderViewList.bind(this);
		this._renderHeading = this._renderHeading.bind(this);
		this.state = {
			loadingState: LOADING_INIT,
			setup: null,
			data: [],
			showView: 0
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
			index.put(tagGroups);
			lx.executeGraphQL(this._createQuery()).then((data) => {
				index.put(data);
				this._handleData(index);
				console.log(index);
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

	_createQuery() {
		return `{userGroups: allFactSheets(
					sort: { mode: BY_FIELD, key: "displayName", order: asc },
					filter: {facetFilters: [
						{facetKey: "FactSheetTypes", keys: ["UserGroup"]},
						{facetKey: "hierarchyLevel", keys: ["1"]}
					]}
				) {
					edges { node { id displayName } }
				}}`;
	}

	_handleError(err) {
		console.error(err);
		this.setState({
			loadingState: LOADING_ERROR
		});
		lx.hideSpinner();
	}

	_handleData(index) {
		const tableData = [];
		tableData.push(1);
		lx.hideSpinner();
		this.setState({
			loadingState: LOADING_SUCCESSFUL,
			data: tableData
		});
	}

	_handleClickViewArea(evt) {
		this.setState(
			{showView: parseInt(evt.target.name, 10)}
		)
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
						<SelectField useSmallerFontSize id='market' label='Market' options={''} />
					</div>
					<div className='col-lg-10'>
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
							//TODO View
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
					<p>Choose a view down below by clicking on it. The chosen one can be exorted directly.</p>
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
				return (<h3>Platform transformation view for Market #1</h3>);
			case 1:
				return (<h3>CSM adoption view for Market x</h3>);
			case 2:
				return (<h3>Simplification & Obsolescence view for Market x</h3>);
			case 3:
				return (<h3>Narrative view for Market #1</h3>);
			case 4:
				return (<h3>Project roadmap view for Market #1</h3>);
			default:
				throw new Error('Unknown showView state: ' + this.state.showView);
		}
	}
}

export default Report;
