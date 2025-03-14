sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("scwp.scwpfrontend.controller.Personal", {

            onInit: function () {
                var oModel = this.getOwnerComponent().getModel("profileData");
                this.getView().setModel(oModel);
            },

            /**
             * Factory function for every question item from the general information about me section of the profile page.
             * @param {*} sId 
             * @param {*} oContext 
             * @returns a list item depending on the question type, the category and the default property.
             */
            onListItemFactory: function (sId, oContext) {
                var sQuestionType = oContext.getProperty("questionType");
                var sCategory = oContext.getProperty("category");
                var bDefault = oContext.getProperty("default");

                if (bDefault === true) {
                    var oButton = new sap.m.Label({
                        text: "Default Question - always displayed",
                        visible: "{editModel>/editable}",
                    })
                } else {

                var oButton = new sap.m.Button({
                    text: "Hide Question",
                    visible: "{editModel>/editable}",
                    press: function () {
                        var sPath = oContext.getPath(); 
                        var oModel = oContext.getModel(); 
                        oModel.setProperty(sPath + "/displayed", false); 
                        oModel.refresh();                         
                    }
                });
            }

                if (sCategory === "GENERAL_INFORMATION") {
                    if (sQuestionType === "FREETEXT") {
                        return new sap.m.CustomListItem({
                            content: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.VBox({
                                            items: [
                                                new sap.m.Label({
                                                    text: oContext.getProperty("questionDisplayName")
                                                }),
                                                new sap.m.TextArea({
                                                    value: "{profileData>answer}",
                                                    editable: "{editModel>/editable}",
                                                    width: "400px"

                                                })
                                            ]
                                        }),oButton
                                    ],
                                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween
                                }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom")
                            ],
                            visible: "{profileData>displayed}"
                        }).setBindingContext(oContext); 
                    }
                    else if (sQuestionType === "MULTIPLE_CHOICE") {
                        return new sap.m.CustomListItem({
                            content: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.VBox({
                                            items: [
                                                new sap.m.Label({
                                                    text: oContext.getProperty("questionDisplayName")
                                                }),
                                                new sap.m.ComboBox({
                                                    items: {
                                                        path: 'profileData>multipleChoiceOptions',
                                                        factory: function (sId, oContext) {
                                                            return new sap.ui.core.ListItem({
                                                                text: oContext.getObject(),
                                                                key: oContext.getObject()
                                                            });
                                                        }
                                                    },
                                                    showClearIcon: true,
                                                    width: "400px",
                                                    editable: "{editModel>/editable}",
                                                    value: {
                                                        path: 'profileData>answer'
                                                    },
                                                    change: function (oEvent) {
                                                        var sNewValue = oEvent.getParameter("value");
                                                        var oComboBox = oEvent.getSource();
                                                        var oCustomListItem = oComboBox.getParent().getParent();
                                                        var oModel = oComboBox.getModel("profileData");
                                                        var oBindingContext = oCustomListItem.getBindingContext("profileData");
                                                        
                                                        oModel.setProperty("answer", sNewValue, oBindingContext);
                                                        
                                                    }
                                                })
                                            ]
                                        }),
                                        new sap.m.Label({
                                            text: "Choose a standard option or enter your individual answer.",
                                            visible: "{editModel>/editable}"
                                        }),
                                        oButton
                                    ],
                                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween
                                }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom")
                            ],
                            visible: "{profileData>displayed}"
                        }).setBindingContext(oContext); 
                    }
                }
                return new sap.m.CustomListItem({
                    visible: false
                });
            },

            /**
             * Is bound to the show hidden questions button.
             * Creates and displays a dialog window with a list of all hidden questions.
             */
            onShowHiddenQuestionsPress: function () {
                var oModel = this.getOwnerComponent().getModel("profileData");
                var that = this;

                var oPopup = new sap.m.Dialog({
                    title: "Hidden Questions",
                    contentWidth: "400px",
                    content: new sap.m.List({
                        items: {
                            path: "/",
                            factory: that.onHiddenQuestionListItemFactory
                        },
                        noDataText: "No hidden questions available"
                    }),
                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {

                            oModel.refresh();
                            oPopup.close();
                        }
                    })
                }).setModel(oModel);
                oPopup.open();
            },

            /**
             * Factory function for every hidden question item from the hidden question dialog.
             * @param {*} sId 
             * @param {*} oContext 
             * @returns a list item for every hidden question, with a button to display it.
             */
            onHiddenQuestionListItemFactory: function (sId, oContext) {
                var sCategory = oContext.getProperty("category");



                if (sCategory === "GENERAL_INFORMATION") {

                    var oButton = new sap.m.Button({
                        text: "Show Question",
                        press: function () {
                            var sPath = oContext.getPath(); 
                            var oModel = oContext.getModel(); 
                            oModel.setProperty(sPath + "/displayed", true); 
                            oModel.refresh();                      
                        }
                    });

                    var oVisibleBinding = {
                        path: "displayed",
                        formatter: function (displayed) {
                            return !displayed; 
                        }
                    };


                    return new sap.m.CustomListItem({
                        content: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        items: [
                                            new sap.m.Label({
                                                text: oContext.getProperty("questionDisplayName"),
                                                wrapping: true,
                                                width: "100%"
                                            }),
                                            oButton 
                                        ]
                                    })
                                ]
                            }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom")
                        ],
                        visible: oVisibleBinding
                    }).setBindingContext(oContext);
                }

                return new sap.m.CustomListItem({
                    visible: false
                }).setBindingContext(oContext);
            }
        });
    }
);
