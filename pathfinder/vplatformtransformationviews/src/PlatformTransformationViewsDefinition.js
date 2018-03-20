import Utilities from './common/Utilities';

// dates for the logic below
const CURRENT_DATE = new Date();
CURRENT_DATE.setHours(0, 0, 0, 0);
const CURRENT_DATE_TIME = CURRENT_DATE.getTime();

function _formatDateNumber(n) {
	return n < 10 ? '0' + n : n;
}
const CURRENT_DATE_STRING = CURRENT_DATE.getFullYear() + '-' + _formatDateNumber(CURRENT_DATE.getMonth() + 1) + '-' + _formatDateNumber(CURRENT_DATE.getDate());

// color definitions
const GREEN = {
	name: 'green',
	cssColor: 'lightgreen'
};
const YELLOW = {
	name: 'yellow',
	cssColor: 'yellow'
};
const ORANGE = {
	name: 'orange',
	cssColor: 'orange'
};
const RED = {
	name: 'red',
	cssColor: '#FF5656'
};
const GRAY = {
	name: 'gray',
	cssColor: 'silver'
};
const GREY = {
	name: 'grey',
	cssColor: GRAY.cssColor
};
const WHITE = {
	name: 'white',
	cssColor: 'white'
};
const BLUE = {
	name: 'blue',
	cssColor: 'deepskyblue'
};
const PINK = {
	name: 'pink',
	cssColor: 'pink'
};
const COLOR_MAP = {};
COLOR_MAP[GREEN.name] = GREEN.cssColor;
COLOR_MAP[YELLOW.name] = YELLOW.cssColor;
COLOR_MAP[ORANGE.name] = ORANGE.cssColor;
COLOR_MAP[RED.name] = RED.cssColor;
COLOR_MAP[GRAY.name] = GRAY.cssColor;
COLOR_MAP[GREY.name] = GREY.cssColor;
COLOR_MAP[WHITE.name] = WHITE.cssColor;
COLOR_MAP[BLUE.name] = BLUE.cssColor;
COLOR_MAP[PINK.name] = PINK.cssColor;

const FALLBACK_COLOR = WHITE.cssColor;

const VALID_COLORS = Object.keys(COLOR_MAP).join('|');

// legend definitions
const LEGEND_PLATFORM_TRANFORMATION_VIEW = [{
		color: GREEN.cssColor,
		text: 'Target platform already in place'
	}, {
		color: YELLOW.cssColor,
		text: 'Plan to adopt platform from another market'
	}, {
		color: ORANGE.cssColor,
		text: 'Step-wise evolution to target'
	}, {
		color: RED.cssColor,
		text: 'Plan to build new target capability'
	}, {
		color: GRAY.cssColor,
		text: 'Plan to wrap existing legacy'
	}, {
		color: WHITE.cssColor,
		text: 'Not specific to the view'
	}, {
		color: BLUE.cssColor,
		text: 'Plan is not clear'
	}, {
		color: PINK.cssColor,
		text: 'No information available / not supported by IT'
	}
];
const LEGEND_CSM_ADOPTION_VIEW_ADDITIONAL = {
	current: {
		cssClass: 'label label-default',
		text: 'Current # of CSM APIs provided'
	},
	planned: {
		cssClass: 'label label-danger',
		text: 'Planned # of CSM APIs being implemented'
	},
	target: {
		cssClass: 'label label-primary',
		text: 'Target # of CSM APIs to be achieved'
	}
};
const LEGEND_CSM_ADOPTION_VIEW = LEGEND_PLATFORM_TRANFORMATION_VIEW;
const LEGEND_SIMPLIFICATION_OBSOLESCENCE_VIEW = [{
		color: GREEN.cssColor,
		text: 'There is a <=25% gap between the current and target # of applications'
	}, {
		color: YELLOW.cssColor,
		text: 'There is a >25% to <50% gap between the current and target # of applications'
	}, {
		color: RED.cssColor,
		text: 'There is a >50% gap between the current and target # of applications'
	}
];

