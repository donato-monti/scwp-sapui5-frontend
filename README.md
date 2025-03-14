## scwp frontend

SAP UI5 frontend application for the Social Co-Worker Profile App created for the University of Mannheim Team Project in cooperation with the Sovanta AG.

### Deploying the application to the SAP BTP 

- This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite and was designed to be deployed to a Cloud Foundry Space on the SAP Business Technology Platform (BTP).

- Install all modules and dependencies by running the following in the app root folder:

```
    npm install
```


- In order to build the app, simply run the following:

```
    npm run build:mta
```

- This creates a .mtar file in the mta_archives folder.
- Log into your BTP subaccount and select your Cloud Foundry space with the command:

```
    cf login
```

- The .mtar file can then be deployed to the Cloud Foundry space using the command:

```
    npm run deploy
```

- Further information regarding the configuration process can be found in the respective confluence documentation of this project.


### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)
2. Cloud Foundry Command Line Interface (CLI) (See https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)
3. UI5 CLI (See https://sap.github.io/ui5-tooling/v3/)

## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Wed Apr 19 2023 14:47:52 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.9.4|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A
|**Module Name**<br>scwpfrontend|
|**Application Title**<br>Social Co-Worker Profile|
|**Namespace**<br>scwp|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.112.3|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|


