sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var WorkingWithYouBlock = BlockBase.extend("scwp.scwpfrontend.view.search-profile-sections.SearchWorkingWithYou", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchWorkingWithYou",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchWorkingWithYou",
					type: ViewType.XML
				}
			}
		}
	});
	return WorkingWithYouBlock;
});