// key definitions
const KEY_PLATFORM = 'platform';
const KEY_CSMADO = 'csmado';

const VALID_KEYS = [KEY_PLATFORM, KEY_CSMADO];

// stack definitions
const STACK_COMMON = 'common';
const STACK_CONSUMER = 'consumer';
const STACK_ENTERPRISE = 'enterprise';
const STACK_MOBILE = 'mobile';
const STACK_FIXED = 'fixed';

const VALID_STACKS = [STACK_COMMON, STACK_CONSUMER, STACK_ENTERPRISE, STACK_MOBILE, STACK_FIXED];
const VALID_STACKS_FOR_REGEXP = VALID_STACKS.join('|');

// regexp's for later use
const COLOR_BLOCKS_REGEXP = new RegExp('(' + VALID_KEYS.join('|') + ')(?:\\s*\\:\\s*(' + VALID_STACKS_FOR_REGEXP + '))?\\s*\\((?:\\s*([1-9]|[1-9]\\d*)\\s*,)?\\s*((?:' + VALID_COLORS + ')(?:\\s*,\\s*(?:' + VALID_COLORS + '))*)\\s*\\)', 'gi');

const CSM_ADOPTION_TARGET_REGEXP = new RegExp('csmadoption\\s*target\\s*(' + VALID_STACKS_FOR_REGEXP + ')?\\s*(\\d+)', 'gi');

const NARRATIVE_REGEXP = new RegExp('narrative\\s*:\\s*((?:\\*\\s*.*\\s*)*)*', 'gi');

const PRIMARY_REGEXP = new RegExp('primary', 'i');

// template view names
const VIEW_PLATFORM_TRANSFORMATION = 'Platform Transformation';
const VIEW_CSM_ADOPTION = 'CSM Adoption';
const VIEW_SIMPLIFICATION_OBSOLESCENCE = 'Simplification & Obsolescence';
const VIEW_NARRATIVE = 'Narrative';
const VIEW_PROJECT_ROADMAP = 'Project Roadmap';

function _prepareBlockColors(result, market) {
	const resultForBlockColors = {
		name: market.name
	};
	result.blockColors[market.id] = resultForBlockColors;
	// add keys
	VALID_KEYS.forEach((key) => {
		resultForBlockColors[key] = {};
	});
	// add stacks
	VALID_STACKS.forEach((stack) => {
		for (let key in resultForBlockColors) {
			if (key === 'name') {
				continue;
			}
			resultForBlockColors[key][stack] = {};
		}
	});
	return resultForBlockColors;
}

function _prepareCSMAdoTarget(result, market) {
	const resultForCSMAdoTarget = {
		name: market.name
	};
	result.csmAdoTargets[market.id] = resultForCSMAdoTarget;
	// add stacks
	VALID_STACKS.forEach((stack) => {
		resultForCSMAdoTarget[stack] = {};
	});
	return resultForCSMAdoTarget;
}

function _prepareNarrative(result, market) {
	const resultForNarrative = {
		name: market.name,
		list: []
	};
	result.narratives[market.id] = resultForNarrative;
	return resultForNarrative;
}

