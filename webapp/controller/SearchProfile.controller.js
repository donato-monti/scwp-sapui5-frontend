sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("scwp.scwpfrontend.controller.SearchProfile", {

      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("searchProfile").attachPatternMatched(this._onRouteMatched, this);
      },

      /**
       * Loads the data of the respective user once the route is matched to ensure application entry from this page/view.
       * @param {*} oEvent 
       */
      _onRouteMatched: function (oEvent) {
        this.byId("ObjectPageLayout").setSelectedSection(null);
        var oParameters = oEvent.getParameters();
        if (oParameters.name === "searchProfile") {
          var sEmail = oParameters.arguments.email;
          this.loadSearchUserData(sEmail);

        }
      },

      /**
       * Is bound to the mail button on the search profile page.
       * Triggers a new mail in the mail client.
       */
      onPressTriggerMail: function () {
        var mail = this.getOwnerComponent().getModel("searchUserData").getProperty("/email");
        sap.m.URLHelper.triggerEmail(mail, "", "");
      },

      /**
       * Is bound to the call button on the search profile page.
       * Triggers a new call to the displayed number.
       */
      onPressTriggerPhone: function () {
        var tel = this.getOwnerComponent().getModel("searchUserData").getProperty("/phone");
        sap.m.URLHelper.triggerTel(tel);
      },

      /**
			 * Is bound to the home button in the header toolbar.
			 * Directs the router to the home route.
			 * @param {*} oEvent 
			 */
      onNavigateToHome: function (oEvent) {
        var eventBus = sap.ui.getCore().getEventBus();
        eventBus.publish("ProfileController", "TriggerFunction2");
        this.resetSearchProfile();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("home");

      },

      /**
			 * Is bound to the my profile button in the header toolbar.
			 * Directs the router to the myProfile route.
			 * @param {*} oEvent 
			 */
      onNavigateProfile: function (oEvent) {
        var eventBus = sap.ui.getCore().getEventBus();
				eventBus.publish("HomePageController", "TriggerFunction");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("myprofile");
      },

      /**
			 * Resets the data models of the searched user. 
			 * Is called during navigation and prior to any search request.
			 */
      resetSearchProfile: function () {
        this.getOwnerComponent().getModel("searchProfileData").setData("");
        this.getOwnerComponent().getModel("searchUserData").setData("");
      },

      /**
			 * Is bound to the search button from the search bar. 
			 * Executes a GET request to the backend to retrieve users that match the searchterm.
			 */
      onSearch: function () {
        this.resetSearchProfile();

        var searchTerm = this.byId("SearchField").getValue();

        if (/^\s*$/.test(searchTerm)) {
          this.getOwnerComponent().getModel("searchResults").setData({});

        } else {
          let url = "backend-dest/search?searchTerm=" + searchTerm;

          $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
              this.getOwnerComponent().getModel("searchResults").setData(response);
            }.bind(this),
            error: function (xhr, status, error) {
              sap.m.MessageToast.show("Error during search. Please try again later or contact the administrator.", {
                at: "center center",
                my: "center center",
                width: "30em",
                duration: 2500
              });
            }
          });
        }

        this.byId("SearchField").setValue("");

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("search");
      },

			/**
			 * Executes a GET request to the backend to load the profile and user data from the targeted user.
			 * @param {*} searchUserMail the email of the targeted user
			 * @returns a promise to ensure that the data is loaded before the router targets the searchProfile route
			 */
      loadSearchUserData: function (searchUserMail) {

        var that = this;

        var id = that.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url = jQuery.sap.getModulePath(id + "/backend-dest/profile?email=") + searchUserMail;



        $.ajax({
          url: url,
          method: 'GET',
          success: function (response) {

            that.getOwnerComponent().getModel("searchProfileData").setData(response);



            var id = that.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
            var url = jQuery.sap.getModulePath(id + "/backend-dest/user?email=") + searchUserMail;


            $.ajax({
              url: url,
              method: 'GET',
              success: function (response) {
                that.getOwnerComponent().getModel("searchUserData").setData(response);


              },
              error: function (xhr, status, error) {
                sap.m.MessageToast.show("Error retrieving user data! Please try again later or contact the administrator!", {
                  at: "center center",
                  my: "center center",
                  width: "30em",
                  duration: 3500
                });
              }
            });


          },
          error: function (xhr, status, error) {
            sap.m.MessageToast.show("Error retrieving profile data! Please try again later or contact the administrator!", {
              at: "center center",
              my: "center center",
              width: "30em",
              duration: 3500
            });
          }
        });

        ;


      },

    });
  }
);
