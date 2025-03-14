sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",

  ],
  function (Controller) {
    "use strict";

    return Controller.extend("scwp.scwpfrontend.controller.Search", {

      onInit: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("search").attachPatternMatched(this._onSearchMatched, this);

        this._oRouter = oRouter;
      },

      /**
       * Factory function for the list of search results.
       * @param {*} sId 
       * @param {*} oContext 
       * @returns a list item for every user from the search results.
       */
      onListItemFactory: function (sId, oContext) {
        var sName = oContext.getProperty("name");
        var sEmail = oContext.getProperty("email");

        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var userUrl = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + sEmail;


        return new sap.m.StandardListItem({
          title: sName,

          description: "E-Mail: " + sEmail,
          type: "Navigation",
          press: this.handlePress.bind(this),
          avatar: new sap.m.Avatar({
            src: userUrl,
            displayShape: "Circle",
            displaySize: "L",
            showBorder: true
          })
        });
      },

      /**
       * Is bound to every item from the list of search results.
       * Directs the router to the searchProfile of the targeted user.
       * @param {*} oEvent 
       */
      handlePress: function (oEvent) {
        var listItem = oEvent.getSource();
        var description = listItem.getDescription();
        var email = description.split(":")[1].trim();

        var loggedInUserEmail = this.getOwnerComponent().getModel("emailData").getProperty("/email");
        this.resetSearchProfile();

        var oRouter = this.getOwnerComponent().getRouter();

        if (email === loggedInUserEmail) {
          var eventBus = sap.ui.getCore().getEventBus();
          eventBus.publish("HomePageController", "TriggerFunction");
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("myprofile");

        } else {

          this.loadSearchUserData(email).then(oRouter.navTo("searchProfile", { email: email }));

        }
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
       * Resets the data models of the searched user. 
       * Is called during navigation and prior to any search request.
       */
      resetSearchProfile: function () {
        this.getOwnerComponent().getModel("searchProfileData").setData("");
        this.getOwnerComponent().getModel("searchUserData").setData("");
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

        return new Promise(function (resolve, reject) {


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

        });


      },

      /**
       * Is bound to the home button in the header toolbar.
       * Directs the router to the home route.
       * @param {*} oEvent 
       */
      onNavigateToHome: function (oEvent) {
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
    });
  }
);
