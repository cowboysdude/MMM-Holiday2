/* Magic Mirror
 * Module: MMM-Holiday2
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
// returns an object which CONTAINS a function (is NOT the function itself)
const l = require('public-holidays');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting Holiday2 module");
        console.log(" lholidays="+typeof l.getHolidays)
    },

    getHolidays: async function() {
    console.log("in getHolidays")
    var cc = this.config.country.toLowerCase();
    var lc = this.config.lang.toLowerCase();
    const options = {
        country: cc,
        lang: lc
    };
    try {
        console.log("calling library")
        result = await l.getHolidays(options)
    } catch (error) {
        console.error(error)
    }
    if (result)
        this.sendSocketNotification("HOLIDAYS_RESULT", result);
},

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === 'GET_HOLIDAYS') {
            this.getHolidays();
        }
    }
});
