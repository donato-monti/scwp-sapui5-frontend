sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("scwp.scwpfrontend.controller.Profile", {



      onInit: function () {

        var eventBus = sap.ui.getCore().getEventBus();
				eventBus.subscribe("HomePageController", "TriggerFunction", this.loadProfile, this);

        this.getLoggedInUser(this);
        this.file = null;
        this.deleteFile = false;

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
        this.loadProfile();
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
       * Is bound to the edit my profile button.
       * Sets the edit data model to editable=true. 
       * Allows the user to edit their profile page.
       */
      onPressEditProfile: function () {
        var oModel = this.getOwnerComponent().getModel("editModel");
        oModel.setProperty("/editable", true);
        oModel.setProperty("/showEdit", false);

      },

      /**
     * Is bound to the save my profile button.
     * Executes 2 POST requests to the backend to save the user and profile data of the logged in user
     * May execute a POST or a DELETE request to the backend if the user updates or resets their profile picture.
     * Triggers the refresh home page function.
     * Sets the edit data model to editable=false. 
     */
      onPressSave: function () {

        var that = this;
        var oModel = this.getOwnerComponent().getModel("profileData");
        var pdata = oModel.getData();

        var oEditModel = this.getOwnerComponent().getModel("editModel");
        oEditModel.setProperty("/showEdit", true);
        oEditModel.setProperty("/editable", false);

        var oModel = this.getOwnerComponent().getModel("emailData");
        var userMail = oModel.getProperty("/email");

        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url = jQuery.sap.getModulePath(id + "/backend-dest/profile/save?email=") + userMail;


        $.ajax({
          url: url,
          method: 'POST',
          data: JSON.stringify(pdata),
          contentType: "application/json",
          success: function (response) {

            var oModel = that.getOwnerComponent().getModel("userData");
            var pdata = oModel.getData();

            if (pdata.department === "") {
              pdata.department = null;
            }

            if (pdata.team === "") {
              pdata.team = null;
            }

            var url = jQuery.sap.getModulePath(id + "/backend-dest/user");

            $.ajax({
              url: url,
              method: 'POST',
              data: JSON.stringify(pdata),
              contentType: "application/json",
              success: function (response) {

                sap.m.MessageToast.show("Profile saved successfully!", {
                  at: "center center",
                  my: "center center",
                  width: "30em",
                  duration: 2500
                });


                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish("ProfileController", "TriggerFunction2");

                that.loadTeamDepData();

              },

              error: function (xhr, status, error) {
                sap.m.MessageToast.show("Error saving user data! Please try again later or contact the administrator!", {
                  at: "center center",
                  my: "center center",
                  width: "30em",
                  duration: 3500
                });

                var oEditModel = that.getOwnerComponent().getModel("editModel");
                oEditModel.setProperty("/showEdit", false);
                oEditModel.setProperty("/editable", true);
              }
            });
          },

          error: function (xhr, status, error) {
            sap.m.MessageToast.show("Error saving profile! Please try again later or contact the administrator!", {
              at: "center center",
              my: "center center",
              width: "30em",
              duration: 3500
            });

            var oEditModel = this.getOwnerComponent().getModel("editModel");
            oEditModel.setProperty("/showEdit", false);
            oEditModel.setProperty("/editable", true);
          }
        });

        var oModel = this.getOwnerComponent().getModel("emailData");
        var sEmail = oModel.getProperty("/email");

        if (this.file) {

          this.getView().byId("fileUploader").clear();

          var oFile = this.file;

          var oFormData = new FormData();

          oFormData.append("imagefile", oFile);

          var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
          var url = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + sEmail;

          $.ajax({
            url: url,
            data: oFormData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {

              that.file = null;
              that.deleteFile = false;

              var eventBus = sap.ui.getCore().getEventBus();
              eventBus.publish("ProfileController", "TriggerFunction2");

            },
            error: function (xhr, status, error) {

            }
          });

        } else if (this.deleteFile) {

          var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
          var url = jQuery.sap.getModulePath(id + "/backend-dest/profile/image");

          $.ajax({
            url: url,
            type: 'DELETE',
            success: function (response) {

              var id = that.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
              var url = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + sEmail;

              var oImageControl = that.getView().byId("profileImage");
              oImageControl.setSrc(url);

              that.file = null;
              that.deleteFile = false;

              var eventBus = sap.ui.getCore().getEventBus();
              eventBus.publish("ProfileController", "TriggerFunction2");
            },
            error: function (xhr, status, error) {

            }
          });
        }
      },

      /**
       * Is bound to the reset profile picture button.
       * Resets the image src and indicates a deletion.  
       */
      onPressRemovePicture: function () {
        var oImageControl = this.getView().byId("profileImage");
        oImageControl.setSrc("");
        this.deleteFile = true;
      },

      /**
       * Is bound to the cancel button.
       * Sets the edit data model to editable=false. 
       * Discards any edits made.
       * Reloads the profile.
       */
      onPressCancelEdit: function () {
        var oEditModel = this.getOwnerComponent().getModel("editModel");
        oEditModel.setProperty("/showEdit", true);
        oEditModel.setProperty("/editable", false);

        this.getView().byId("fileUploader").clear();

        this.loadProfile();
      },

      /**
       * Is bound to the file uploader and is called if a wrong image type is uploaded.
       * @param {*} oEvent 
       */
      handleTypeMissmatch: function (oEvent) {
        var aFileTypes = oEvent.getSource().getFileType();
        aFileTypes.map(function (sType) {
          return "*." + sType;
        });
        sap.m.MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
          " is not supported. Choose one of the following types: " +
          aFileTypes.join(", "), {
          at: "center center",
          my: "center center",
          width: "30em",
          duration: 2500
        });
      },

      /**
       * Is bound to the file uploader and is called when a file is selected.
       * Saves the image for potential upload and displays the image.
       * @param {*} oEvent 
       */
      handleValueChange: function (oEvent) {
        this.file = oEvent.getParameter("files")[0];

        var oImageControl = this.getView().byId("profileImage");
        if (this.file && this.file.type === "image/jpeg") {
          var oReader = new FileReader();
          oReader.onload = function (e) {
            var sDataUrl = e.target.result;
            oImageControl.setSrc(sDataUrl);
            oImageControl.setVisible(true);
          };
          oReader.readAsDataURL(this.file);
        } else {
          sap.m.MessageToast.show("Please select a valid JPEG image file.");
        }

      },

      /**
       * Executes 2 GET requests to the backend to retrieve the user and profile data of the logged in user.
       */
      loadProfile: function () {

        var oModel = this.getOwnerComponent().getModel("emailData");
        var userMail = oModel.getProperty("/email");
        var userName = oModel.getProperty("/name");


        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url = jQuery.sap.getModulePath(id + "/backend-dest/profile?email=") + userMail;



        $.ajax({
          url: url,
          method: 'GET',
          success: function (response) {
            this.getOwnerComponent().getModel("profileData").setData(response);
          }.bind(this),
          error: function (xhr, status, error) {
            sap.m.MessageToast.show("Error retrieving profile data! Please try again later or contact the administrator!", {
              at: "center center",
              my: "center center",
              width: "30em",
              duration: 3500
            });
          }
        });

        var url = jQuery.sap.getModulePath(id + "/backend-dest/user?email=") + userMail;


        $.ajax({
          url: url,
          method: 'GET',
          success: function (response) {

            this.getOwnerComponent().getModel("userData").setData(response);
          }.bind(this),
          error: function (xhr, status, error) {

            var userDataModelData = {
              "email": userMail,
              "name": userName,
              "phone": null,
              "location": null,
              "team": null,
              "department": null,
              "position": null
            };

            this.getOwnerComponent().getModel("userData").setData(userDataModelData);

          }.bind(this)
        });

        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + userMail;

        this.getView().byId("profileImage").setSrc(url);

      },

      /**
       * Uses the user-api to retrieve the logged in sap user with a GET request.
       * Saves the data from the logged in user in the emailData model.
       * Uses the "this" context as a callback to load the user and profile data after the logged in user is retrieved.
       * @param {*} callback 
       */
      getLoggedInUser: function (callback) {
        var nameTitle = this.getView().byId("nameTitle");
        var nameTitleSnapped = this.getView().byId("nameTitleSnapped");

        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);

        $.ajax({
          url: appModulePath + "/user-api/currentUser",
          method: 'GET',
          success: function (response) {

            var json = response;
            nameTitle.setText(json.firstname + " " + json.lastname);
            nameTitleSnapped.setText(json.firstname + " " + json.lastname);

            this.getOwnerComponent().getModel("emailData").setData({
              email: json.email,
              name: json.firstname + " " + json.lastname
            });

            callback.loadProfile();
            callback.loadTeamDepData();

          }.bind(this),

          error: function (xhr, status, error) {
            sap.m.MessageToast.show("Error retrieving logged in User! Please try again later or contact the administrator!", {
              at: "center center",
              my: "center center",
              width: "30em",
              duration: 3500
            });
          }
        });



      },

      /**
       * Is bound to the department combo box of the user data section.
       * Updates the value of the user data model with the respective input.
       * @param {*} oEvent 
       */
      onComboBoxDepChange: function (oEvent) {
        var sNewValue = oEvent.getParameter("value");
        var oComboBox = oEvent.getSource();
        var oModel = oComboBox.getModel("userData");
        var sSelectedKey = oComboBox.getSelectedKey();

        if (sSelectedKey === "") {
          oModel.setProperty("/department", sNewValue);
        }
      },

      /**
       * Is bound to the team combo box of the user data section.
       * Updates the value of the user data model with the respective input.
       * @param {*} oEvent 
       */
      onComboBoxTeamChange: function (oEvent) {
        var sNewValue = oEvent.getParameter("value");
        var oComboBox = oEvent.getSource();
        var oModel = oComboBox.getModel("userData");
        var sSelectedKey = oComboBox.getSelectedKey();

        if (sSelectedKey === "") {
          oModel.setProperty("/team", sNewValue);
        }
      },

      /**
       * Executes 2 GET requests to the backend to retrieve lists of all existing teams and departments.
       */
      loadTeamDepData: function () {

        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url = jQuery.sap.getModulePath(id + "/backend-dest/search/departments?searchTerm=");

        $.ajax({
          url: url,
          method: 'GET',
          success: function (response) {
            this.getOwnerComponent().getModel("departmentModel").setData({
              departments: response
            });
          }.bind(this)
        });


        var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
        var url2 = jQuery.sap.getModulePath(id + "/backend-dest/search/teams?searchTerm=");


        $.ajax({
          url: url2,
          method: 'GET',
          success: function (response) {
            this.getOwnerComponent().getModel("teamModel").setData({
              teams: response
            });

          }.bind(this)
        });

      },

      /**
       * Factory function for the combo box items of existing teams and departments.
       * @param {*} sId 
       * @param {*} oContext 
       * @returns a combo box item for each team/department
       */
      createComboBoxItem: function (sId, oContext) {
        return new sap.ui.core.ListItem({
          text: oContext.getObject(),
          key: oContext.getObject()
        });
      },


      /**
       * Is bound to the share my profile button.
       * Allows the user to share their profile page.
       * User can copy the link or send a mail with it. 
       */
      onPressShareProfile: function () {
        var oModel = this.getView().getModel("userData");
        var sUserName = oModel.getProperty("/name");
        var sUserMail = oModel.getProperty("/email");

        var sProfileLink = window.location.href.replace(/\/myprofile(\/|$)/, "/searchProfile/$1") + sUserMail;

        var sEmailSubject = "Check out my profile";
        var sEmailBody = "Hi!\n\nI'd like to share my profile with you.\n\nHere is the link:\n" + sProfileLink + "\n\nKind regards,\n" + sUserName;
        var sMailTo = "mailto:?" + "subject=" + encodeURIComponent(sEmailSubject) + "&body=" + encodeURIComponent(sEmailBody);

        var oText = new sap.m.Text({
          text: "Share your profile using the following link:"
        });

        var oInput = new sap.m.Input({
          type: sap.m.InputType.Text,
          value: sProfileLink,
          width: "100%",
          editable: false
        });

        var oContent = new sap.ui.layout.VerticalLayout({
          content: [oText, oInput]
        }).addStyleClass("sapUiContentPadding");

        var oCopyButton = new sap.m.Button({
          text: "Copy",
          icon: "sap-icon://copy",
          press: function () {
            navigator.clipboard.writeText(sProfileLink).then(function () {
              oDialog.close();
              sap.m.MessageBox.information("Link copied to clipboard!");
            }).catch(function (err) {
              sap.m.MessageBox.error("Failed to copy the link to clipboard: " + err);
            });
          }
        });

        var oSendButton = new sap.m.Button({
          text: "Send",
          icon: "sap-icon://email",
          press: function () {
            window.open(sMailTo, "_blank");
            oDialog.close();
          }
        });

        var oCancelButton = new sap.m.Button({
          text: "Cancel",
          icon: "sap-icon://decline",
          press: function () {
            oDialog.close();
          }
        });

        var oDialog = new sap.m.Dialog({
          title: "Share My Profile",
          content: [oContent],
          buttons: [oCopyButton, oSendButton, oCancelButton],
          contentWidth: "600px"
        });

        oDialog.open();
      },

    });
  }
);
