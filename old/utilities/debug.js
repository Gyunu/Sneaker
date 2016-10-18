var debuglevels = {
	level: {
		fresh: true,
		warn: true,
		error: true,
		stack: true,
		log: true
	}
};

var Debug = {
	log: function(message, level) {
			if(true === debuglevels.level[level]) {
				var date = new Date().toISOString();
					console.log(level.toUpperCase() + " " + date + ": " + message);
			}
	},
  off: function() {
		Debug.log = function() {};
	}
};

module.exports = Debug;