function parseDescriptions(markets, platforms) {
	if (!markets || !platforms) {
		return;
	}
	const result = {
		blockColors: {},
		csmAdoTargets: {},
		narratives: {}
	};
	markets.forEach((market) => {
		const resultForCSMAdoTarget = _prepareCSMAdoTarget(result, market);
		const resultForBlockColors = _prepareBlockColors(result, market);
		const resultForNarrative = _prepareNarrative(result, market);
		const subIndex = market.relToRequires;
		if (!subIndex) {
			return;
		}
		subIndex.nodes.forEach((rel) => {
			const platform = platforms[rel.id];
			if (!platform) {
				// not a relation to a platform
				return;
			}
			// parse content
			const text = rel.relationAttr.description;
			const csmAdoTargets = _getCSMAdoptionTargets(text);
			const colors = _getColors(text);
			const narratives = _getNarratives(text);
			// handle CSM Adoption target values
			for (let key in csmAdoTargets) {
				const stack = resultForCSMAdoTarget[key];
				stack[platform.id] = csmAdoTargets[key];
			}
			// handle color blocks
			for (let key in colors) {
				const view = resultForBlockColors[key];
				for (let key2 in colors[key]) {
					let stack = view[key2][platform.id];
					if (!stack) {
						stack = [];
						view[key2][platform.id] = stack;
					}
					view[key2][platform.id] = stack.concat(colors[key][key2]);
				}
			}
			// handle narratives
			if (narratives.length > 0) {
				resultForNarrative.list.push({
					id: platform.id,
					name: platform.name,
					plans: narratives
				});
			}
		});
		// sort narratives by name
		resultForNarrative.list.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	});
	// transform color mapping to ColorScheme objects
	for (let key in result.blockColors) {
		const views = result.blockColors[key];
		for (let key2 in views) {
			if (key2 === 'name') {
				continue;
			}
			const view = views[key2];
			for (let key3 in view) {
				view[key3] = new ColorScheme(view[key3]);
			}
		}
	}
	return result;
}

function _getColors(text) {
	if (!text) {
		return {};
	}
	const result = {};
	let tmpArray;
	while ((tmpArray = COLOR_BLOCKS_REGEXP.exec(text)) !== null) {
		const view = tmpArray[1].toLowerCase();
		const stack = tmpArray[2] !== undefined ? tmpArray[2].toLowerCase() : STACK_COMMON;
		const position = tmpArray[3] !== undefined ? parseInt(tmpArray[3], 10) - 1 : 0;
		let colors = tmpArray[4];
		if (!view || !colors) {
			continue;
		}
		let tmp = result[view];
		if (!tmp) {
			tmp = {};
			result[view] = tmp;
		}
		let tmp2 = tmp[stack];
		if (!tmp2) {
			tmp2 = [];
			tmp[stack] = tmp2;
		}
		tmp2[position] = _buildCSSBackground(colors);
	}
	// reset regexp
	COLOR_BLOCKS_REGEXP.lastIndex = 0;
	return result;
}

function _buildCSSBackground(colors) {
	if (colors.includes(',')) {
		// multiple colors, use linear-gradient
		const colorArray = colors.split(',');
		colors = colorArray.map((e) => {
			return COLOR_MAP[e.toLowerCase().trim()];
		}).join(',');
		return 'linear-gradient(to right, ' + colors + ')'
	}
	// only one, use it directly
	return COLOR_MAP[colors.trim()];
}

function _getCSMAdoptionTargets(text) {
	if (!text) {
		return {};
	}
	const result = {};
	let tmpArray;
	while ((tmpArray = CSM_ADOPTION_TARGET_REGEXP.exec(text)) !== null) {
		const stack = tmpArray[1] !== undefined ? tmpArray[1].toLowerCase() : STACK_COMMON;
		const targetValue = tmpArray[2] !== undefined ? parseInt(tmpArray[2], 10) : 0;
		if (targetValue === undefined || targetValue === null) {
			continue;
		}
		result[stack] = targetValue;
	}
	// reset regexp
	CSM_ADOPTION_TARGET_REGEXP.lastIndex = 0;
	return result;
}

function _getNarratives(text) {
	if (!text) {
		return [];
	}
	let result = [];
	let tmpArray;
	while ((tmpArray = NARRATIVE_REGEXP.exec(text)) !== null) {
		const narlist = tmpArray[1];
		if (!narlist) {
			continue;
		}
		result = result.concat(narlist.split('*').map((e) => {
			return e.trim();
		}).filter((e) => {
			return e !== undefined && e !== null && e.length > 0;
		}));
	}
	// reset regexp
	NARRATIVE_REGEXP.lastIndex = 0;
	return result;
}

