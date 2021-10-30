let db;
let budgetdbVersion;

//Open a database
//Returns an object with a result or error value that can be handled as an event
const request = window.indexedDB.open("budgetdb", budgetdbVersion || 1);

//Error handler
request.onerror = function (event) {
  console.log(`Something went wrong. ${event.target.errorCode}`);
};

//Success handler
request.onsuccess = function (event) {
  console.log(`Success!`);
  db = event.target.result;
};

request.onupgradeneeded = function (event) {
  console.log("An upgrade is required");

  //console log the version update
  const oldVersion = event.oldVersion;
  const newVersion = event.newVersion;
  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = event.target.result;

  // Create an object store
  db.createObjectStore("BudgetStore", { autoIncrement: true });
};
