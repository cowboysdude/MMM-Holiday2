/* Magic Mirror
 * Module: MMM-Holiday2
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const holidays = require('public-holidays');


module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting Holiday2 module");
    },

    getHolidays: function() {
        var self = this;
        var cc = this.config.country.toLowerCase();
        var lc = this.config.lang.toLowerCase();
       holidays({country: cc, lang: lc}, (error, result) => {
            self.sendSocketNotification("HOLIDAYS_RESULT", result);
       });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === 'GET_HOLIDAYS') {
            this.getHolidays(payload);
        }
    }
});
