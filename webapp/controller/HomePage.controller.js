sap.ui.define([
	"sap/ui/core/mvc/Controller"
],

	function (Controller) {
		"use strict";

		return Controller.extend("scwp.scwpfrontend.controller.HomePage", {

			onInit: function () {

				this.refreshHomepage();
				var eventBus = sap.ui.getCore().getEventBus();
				eventBus.subscribe("ProfileController", "TriggerFunction2", this.refreshHomepage, this);

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
			 * Executes a GET request to the backend to retrieve the announcement message that is set on the admin page.
			 * Is called with every home page refresh.
			 */
			getAnnouncement: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + '/backend-dest/home/announcement');

				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {
						var messageStrip = this.getView().byId("_IDGenMessageStrip1");

						if (response === "") {
							messageStrip.setText("There are no new announcements");
							messageStrip.setType("Success");
						} else {
							this.getOwnerComponent().getModel("announcementModel").setData({
								announcement: response
							});
							messageStrip.setType("Information");

						}

						this.scrollToTop();

					}.bind(this)
				});

			},

			/**
			 * Executes a GET request to the backend to retrieve a list of users that are in the same team.
			 * Is called with every home page refresh.
			 */
			getTeamList: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + '/backend-dest/home/myTeam');


				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("myTeam").setData(response);
						this.getView().byId("teamList").setNoDataText("No users in your team found");
						this.scrollToTop();

					}.bind(this),
					error: function (xhr, status, error) {
						if (xhr.status === 404) {
							this.getOwnerComponent().getModel("myTeam").setData();
							this.getView().byId("teamList").setNoDataText(xhr.responseText);
						} else {
							this.getView().byId("teamList").setNoDataText("No users in your team found");
						}
					}.bind(this)
				});
			},

			/**
			 * Executes a GET request to the backend to retrieve a list of users that are in the same department.
			 * Is called with every home page refresh.
			 */
			getDepartmentList: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + '/backend-dest/home/myDepartment');


				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("myDepartment").setData(response);
						this.getView().byId("departmentList").setNoDataText("No users in your department found");
						this.scrollToTop();

					}.bind(this),
					error: function (xhr, status, error) {
						if (xhr.status === 404) {
							this.getOwnerComponent().getModel("myDepartment").setData();
							this.getView().byId("departmentList").setNoDataText(xhr.responseText);
						} else {
							this.getView().byId("departmentList").setNoDataText("No users in your department found");
						}
					}.bind(this)
				});
			},

			/**
			 * Factory function for the list of team members.
			 * @param {*} sId 
			 * @param {*} oContext 
			 * @returns a list item for each team member.
			 */
			factoryTeamList: function (sId, oContext) {

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
			 * Factory function for the list of department mebers.
			 * @param {*} sId 
			 * @param {*} oContext 
			 * @returns a list item for each department member.
			 */
			factoryDepartmentList: function (sId, oContext) {
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
			 * Is bound to each list item of the team, department and new profile list. 
			 * Retrieves the user data of the targeted user and directs the router to the searchProfile route.
			 * @param {*} oEvent 
			 */
			handlePress: function (oEvent) {
				var listItem = oEvent.getSource();
				var searchUserMail = listItem.getDescription();
				var searchUserMailTrimmed = searchUserMail.split(":")[1].trim();
				

				var loggedInUserEmail = this.getOwnerComponent().getModel("emailData").getProperty("/email");
				this.resetSearchProfile();
				
				var oRouter = this.getOwnerComponent().getRouter();

				if (searchUserMailTrimmed === loggedInUserEmail) {
					var eventBus = sap.ui.getCore().getEventBus();
					eventBus.publish("HomePageController", "TriggerFunction");
					oRouter.navTo("myprofile");
				} else {
					this.loadSearchUserData(searchUserMailTrimmed).then(oRouter.navTo("searchProfile", { email: searchUserMailTrimmed }));
				}
			},


			/**
			 * Is bound to each list item of the recent activity list.
			 * Retrieves the user data of the targeted user via the loadSearchUserData function and directs the router to the searchProfile route.
			 * @param {*} oEvent 
			 */
			handleActivityPress: function (oEvent) {
				var listItem = oEvent.getSource();
				listItem.setUnread(false);
				listItem.setShowCloseButton(false);

				var itemTitle = listItem.getTitle();
				localStorage.setItem(itemTitle, JSON.stringify({ unread: false }));

				var sEmail = listItem.data("email");

				this.resetSearchProfile();

				var oRouter = this.getOwnerComponent().getRouter();
				this.loadSearchUserData(sEmail).then(oRouter.navTo("searchProfile", { email: sEmail }));
			},

			/**
			 * Is bound to each card of the question of the week carousel.
			 * Retrieves the user data of the targeted user and directs the router to the searchProfile route.
			 * @param {*} oEvent 
			 */
			handleCardPress: function (oEvent) {
				var oHeader = oEvent.getSource();
				var sEmail = oHeader.getSubtitle();
				var loggedInUserEmail = this.getOwnerComponent().getModel("emailData").getProperty("/email");

				this.resetSearchProfile();

				var oRouter = this.getOwnerComponent().getRouter();

				if (sEmail === loggedInUserEmail){
					var eventBus = sap.ui.getCore().getEventBus();
					eventBus.publish("HomePageController", "TriggerFunction");
					oRouter.navTo("myprofile");
				} else {
					this.loadSearchUserData(sEmail).then(oRouter.navTo("searchProfile", { email: sEmail }));
				}
			},



			/**
			 * Executes a GET request to the backend to load the profile and user data from the targeted user.
			 * @param {*} searchUserMail the email of the targeted user
			 * @returns a promise to ensure that the data is loaded before the router targets the searchProfile route
			 */
			loadSearchUserData: function (searchUserMail) {

				var that = this;
				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + "/backend-dest/profile?email=") + searchUserMail;

				return new Promise(function (resolve, reject) {

					$.ajax({
						url: url,
						method: 'GET',
						success: function (response) {

							that.getOwnerComponent().getModel("searchProfileData").setData(response);
							var id = that.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
							url = jQuery.sap.getModulePath(id + "/backend-dest/user?email=") + searchUserMail;

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

			/**
			 * Scrolls to the top of the view.
			 */
			scrollToTop: function () {
				var oPage = this.getView().byId("homepage");
				oPage.scrollTo(0);
			},

			/**
			 * Is called when the view is initialized.
			 * Collects all data required for the home page.
			 */
			refreshHomepage: function () {

				this.getAnnouncement();

				this.getUserCount();

				this.getNewProfiles();

				this.getRecentActivity(this);

				this.getDepartmentList();

				this.getTeamList();

				this.getQuestion();

				this.getUserData();

			},

			/**
			 * Is bound to the "what is the SCWP" button.
			 * Displays a dialog window with a short introduction and the option to view an example profile.
			 */
			onPressShowInfo: function () {
				var oRouter = this.getOwnerComponent().getRouter();

				var that = this;
				var dialog = new sap.m.Dialog({
					title: "Introduction",
					contentWidth: "30rem",
					verticalScrolling: true,
					state: "Information",
					content: [
						new sap.m.IllustratedMessage({
							illustrationType: "sapIllus-BalloonSky",
							illustrationSize: "Dialog",
							title: "Welcome to SCWP, the Social Co-worker Profile!",
							description: "This application allows you to connect and collaborate with your colleagues effectively. Use the various features like updating your profile, exploring new connections, and learning fun & interesting facts about your colleagues to enhance your work experience. If you have any questions or need assistance, please feel free to contact our support team via the feedback-function. To see an example profile, use the button below.",
							additionalContent: [
								new sap.m.Button({
									text: "Show example profile",
									icon: "sap-icon://employee",
									press: function () {

										that.loadSearchUserData("example.user@example.com").then(oRouter.navTo("searchProfile", { email: "example.user@example.com" }));

										dialog.close();
										dialog.destroy();
									},
								})
							]

						}),

					],
					buttons: [
						new sap.m.Button({
							text: "Close",
							press: function () {
								dialog.close();
								dialog.destroy();
							}
						})
					]
				});
				dialog.open();
			},

			/**
			 * Is bound to the "how to use the SCWP" button.
			 * Displays a dialog window with explanations for each section/page of the application.
			 */
			onPressShowHelp: function () {
				var dialog = new sap.m.Dialog({
					title: "Help",
					contentWidth: "30rem",
					verticalScrolling: true,
					state: "Information",
					content: [
						new sap.m.IllustratedMessage({
							illustrationType: "sapIllus-SimpleEmptyDoc",
							illustrationSize: "Dialog",
							title: "How to use the SCWP",
							description: "Below, please find an overview of the different pages within this application and how to use them.",
						}),
						new sap.m.VBox({
							items: [
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Home - Announcements and News",
											design: "Bold"
										}),
										new sap.m.Text({
											text: "Administrators can post announcements or news that everybody should be informed with."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Home - Question of the Week",
											design: "Bold"
										}),
										new sap.m.Text({
											text: "A random question is selected every week and the answers of others can be viewed. This section motivates users to engage with others based on the topic of the question."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Home - Recent Activity Feed",
											design: "Bold"
										}),
										new sap.m.Text({
											text: "By showing recent changes in your colleagues' profiles, you stay updated about their working habits and other fun facts."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Home - New Profiles",
											design: "Bold"
										}),
										new sap.m.Text({
											text: "Stay tuned about new collegues using SCWP and directly connect with them."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Home - Your Team and Department",
											design: "Bold"
										}),
										new sap.m.Text({
											text: "Your colleagues that have the same team or department in their SCWP info are displayed here in order to easily connect with them."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),

								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "Search Users",
											design: "Bold",
										}),
										new sap.m.Text({
											text: "Search for any existing user within your organization in the searchfield of the navigation bar."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
								new sap.m.VBox({
									items: [
										new sap.m.Label({
											text: "My Profile",
											design: "Bold",
										}),
										new sap.m.Text({
											text: "Update your own SCWP with useful and interesting information for your colleagues."
										})
									]
								}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd")
							]
						}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd")
					],

					buttons: [
						new sap.m.Button({
							text: "Close",
							press: function () {
								dialog.close();
								dialog.destroy();
							}
						})
					]
				});
				dialog.open();
			},

			/**
			 * Is bound to the "provide feedback" button.
			 * Displays a dialog window with the option to send anonymous or personalized feedback.
			 */
			onPressShowFeedback: function () {

				var that = this;
				if (!this.dialog) {

					var dialog = new sap.m.Dialog({
						title: "Feedback",
						contentWidth: "30rem",
						verticalScrolling: true,
						state: "Information",
						content: [
							new sap.m.IllustratedMessage({
								illustrationType: "sapIllus-Survey",
								illustrationSize: "Dialog",
								title: "Provide Feedback",
								description: "Send your valuable feedback to the application admins and make a difference! We value your insights and suggestions for enhancing the application. When providing feedback, you have the choice to include your name and email to ensure personalized communication and follow-up. Together, let's shape the future of this application and create an exceptional user experience!",
							}),
							new sap.m.VBox({
								items: [
									new sap.m.HBox({
										alignItems: "Center",
										items: [
											new sap.m.Label({
												text: "Send your Name and E-Mail along with your feedback:",
											}),
											new sap.m.CheckBox({
												id: "personalizedCheckbox",
												selected: false,
											}),
										],
									}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
									new sap.m.TextArea({
										id: "feedbackArea",
										value: "",
										placeholder: "Enter your feedback here..",
										rows: 4,
										width: "100%"
									}),
								]
							}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom sapUiSmallMarginEnd")
						],
						buttons: [
							new sap.m.Button({
								text: "Cancel",
								press: function () {
									dialog.close();
									dialog.destroy();
								},
								type: "Reject"
							}),
							new sap.m.Button({
								text: "Send Feedback",
								press: function () {
									var feedbackArea = sap.ui.getCore().byId("feedbackArea");
									var personalizedCheckbox = sap.ui.getCore().byId("personalizedCheckbox");
									var isPersonalized = personalizedCheckbox.getSelected();

									if (feedbackArea.getValue() === "") {

										sap.m.MessageToast.show("Please enter feedback before sending it.", {
											at: "center center",
											my: "center center",
											width: "30em",
											duration: 2500
										});

									} else {

										var id = that.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
										var url = jQuery.sap.getModulePath(id + "/backend-dest/home/feedback?feedback=" +
											feedbackArea.getValue() +
											"&personalized=" +
											isPersonalized);

										$.ajax({
											url: url,
											method: 'PUT',
											success: function (response) {

												sap.m.MessageToast.show("Feedback sent successfully!", {
													at: "center center",
													my: "center center",
													width: "30em",
													duration: 2500
												});
											},

											error: function (xhr, status, error) {
												sap.m.MessageToast.show("Error sending feedback! Please try again later or contact the administrator!", {
													at: "center center",
													my: "center center",
													width: "30em",
													duration: 3500
												});
											}
										});
										dialog.close();
										dialog.destroy();
									}
								},
								type: "Accept"
							}),
						]
					});
				}
				dialog.open();
			},

			/**
			 * Executes a GET request to the backend to retrieve the number of users.
			 * Is called with every home page refresh.
			 */
			getUserCount: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + "/backend-dest/home/userCount");

				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("userCount").setData({
							userCount: response
						});

						this.scrollToTop();

					}.bind(this)
				});
			},

			/**
			 * Executes a GET request to the backend to retrieve the latest new profiles.
			 * Is called with every home page refresh.
			 */
			getNewProfiles: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + "/backend-dest/home/newProfiles");

				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("newProfiles").setData(response);
						this.scrollToTop();

					}.bind(this)
				});

			},

			/**
			 * Factory function for the list of new profiles.
			 * @param {*} sId 
			 * @param {*} oContext 
			 * @returns a list item for every new profile.
			 */
			factoryNewProfilesList: function (sId, oContext) {
				var sName = oContext.getProperty("name");
				var sEmail = oContext.getProperty("email");
				var sCreation = oContext.getProperty("creationDate");

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var userUrl = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + sEmail;

				return new sap.m.StandardListItem({
					title: sName,
					description: "E-Mail: " + sEmail,
					info: sCreation,
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
			 * Executes a GET request to the backend to retrieve the most recent activities.
			 * Uses the "this" context as a callback to load and handle the read/unread states from the local storage via the respective function.
			 * Is called with every home page refresh.
			 */
			getRecentActivity: function (callback) {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + "/backend-dest/home/recentActivity");

				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("recentActivity").setData(response);

						callback.handleReadStates();
						this.scrollToTop();

					}.bind(this)
				});
			},

			/**
			 * Factory function for the recent activities list
			 * @param {*} sId 
			 * @param {*} oContext 
			 * @returns a list item for every recent activity
			 */
			factoryActivityList: function (sId, oContext) {
				var sTime = oContext.getProperty("time");
				var sEmail = oContext.getProperty("email");
				var sChange = oContext.getProperty("change");

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var userUrl = jQuery.sap.getModulePath(id + "/backend-dest/profile/image?email=") + sEmail;

				var listItem = new sap.m.NotificationListItem({
					title: sChange,
					datetime: sTime,
					unread: true,
					showCloseButton: true,
					close: this.handleActivityClose.bind(this),
					authorPicture: userUrl,
					press: this.handleActivityPress.bind(this),

				});

				listItem.data("email", sEmail);

				return listItem;

			},

			/**
			 * Is bound to the close button of every recent activity item.
			 * Sets the item to read and stores the information in the local storage.
			 * @param {*} oEvent 
			 */
			handleActivityClose: function (oEvent) {
				var listItem = oEvent.getSource();
				listItem.setUnread(false);
				listItem.setShowCloseButton(false);

				var itemTitle = listItem.getTitle();
				localStorage.setItem(itemTitle, JSON.stringify({ unread: false }));
			},

			/**
			 * Loads and handles the read states from the local storage of every recent activity item.
			 */
			handleReadStates: function () {
				var oList = this.getView().byId("activityList");
				var aItems = oList.getItems();
				aItems.forEach(function (listItem) {
					var itemTitle = listItem.getTitle();
					var itemState = localStorage.getItem(itemTitle);
					if (itemState) {
						var parsedItemState = JSON.parse(itemState);
						listItem.setUnread(parsedItemState.unread);
						listItem.setShowCloseButton(parsedItemState.unread);
					}
				});
			},

			/**
			 * Executes a GET request to the backend to retrieve the question of the week data.
			 * Is called with every home page refresh.
			 */
			getQuestion: function () {

				var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
				var url = jQuery.sap.getModulePath(id + "/backend-dest/home/questionOfTheWeek");

				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {

						this.getOwnerComponent().getModel("QuestionOfTheWeekModel").setData(response);
						this.scrollToTop();


					}.bind(this)
				});





			},
			/**
			 * Uses the user-api to retrieve the logged in sap user with a GET request.
			 * Saves the data from the logged in user in the emailData model.
			 * Loads the user data after the logged in user is retrieved to display the users team and department
			 */
			getUserData: function () {

				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
				var appPath = appId.replaceAll(".", "/");
				var appModulePath = jQuery.sap.getModulePath(appPath);

				$.ajax({
					url: appModulePath + "/user-api/currentUser",
					method: 'GET',
					success: function (response) {

						var json = response;

						this.getOwnerComponent().getModel("emailData").setData({
							email: json.email,
							name: json.firstname + " " + json.lastname
						});

						var userMail = json.email


						var id = this.getOwnerComponent().getModel("moduleIdModel").getProperty("/id");
						var url = jQuery.sap.getModulePath(id + "/backend-dest/user?email=") + userMail;



						$.ajax({
							url: url,
							method: 'GET',
							success: function (response) {

								this.getOwnerComponent().getModel("userData").setData(response);
							}.bind(this),
							error: function (xhr, status, error) {

								var userDataModelData = {
									"email": json.email,
									"name": json.name,
									"phone": null,
									"location": null,
									"team": null,
									"department": null,
									"position": null
								};

								this.getOwnerComponent().getModel("userData").setData(userDataModelData);

							}.bind(this)
						});

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
			}
		});
	});