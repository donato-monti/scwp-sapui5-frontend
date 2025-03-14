sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var WorkingWithYouBlock = BlockBase.extend("scwp.scwpfrontend.view.profile-sections.WorkingWithYou", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.profile-sections.WorkingWithYou",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.profile-sections.WorkingWithYou",
					type: ViewType.XML
				}
			}
		}
	});
	return WorkingWithYouBlock;
});