sap.ui.define([
    "sap/ui/core/UIComponent"
],
    function (UIComponent) {
        "use strict";

        return UIComponent.extend("scwp.scwpfrontend.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                UIComponent.prototype.init.apply(this, arguments);

                this.getRouter().initialize();

                // create empty data models for all required data 

                this.createRequestPathModel();

                this.createEditModel();

                this.createSearchProfileModels();

                this.createSearchResultsModel();

                this.createAnnouncementModel();

                this.createMyTeamModel();

                this.createMyDepartmentModel();

                this.createUserCountModel();

                this.createNewProfilesModel();

                this.createRecentActivityModel();

                this.createQuestionOfTheWeekModel();

                this.createProfileDataModels();

                this.createLoggedInUserModel();

                this.createDepTeamModels();

            },

            /**
             * Data model containing the application id and url used for the ajax requests
             */
            createRequestPathModel: function () {

                var id = this.getMetadata().getManifest()["sap.app"].id;
                var url = jQuery.sap.getModulePath(id);

                var oModel = new sap.ui.model.json.JSONModel({
                    id: id,
                    idUrl: url
                });
                this.setModel(oModel, "moduleIdModel");

            },

            /**
             * Data model containing flags that indicate whether the logged in users profile can be edited or not
             */
            createEditModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({
                    editable: false,
                    showEdit: true
                });
                this.setModel(oModel, "editModel");

            },

            /**
             * Data models containing the questions and answers (searchProfileData) and the general information, i.e. email, phone, team, department, position location (searchUserData) of the searched user
             */
            createSearchProfileModels: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "searchProfileData");

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "searchUserData");
            },

            /**
             * Data model containing a list of the users that match the search term
             */
            createSearchResultsModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "searchResults");
            },

            /**
             * Data model containing the announcement that can be set in the configuration dashboard
             */
            createAnnouncementModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "announcementModel");
            },

            /**
             * Data model containing a list of the users that are in the same team as the logged in user
             */
            createMyTeamModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "myTeam");
            },

            /**
             * Data model containing a list of the users that are in the same department as the logged in user
             */
            createMyDepartmentModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "myDepartment");
            },

            /**
             * Data model containing the total number of profiles that exist in the database
             */
            createUserCountModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "userCount");
            },

            /**
             * Data model containing a list of the most recently created profiles
             */
            createNewProfilesModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "newProfiles");
            },

            /**
             * Data model containing a list of the most recent activities/edits made to profiles, i.e. new answers to questions
             */
            createRecentActivityModel: function () {
                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "recentActivity");

            },

            /**
             * Data model containing the question of the week, as well as all profiles & answers that have answered the respective question
             */
            createQuestionOfTheWeekModel: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "QuestionOfTheWeekModel");
            },

            /**
             * Data models containing the questions and answers (searchProfileData) and the general information, i.e. email, phone, team, department, position location (searchUserData) of the logged in user
             */
            createProfileDataModels: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "profileData");

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "userData");
            },

            /**
             * Data model containing the name and email acquired from the logged in user
             */
            createLoggedInUserModel: function () {
                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "emailData");
            },

            /**
             * Data models containing lists of all departments/teams that exist in the database
             */
            createDepTeamModels: function () {

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "departmentModel");

                var oModel = new sap.ui.model.json.JSONModel({});
                this.setModel(oModel, "teamModel");
            }

        });
    }
);