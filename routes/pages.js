// JavaScript Document
console.log("exported the module");
const { home, about, contact } = require('../controllers/PagesControllers');

module.exports = router => {
	router.get('/', home);
	
	router.get('/about', about);
	
	router.get('/contact', contact);
};