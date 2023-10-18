const eventEmitter = require("./index");

//Subscribe for course_created event
eventEmitter.on('course_created', function (data) {
  	setTimeout(() => {
  	}, 5000);
});

//Subscribe for course_updated event
eventEmitter.on('course_updated', function (data) {
  	setTimeout(() => {
  	}, 5000);
});

//Subscribe for course_associated event
eventEmitter.on('course_associated', function (data) {
  	setTimeout(() => {
  	}, 5000);
});

//Subscribe for course_deleted event
eventEmitter.on('course_deleted', function (data) {
  	setTimeout(() => {
  	}, 5000);
});