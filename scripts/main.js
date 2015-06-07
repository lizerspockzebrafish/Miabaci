'use strict';

/**
 * bead - a bead object on the abacus
 * @param  int value     - how much value the bead is worth
 * @param  obj options   - options attribute to the bead UI such as the size/color/position of the bead
 * @param  bool canMoveUp - boolean to keep track of which direction the bead is able to move
 * @return void         
 */
var bead = function(value, options, canMoveUp) {
	this.value = value;
	this.shape = this.drawBead(options);
	this.beadAbove = null;
	this.beadBelow = null;
	this.canMoveUp = canMoveUp;
	var self = this;

	this.moveBead = function() {
		
		// depending on the bead.canMoveUp property, animation bead movement and update the canMoveUp property
		if(!self.canMoveUp) {
			//moving the bead down
			var curTransform = new WebKitCSSMatrix(window.getComputedStyle(self.shape).webkitTransform);
			TweenLite.to(self.shape, 0.3, {
				y: curTransform.m42+51
			},1.8);

			if(self.beadBelow !== null && !self.beadBelow.canMoveUp) {
				self.beadBelow.moveBead();
			}
		}
		else {
			//moving bead up
			var curTransform = new WebKitCSSMatrix(window.getComputedStyle(self.shape).webkitTransform);
			TweenLite.to(self.shape, 0.3, {
				y: curTransform.m42-51
			}, 1.8);

			if(self.beadAbove !== null && self.beadAbove.canMoveUp) {
				self.beadAbove.moveBead();
			}		
		}

	 	self.canMoveUp = !self.canMoveUp;
	}

	this.shape.addEventListener("click", this.moveBead, false);
}

/**
 * drawBead - creates a div element to represent the bead
 * @param  obj options - options attribute to the bead UI such as the size/color/position of the bead
 * @return the bead div element created
 */
bead.prototype.drawBead = function drawBead(options) {
	options = options || {};
	var dotWidth = options.dotWidth || 50,
		dotHeight = options.dotHeight || 32, 
		color = options.color || 'Brown',
		//element = options.element || document.createElement("div"),
		xPos = options.xPos || 0,
		yPos = options.yPos || 0,
		aBead;

	aBead = document.createElement('div');
	//element.appendChild(bead);
	TweenLite.set(aBead, {
		width: dotWidth,
		height: dotHeight,
		x:xPos,
		y:yPos,
		backgroundColor: color,
		borderRadius: '50% 50%',
		force3D: true,
		position: 'absolute'
	});
	return aBead;
}

/**
 * abacus - representation of the abacus board
 * @param  string abacusName - name of the abacus     
 * @param  int columns - how many columns the abacus contain
 * @param  int topBeadCount - number of beads on the top row of the abacus
 * @param  int bottomBeadCount - number of beads on the bottom row of the abacus
 * @return void 
 */
var abacus = function(abacusName, columns, topBeadCount, bottomBeadCount) {
	this.element = document.getElementById(abacusName);
	this.elementResetButton = document.getElementById(abacusName+"Reset");
	this.elementResetButton.addEventListener("click", this.reset.bind(this), false);
	this.columns = columns;
	this.topBeadCount = topBeadCount;
	this.bottomBeadCount = bottomBeadCount;
	this.topLevelNodeHeads = []; 	//TODO:create some simple SVG shape to represent a bead. For now, using CSS
	this.bottomLevelNodeHeads = [];
	
	//TODO: Update these hard coded values for bead positions on the abacus
	this.beadsXAxis = [500, 430, 357, 283, 210, 140, 65];
	this.beadYAxisSpaceTop = 20;
	this.beadYAxisSpaceBottom = 190;
	this.beadYAxisMovementTop = 71;
	//this.currVal = 0;
}

/**
 * insertBead - inserting a bead into the head of a doubly-linked list 
 * @param  bead headBead - the current head of the doubly-linked list
 * @param  bead newBead - the new bead at the head of the doubly-linked list
 * @return void
 */
abacus.prototype.insertBead = function(headBead, newBead) {
	newBead.beadBelow = headBead;
	headBead.beadAbove = newBead;
	return newBead;
}

abacus.prototype.reset = function() {
	for(var i=0; i<this.topLevelNodeHeads.length; i++) {
		var currBead = this.topLevelNodeHeads[i];
		if(currBead.canMoveUp) {
			currBead.moveBead();
		}
	}

	for(var j=0; j<this.bottomLevelNodeHeads.length; j++) {
		var currBead = this.bottomLevelNodeHeads[j];
		if(!currBead.canMoveUp) {
			currBead.moveBead();
		}
	}
}

/**
 * displayNumber - given a number, the abacus board will correctly display the configuration of the beads
 * @param  int number - the value the abacus board needs to display
 * @return void
 */
abacus.prototype.displayNumber = function(number) {

}	

/**
 * fillBeads - 
 * @return {[type]} [description]
 */
abacus.prototype.fillBeads = function() {
	//Loop through the number of columns the abacus contains
	for(var i=0; i<this.columns; i++)
	{
		var head = null;

		//Inserting the top-level beads where the initial position is the two beads aligning to the top
		for (var j=this.topBeadCount-1; j>-1; j--) 
		{
			var beadWidth = 50;
			var beadHeight = 32;
			var beadShapeOptions = {color: '#61AC27', dotWidth: beadWidth, dotHeight: beadHeight, xPos:this.beadsXAxis[i], yPos:this.beadYAxisSpaceTop+(j*beadHeight)};

			var value = Math.pow(10, i)*5;
			var newBead = new bead(value, beadShapeOptions, false);
			this.element.appendChild(newBead.shape);	

			if (head === null) {
				head = newBead;
				this.topLevelNodeHeads.unshift(head);
			}
			else {
				var insertedNewBead = this.insertBead(head, newBead);
				head = insertedNewBead;
			}
		}

		//Inserting the top-level beads where the initial position is the two beads aligning to the top
		head = null;

		for (var j=this.bottomBeadCount-1; j>-1; j--) 
		{
			var beadWidth = 50;
			var beadHeight = 32;
			var beadShapeOptions = {color: '#F44336', dotWidth: beadWidth, dotHeight: beadHeight, xPos:this.beadsXAxis[i], yPos:this.beadYAxisSpaceBottom+(j*beadHeight)};

			var value = Math.pow(10, i);
			var newBead = new bead(value, beadShapeOptions, true);
			this.element.appendChild(newBead.shape);

			if (head === null) {
				head = newBead;
			}
			else {
				var insertedNewBead = this.insertBead(head, newBead);
				head = insertedNewBead;
			}
		}

		this.bottomLevelNodeHeads.unshift(head);
	}

	// For debugging

/*	for(var i=0; i<this.topLevelNodeHeads.length; i++)
	{
		console.log("Column number:"+i);
		var currBead = this.topLevelNodeHeads[i];
		while(currBead !== null)
		{
			console.log("Bead value: ", currBead.value);
			//currBead.shape.addEventListener("click", function(){move(currBead)}, false);
			currBead = currBead.beadBelow;
		}
	}*/
}

window.onload = function() {
	var cnAbacus = new abacus("chineseAbacus", 7, 2, 5);
	cnAbacus.fillBeads();

	var jpAbacus = new abacus("japaneseAbacus", 7, 1, 4);
	jpAbacus.fillBeads();
};