function getMarketViews(index, market) {
	if (!index || !market) {
		return;
	}
	const addConsumerEnterpriseStacks = _isConsumerEnterpriseStack(index, market);
	const addMobileFixedStacks = _isMobileFixedStack(index, market);
	const stacks = [];
	stacks.push(VIEW_PLATFORM_TRANSFORMATION + ' (' + STACK_COMMON + ')');
	if (addConsumerEnterpriseStacks) {
		stacks.push(VIEW_PLATFORM_TRANSFORMATION + ' (' + STACK_CONSUMER + ')');
		stacks.push(VIEW_PLATFORM_TRANSFORMATION + ' (' + STACK_ENTERPRISE + ')');
	}
	if (addMobileFixedStacks) {
		stacks.push(VIEW_PLATFORM_TRANSFORMATION + ' (' + STACK_MOBILE + ')');
		stacks.push(VIEW_PLATFORM_TRANSFORMATION + ' (' + STACK_FIXED + ')');
	}
	stacks.push(VIEW_CSM_ADOPTION + ' (' + STACK_COMMON + ')');
	if (addConsumerEnterpriseStacks) {
		stacks.push(VIEW_CSM_ADOPTION + ' (' + STACK_CONSUMER + ')');
		stacks.push(VIEW_CSM_ADOPTION + ' (' + STACK_ENTERPRISE + ')');
	}
	if (addMobileFixedStacks) {
		stacks.push(VIEW_CSM_ADOPTION + ' (' + STACK_MOBILE + ')');
		stacks.push(VIEW_CSM_ADOPTION + ' (' + STACK_FIXED + ')');
	}
	stacks.push(VIEW_SIMPLIFICATION_OBSOLESCENCE + ' (' + STACK_COMMON + ')');
	if (addConsumerEnterpriseStacks) {
		stacks.push(VIEW_SIMPLIFICATION_OBSOLESCENCE + ' (' + STACK_CONSUMER + ')');
		stacks.push(VIEW_SIMPLIFICATION_OBSOLESCENCE + ' (' + STACK_ENTERPRISE + ')');
	}
	if (addMobileFixedStacks) {
		stacks.push(VIEW_SIMPLIFICATION_OBSOLESCENCE + ' (' + STACK_MOBILE + ')');
		stacks.push(VIEW_SIMPLIFICATION_OBSOLESCENCE + ' (' + STACK_FIXED + ')');
	}
	stacks.push(VIEW_NARRATIVE);
	stacks.push(VIEW_PROJECT_ROADMAP);
	return stacks;
}

function _isConsumerEnterpriseStack(index, market) {
	return index.includesTag(market, 'Consumer & Enterprise');
}

function _isMobileFixedStack(index, market) {
	return index.includesTag(market, 'Mobile & Fixed');
}

function getStackFromView(view) {
	let stack = STACK_COMMON;
	if (view.includes(STACK_CONSUMER)) {
		stack = STACK_CONSUMER;
	} else if (view.includes(STACK_ENTERPRISE)) {
		stack = STACK_ENTERPRISE;
	} else if (view.includes(STACK_MOBILE)) {
		stack = STACK_MOBILE;
	} else if (view.includes(STACK_FIXED)) {
		stack = STACK_FIXED;
	}
	return stack;
}

function isPlatformTransformationView(viewName) {
	if (!viewName) {
		return false;
	}
	return viewName.includes(VIEW_PLATFORM_TRANSFORMATION);
}

function isCSMAdoptionView(viewName) {
	if (!viewName) {
		return false;
	}
	return viewName.includes(VIEW_CSM_ADOPTION);
}

function isSimplificationObsolescenceView(viewName) {
	if (!viewName) {
		return false;
	}
	return viewName.includes(VIEW_SIMPLIFICATION_OBSOLESCENCE);
}

function isNarrativeView(viewName) {
	if (!viewName) {
		return false;
	}
	return viewName.includes(VIEW_NARRATIVE);
}

function isProjectRoadmapView(viewName) {
	if (!viewName) {
		return false;
	}
	return viewName.includes(VIEW_PROJECT_ROADMAP);
}

