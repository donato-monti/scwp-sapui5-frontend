sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var PersonalBlock = BlockBase.extend("scwp.scwpfrontend.view.profile-sections.Personal", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "scwp.scwpfrontend.view.profile-sections.Personal",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "scwp.scwpfrontend.view.profile-sections.Personal",
					type: ViewType.XML
				}
			}
		}
	});
	return PersonalBlock;
});