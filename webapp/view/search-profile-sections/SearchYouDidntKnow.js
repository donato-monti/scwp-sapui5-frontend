sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var YouDidntKnowBlock = BlockBase.extend("scwp.scwpfrontend.view.search-profile-sections.SearchYouDidntKnow", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchYouDidntKnow",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchYouDidntKnow",
					type: ViewType.XML
				}
			}
		}
	});
	return YouDidntKnowBlock;
});