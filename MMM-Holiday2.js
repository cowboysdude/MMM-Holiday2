/* Magic Mirror
 * Module: MMM-Holiday2
 *
 * By cowboysdude
 *
 */
Module.register("MMM-Holiday2", {

    // Module config defaults.
    defaults: {
        updateInterval: 24 * 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500,
        fadeSpeed: 7,
        country: 'us',
        lang: 'en',
        days: '120',
        maxWidth: '90%',
        icon: "fa-calendar-o",
        custom: false,
        path: "modules/MMM-Holiday2/icons/24.png",
		img: ""
        
    },

    getStyles: function() {
        return ["MMM-Holiday2.css", "font-awesome.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        // Set locale.
        this.today = "";
        this.holidays = {};
        this.scheduleUpdate();
    },
    
     processHolidays: function(data) {
        this.holidays = data;
		console.log(this.holidays);
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getHolidays();
        }, this.config.updateInterval);
        this.getHolidays(this.config.initialLoadDelay);
    },

    getHolidays: function() {
        this.sendSocketNotification('GET_HOLIDAYS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOLIDAYS_RESULT") {
            this.processHolidays(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },


    getDom: function() {
    	
        var wrapper = document.createElement("table");
		wrapper.classList.add("calendar-stack");
		

        if (!this.loaded) {
            wrapper.innerHTML = "Gathering Holidays...";
            wrapper.className = "bright small";
            return wrapper;
        }
         
            if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright");
			header.setAttribute('style','text-align: left');
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
        for (var i = 0; i < this.holidays.length; i++) {
            var holiday = this.holidays[i];
			
			var today = new Date();
            var dd = today.getDate();
            var dayPlus = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var nMonth = today.getMonth() + 14;
            var yyyy = today.getFullYear();

            //Today's date 
            var todayDate = mm + '/' + dd + '/' + yyyy;
           
            
           //date string from holiday[i] returned as mm/dd/yyyy
            var dt = new Date(holiday.start);

            var allDate = (dt.getMonth() + 1) + "/" +  dt.getDate()+ "/" +dt.getFullYear();
            var DateDiff = {
                inDays: function(d1, d2) {
                    var t2 = d2.getTime();
                    var t1 = d1.getTime();
                    return parseInt((t2 - t1) / (24 * 3600 * 1000));
                },
            }
            var d1 = new Date(todayDate);
            var d2 = new Date(allDate);
			
        var holidayWrapper = document.createElement("tr");
      
        var symbolWrapper = document.createElement("td");
        if (this.config.img != "") {
        var img = document.createElement("img");
        img.classList.add("photo");
        img.src = "modules/MMM-Holiday2/icons/"+this.config.img; 
        symbolWrapper.appendChild(img);
	    holidayWrapper.appendChild(symbolWrapper);	 
        } else {
        var symbol = document.createElement("i");
		symbol.classList.add("symbol");
         if (todayDate != allDate){
        symbol.classList.add("fa", this.config.icon, "symbol");
		} else {
		symbol.classList.add("fa", "fa-bell-o", "icon");
		}
		symbolWrapper.appendChild(symbol);
	    holidayWrapper.appendChild(symbolWrapper);
		}
        
         
        var HolidayColumn = document.createElement("td");   	
	     if (this.holidays.length > 0) {
          if (DateDiff.inDays(d1, d2) > -1 && DateDiff.inDays(d1, d2) <= this.config.days) {
		   if (todayDate === allDate){
		HolidayColumn.classList.add("bright", "xsmall", "today","row");	
		HolidayColumn.innerHTML = "<font color=#ece96a>&nbsp;&nbsp;<b>"+allDate + "</b> ~ " + holiday.summary + " Today</font>";	
		} else {
		HolidayColumn.classList.add("bright", "xsmall", "holiday","row");	
			if (DateDiff.inDays(d1,d2) == "1"){
        HolidayColumn.innerHTML = "&nbsp;&nbsp;<b>"+allDate + "</b> ~ " + holiday.summary + " tomorrow!";		
			} else {
		HolidayColumn.classList.add("bright", "xsmall", "holiday","row");
        HolidayColumn.innerHTML = "&nbsp;&nbsp;<b>"+allDate + "</b> ~ " + holiday.summary + " In <font color=#ffffff>" + DateDiff.inDays(d1, d2) + "</font> days";
        }		
		}
        holidayWrapper.appendChild(HolidayColumn);
        wrapper.appendChild(holidayWrapper);
        }
        } else {
	    var HolidayColumn = document.createElement("div");
        HolidayColumn.classList.add("bright", "xsmall");
		HolidayColumn.innerHTML = "No Upcoming Holidays";	
        wrapper.appendChild(HolidayColumn);
        }
         }
        
        return wrapper;
    },
});
