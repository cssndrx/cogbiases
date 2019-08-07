function aside($widget1, $widget2){
	if (_.isString($widget1)){
		$widget1 = text($widget1);
	}

	// wrap $widget1 in an aside and return the new widget
	var $container = $('<div style="position:relative;">');

	var $aside = $('<div class="aside">').css('left', $('#container').width() + 8);
	$aside.append($widget2);

	$container.append($widget1).append($aside);
	return $container;
}

function header(text){
	return $('<h3>').text(text);
}

// Currently can only match one template per string (figure out how to do multiple matches)
function templated(string){
	var match = string.match(/{{(.+?)}}/);
	if (match !== null){
		// 'ee{{abc}}dd'.match(/{{(\w+)}}/)
		// returns... ["{{abc}}", "abc"]
		console.log('match ' + match);
		var converted = eval(match[1]);
		return string.replace(match[0], converted);
	}

	// If the string contains $$ it uses MathJax, so we need to tell it to render
	// Do this with a delay so the widget makes it on the screen before Mathjax tries to update
	if (string.indexOf('$$') > -1){
		setTimeout(function(){
			MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
		}, 50);
	}

	return string;
}

function add_to_story($widget){
	var $container = $('#container');
	$container.append($widget);
}

function next_with_delay(num_ms){
	return function(){
		setTimeout(next, num_ms);
	}
}

function process_story_item(story_item){
	var $widget;
	if (_.isString(story_item)){
		// Strings are just allowed for convenience
		$widget = text(story_item);
		add_to_story($widget);
		next();
	} else if (story_item instanceof jQuery){
		$widget = story_item;
		add_to_story($widget);

		if (!$widget.hasClass('interactive')){
			next();
		}
	} else if (_.isFunction(story_item)){
		$widget = story_item();
		if (_.isUndefined($widget)){
			console.log('function returned nothing');
			return;
		}
		else if (!($widget instanceof jQuery)){
			console.error('function did not return a widget');
			debugger;
		}
		add_to_story($widget);
		if (!$widget.hasClass('interactive')){
			next();
		}
		// interactive widgets are responsible for calling next()
	}
	else {
		console.error('Invalid story_item type.');
	}
}

/*
* Renders window.story for the current value of story_ind
*/
function next(){
	story_ind++;
	console.log('@next(), story_ind now ' + story_ind);

	if (story_ind < story.length){
		var story_item = story[story_ind];
		process_story_item(story_item);
	}

	// Scroll down a little so the player notices something was added
	//$('html, body').animate({scrollTop: '+=50px'}, 400);
}

/*
* Takes either a list of choices or an object (choice -> handler function) of choices as an arguments list
* Returns a function that when called, returns a list of widgets to be rendered
*/
function choices(){
	var $widget = $('<div class="interactive">');
	if (arguments.length == 1 && _.isObject(arguments[0])){
		// is an object
		_.pairs(arguments[0]).forEach(function(pair){
			$choice = button(pair[0]);
			$choice.click(function(){
				pair[1]();
				$widget.children().off();
			});
			$widget.append($choice);
		});
	} else {
		// is a list of choices
		var choices = Array.prototype.slice.call(arguments);
		choices.forEach(function(choice){
			var $choice = button(choice);
			$choice.click(function(){
				next();
				$widget.children().off();
			});
			$widget.append($choice);
		});

	}
	return $widget;
}

/*
* Like choices(), but more than one button can be clicked.
*/
function multiselect_choices(){
	var $widget = $('<div class="interactive">');
	if (arguments.length == 1 && _.isObject(arguments[0])){
		// is an object
		_.pairs(arguments[0]).forEach(function(pair){
			$choice = button(pair[0]);
			$choice.click(function(){
				pair[1]();
				$(this).off();
//				$widget.children().off();
			});
			$widget.append($choice);
		});
	} else {
		// is a list of choices
		var choices = Array.prototype.slice.call(arguments);
		choices.forEach(function(choice){
			var $choice = button(choice);
			$choice.click(function(){
				$(this).off();
				next();
//				$widget.children().off();
			});
			$widget.append($choice);
		});

	}
	return $widget;
}


/*
* Returns a button (bind your own click event).
*/
function button(text){
	return $('<button>').html(text);
}

/*
* Returns a widget for narrative text
*/
function text(string){
	return $('<div class="narrator-text">').html(templated(string));
}

