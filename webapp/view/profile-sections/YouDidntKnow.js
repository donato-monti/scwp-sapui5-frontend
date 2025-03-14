sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var YouDidntKnowBlock = BlockBase.extend("scwp.scwpfrontend.view.profile-sections.YouDidntKnow", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.profile-sections.YouDidntKnow",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.profile-sections.YouDidntKnow",
					type: ViewType.XML
				}
			}
		}
	});
	return YouDidntKnowBlock;
});