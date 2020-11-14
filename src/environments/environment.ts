// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
     firebaseConfig : {
        apiKey: "AIzaSyDAqm8UR2kYwdatJ3p5KHP5qO5ybbuVUEM",
        authDomain: "wiki-crm.firebaseapp.com",
        databaseURL: "https://wiki-crm.firebaseio.com",
        projectId: "wiki-crm",
        storageBucket: "wiki-crm.appspot.com",
        messagingSenderId: "329868958384",
        appId: "1:329868958384:web:e484e3259800770d8b3975"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