/*
* Returns a widget for sentient beings that say text
*/
function says(being, text){
	if (arguments.length < 2){
		console.log('more args needs for says()!');
	}

	var $widget = $('<div class="says-container">');

	$widget.append($('<span class="says-name">').text(being));
	$widget.append($('<span class="says-text">').html(templated(text)));
	return $widget;
}

/*
* Returns an image widget given its filename
*/
function image(name, css, title){
	var $img = $('<img>').attr('src', 'images/' + name);
	add_progress_image($img, name, title);

	// In-story only formatting
	$img.css({'margin-top': '8px', 'margin-bottom': '8px'});
	return _.isUndefined(css) ? $img : $img.css(css);
}

/*
* Adds an image to the visual progress bar indicator
*/
function add_progress_image($img, name, title){
	var $widget = $('<div style="text-align:center; margin-top: 12px; position:relative;">');
	var $clone = $img.clone();
	$clone.addClass('silhouette').css({
		'max-width': 50,
		'max-height': 60
	});

	// special cases
	if (name == 'moneybag.png'){
		$clone.width(38);
	} else if (name == 'lair.png'){
		$clone.height(50);
	} else if (name == 'goofy.png'){
		$clone.width(25);
	}

	$widget.append($clone);

	if (title !== undefined){
		var $tooltip= $('<div style="position:absolute; left:50px; top:10px; font-size: 12px; padding: 8px; color:white; background-color: #414141">').text(title);
		$widget.mouseenter(function(){
			$widget.append($tooltip);
		}).mouseleave(function(){
			$tooltip.remove();
		});
	}

	$widget.mouseenter(function(){
		$clone.removeClass('silhouette');
	}).mouseleave(function(){
		$clone.addClass('silhouette');
	});
	$('#progress-bar').append($widget);
}
// todo: add links for jumping backwards and forwards in the story
// todo: make the image brighten once we reach the point


/*
* Multiple choice that blocks until the correct answer is chosen.
*/
// blocking_choices({
// 	choices: ['Snowbar', 'Bezland'],
// 	correct: 'Bezland',
// 	wrong_msgs: ['Not sure that we should head there.'],
// }),
function blocking_choices(config){
	var $widget = $('<div class="interactive">');
	var $feedback = $('<div>');

	// make choices dict, where correct answer moves forward
	// other answers add wrong_msg to the widget
	function wrong(){
		$feedback.text(rand_select(config.wrong_msgs));
	}
	function right(){
		$feedback.hide();
		next();
	}

	var choice_list = config.choices.map(function(choice){
		return choice == config.correct ? [choice, right] : [choice, wrong];
	});

	$widget.append(multiselect_choices(_.object(choice_list)));
	$widget.append($feedback);
	return $widget;
}

/*
* Probability input that blocks until approx the correct answer is submitted
*/
// blocking_prob_input({
// 	desired_answer: .54,
// 	wrong_msgs: ['Not quite'],
//  epsilon: .01
// })
function blocking_prob_input(config){
	var $widget = $('<div class="interactive">');
	var $input = $('<input type="text">');

	$input.keydown(function(e){
		if (e.keyCode == 13){
			var val = parseFloat($input.val());

			if (approx(config.desired_answer, val, config.epsilon)){
				$feedback.hide();
				next();
			}else if (val < 0 || val > 1){
				$feedback.text('Probabilities must be between 0 and 1').show();
			} else{
				$feedback.text(rand_select(config.wrong_msgs)).show();
			}
		}
		// http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
        $feedback.hide();
	});

	$widget.append($input);
	var $feedback = $('<div>');
	$widget.append($feedback.hide());

	return $widget;
}

function newspaper(text, css){
	var $newspaper = $('<div>').text(text).addClass('newspaper');
	return arguments.length == 1 ? $newspaper : $newspaper.css(css);
}

function apply_defaults(config, defaults){
	_.pairs(defaults).forEach(function(pair){
		var key = pair[0];
		var value = pair[1];
		if (_.isUndefined(config[key])){
			config[key] = value;
		}
	});
}

function nchoice(){
	var $widget = choices('Next');
	$widget.click(function(){
		$(this).hide();
	})
	return $widget;
}

// Combines an arbitrary number of widgets into a single widget.
function combine(){
	if (arguments.length == 0){
		console.log('did not pass anything into combine()!');
	}
	var $widget = $('<div>');
	for (var i=0; i<arguments.length; i++){
		$widget.append(arguments[i]);
	}
	return $widget;
}