function getCSMAdoptionValues(index, platform, applications, csmInterfaces, marketData, segmentData, departmentData) {
	if (!platform || !applications || !csmInterfaces || !marketData || !segmentData || !departmentData) {
		return;
	}
	const result = {};
	// prepare result object
	// add markets
	for (let key in marketData) {
		result[key] = {
			name: marketData[key].name
		};
	}
	// add stacks
	for (let key in result) {
		const market = result[key];
		VALID_STACKS.forEach((stack) => {
			market[stack] = {
				current: {},
				planned: {}
			};
		});
	}
	const subIndex = platform.relPlatformToApplication;
	if (!subIndex) {
		return result;
	}
	subIndex.nodes.forEach((rel) => {
		const applicationPlanned = applications.planned[rel.id];
		const applicationActive = applications.active[rel.id];
		if (!applicationPlanned && !applicationActive) {
			return;
		}
		const application = applicationPlanned ? applicationPlanned : applicationActive;
		const market = _getMarket(marketData, departmentData, application);
		if (!market) {
			return;
		}
		const csmApis = _getCSMAPIs(application, csmInterfaces);
		if (!csmApis) {
			return;
		}
		const stacks = _getStacksFromApplication(index, application, market, segmentData);
		const marketResults = result[market.id];
		// application counted for current or planned?
		// planned: active & planned applications, but only CSM APIs which have an activeFrom in future
		_addValuesForCSMAPI(stacks, marketResults, 'planned', csmApis, application, (csmApi) => {
			return csmApi.activeFrom && csmApi.activeFrom > CURRENT_DATE_TIME;
		});
		if (application === applicationActive) {
			// current: only active applications, but only CSM APIs which have no or an activeFrom not in future
			_addValuesForCSMAPI(stacks, marketResults, 'current', csmApis, application, (csmApi) => {
				return !csmApi.activeFrom || csmApi.activeFrom <= CURRENT_DATE_TIME;
			});
		}
	});
	return result;
}

function _getMarket(marketData, departmentData, application) {
	const subIndex = application.relApplicationToOwningUserGroup;
	if (!subIndex) {
		return;
	}
	// only one market possible
	const owningUGID = subIndex.nodes[0].id;
	// could be a department, in this case the market is its parent
	const marketID = departmentData[owningUGID] ? departmentData[owningUGID].market : owningUGID;
	return marketData[marketID];
}

function _getStacksFromApplication(index, application, market, segmentData) {
	// the market has which stacks?
	const isConsumerEnterprise = _isConsumerEnterpriseStack(index, market);
	const isMobileFixed = _isMobileFixedStack(index, market);
	// the application belongs to which stacks?
	let isConsumer = false;
	let isEnterprise = false;
	let consumerIsPrimary = false; // consumer & enterprise are mutually exclusive, but might occur both
	let enterpriseIsPrimary = false;
	let isMobile = false;
	let isFixed = false;
	// check consumer & enterprise, can only be true, if market allows it
	if (isConsumerEnterprise) {
		const subIndex = application.relApplicationToSegment;
		if (subIndex) {
			subIndex.nodes.forEach((rel) => {
				const segment = segmentData[rel.id];
				if (!segment) {
					return;
				}
				if (segment.name === 'Consumer') {
					isConsumer = true;
					consumerIsPrimary = rel.relationAttr.description ? PRIMARY_REGEXP.test(rel.relationAttr.description) : false;
				} else if (segment.name === 'Enterprise') {
					isEnterprise = true;
					enterpriseIsPrimary = rel.relationAttr.description ? PRIMARY_REGEXP.test(rel.relationAttr.description) : false;
				}
				// reset regexp
				PRIMARY_REGEXP.lastIndex = 0;
			});
		}
		// bad data quality, which needs to be handled somehow
		if (isConsumer && isEnterprise) {
			if (consumerIsPrimary && enterpriseIsPrimary) {
				// both with a primary flag
				console.error(application.name + ' has Consumer & Enterprise as CUSTOMER SEGMENT, but both have a "Primary" flag.');
			} else if (!consumerIsPrimary && !enterpriseIsPrimary) {
				// no primary flag
				console.error(application.name + ' has Consumer & Enterprise as CUSTOMER SEGMENT, but no one has a "Primary" flag.');
			}
		}
	}
	// check mobile & fixed, can only be true, if market allows it
	if (isMobileFixed) {
		isMobile = index.includesTag(application, 'Mobile IT');
		isFixed = index.includesTag(application, 'Fixed IT');
	}
	const result = [];
	if (isConsumer) {
		if (isEnterprise) {
			// look if consumer is the primary
			if (consumerIsPrimary) {
				result.push(STACK_CONSUMER);
			}
		} else {
			result.push(STACK_CONSUMER);
		}
	}
	if (isEnterprise) {
		if (isConsumer) {
			// look if enterprise is the primary
			if (enterpriseIsPrimary) {
				result.push(STACK_ENTERPRISE);
			}
		} else {
			result.push(STACK_ENTERPRISE);
		}
	}
	if (isMobile) {
		result.push(STACK_MOBILE);
	}
	if (isFixed) {
		result.push(STACK_FIXED);
	}
	if (result.length === 0) {
		// at least the common stack
		result.push(STACK_COMMON);
	}
	return result;
}

