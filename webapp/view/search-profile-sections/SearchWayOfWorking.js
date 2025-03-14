sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var WayOfWorkingBlock = BlockBase.extend("scwp.scwpfrontend.view.search-profile-sections.SearchWayOfWorking", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchWayOfWorking",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.search-profile-sections.SearchWayOfWorking",
					type: ViewType.XML
				}
			}
		}
	});
	return WayOfWorkingBlock;
});

