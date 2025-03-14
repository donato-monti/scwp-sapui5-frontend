sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("scwp.scwpfrontend.controller.SearchYouDidntKnow", {

            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("searchProfileData");
                this.getView().setModel(oModel);
            },

            /**
             * Factory function for every question item from the something you didnt know section of the searchProfile page.
             * @param {*} sId 
             * @param {*} oContext 
             * @returns a list item for every displayed question.
             */
            onListItemFactory: function (sId, oContext) {
                var sCategory = oContext.getProperty("category");


                if (sCategory === "SOMETHING_NOT_KNOWN") {
                    return new sap.m.CustomListItem({
                        content: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        items: [
                                            new sap.m.Label({
                                                text: oContext.getProperty("questionDisplayName"),
                                                design: "Bold"
                                            }),
                                            new sap.m.Text({
                                                text: "{searchProfileData>answer}",
                                                renderWhitespace: true                                            })
                                        ]
                                    }),
                                ],
                                justifyContent: sap.m.FlexJustifyContent.SpaceBetween
                            }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom")
                        ],
                        visible: "{searchProfileData>displayed}"
                    }).setBindingContext(oContext); 

                }

                return new sap.m.CustomListItem({
                    visible: false
                });
            }
        });
    }
);