function _getCSMAPIs(application, csmInterfaces) {
	const subIndex = application.relProviderApplicationToInterface;
	if (!subIndex) {
		return [];
	}
	const result = [];
	subIndex.nodes.forEach((rel) => {
		const csmApi = csmInterfaces[rel.id];
		if (!csmApi) {
			return;
		}
		result.push({
			id: csmApi.id,
			name: csmApi.name,
			// timestamp
			activeFrom: rel.relationAttr.activeFrom ? Utilities.parseDateString(rel.relationAttr.activeFrom) : undefined
		});
	});
	return result;
}

function _addValuesForCSMAPI(stacks, marketResults, valueType, csmApis, application, addIf) {
	stacks.forEach((stack) => {
		const values = marketResults[stack][valueType];
		csmApis.forEach((csmApi) => {
			if (!addIf(csmApi)) {
				return;
			}
			let valuesForCSMAPI = values[csmApi.id];
			if (!valuesForCSMAPI) {
				valuesForCSMAPI = {
					name: csmApi.name,
					applications: {}
				};
				values[csmApi.id] = valuesForCSMAPI;
			}
			valuesForCSMAPI.applications[application.id] = application;
		});
	});
}

class ColorScheme {

	constructor(mapping) {
		this._mapping = mapping;
	}

	getColor(id, number) {
		if (!number) {
			number = 0;
		}
		if (!id) {
			return FALLBACK_COLOR;
		}
		const platform = this._mapping[id];
		if (!platform) {
			return FALLBACK_COLOR;
		}
		const color = platform[number];
		return !color ? FALLBACK_COLOR : color;
	}
}

export default {
	CURRENT_DATE_STRING: CURRENT_DATE_STRING,
	LEGEND_PLATFORM_TRANFORMATION: LEGEND_PLATFORM_TRANFORMATION_VIEW,
	LEGEND_CSM_ADOPTION: LEGEND_CSM_ADOPTION_VIEW,
	LEGEND_CSM_ADOPTION_VIEW_ADDITIONAL: LEGEND_CSM_ADOPTION_VIEW_ADDITIONAL,
	LEGEND_SIMPLIFICATION_OBSOLESCENCE: LEGEND_SIMPLIFICATION_OBSOLESCENCE_VIEW,
	parseDescriptions: parseDescriptions,
	getMarketViews: getMarketViews,
	getStackFromView: getStackFromView,
	isPlatformTransformationView: isPlatformTransformationView,
	isCSMAdoptionView: isCSMAdoptionView,
	isSimplificationObsolescenceView: isSimplificationObsolescenceView,
	isNarrativeView: isNarrativeView,
	isProjectRoadmapView: isProjectRoadmapView,
	getCSMAdoptionValues: getCSMAdoptionValues
};
