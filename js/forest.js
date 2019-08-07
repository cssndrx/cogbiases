const forestIntro = [
{
	choices: [
	{
		name: '10% chance of getting lost in taking path A',
		feedback: 'That\'s right. In this forest, you definitely want to minimize the chance of getting lost.',
		right: true,
	},

	{
		name: '20% chance of getting lost in taking path B',
		feedback: 'Why are you maximizing the chance of getting lost? Try again.'
	}
	]
},


{
	text: 'You journey deeper into the forest. Another fork.',
	choices: [
	{
		name: 'Path A: 10% chance of getting lost',
		feedback: 'This problem is the same as the first, because the probability of finding the right way = 1 - the probability of getting lost.',
		right: true,
	},

	{
		name: 'Path B: 80% chance of finding the right way',
		feedback: 'Hm, nope. Try again.'
	}
	]
},

{
	text: 'Even deeper into the forest, you see a new sign.',

	choices: [
	{
		name: 'Path A: 4 in 5 times you\'d get lost',
		feedback: '4 in 5 means you would be getting lost 80% of the time! Try again.',
	},

	{
		name: 'Path B: 3 in 4 times you\'d get lost.',
		feedback: 'Correct. It is better to get lost 75% of the time, than 80% of the time. ',
		right: true,
	}
	]
},

// todo: make the odds thing better
{
	text: 'You journey on, until you are faced with your final problem.',

	choices: [
	{
		name: 'Path A: 4 : 5 odds you\'d get lost',
		feedback: 'Nope! Try again.',
	},

	{
		name: 'Path A: 3 : 4 odds you\'d get lost',
		feedback: 'Yes. Notice that 4 : 5 odds of something happening is very different from 4 in 5 times. With 4 : 5 odds, it\'s fairly 50-50, slightly in favor of not getting lost. 4 : 5 odds means that for every 5 moneybags you stake, you would earn 4 moneybags if the event happens.',
		right: true,
	}
	]
},

];


/*
Progression of problems:

- (A) 2 choice EV vs constant
- (B) 2 choice EV vs 2 choice EV
- (C) 3 choice EV
- (D) 4 choice EV
- (E) distribution vs distribution
- (F) prob of a distribution vs prob of a distribution

*/


// if you make a bad ev decision:
// - dont let you proceed (maybe this in the beginning)
// - let you proceed bu with a gnawing feeling (maybe this after it gives up?) -- start with implementing this
// - show you the answer by visualizing probs? (and this after it gives up)

// The forest lets you proceed, but you're left with the gnawing sense
// that you made the wrong decision.


// if you die:
// - restart + forest is longer

// ------------

// interludes:
// pity fairy and the high variance play

// minsky paradox: people spend most time optimizing something that doesn't  matter
// can teach this by adding unit for the really long fued between animals
// choices: Proceed A, Proceed B, More Info


// ----------

// quirks:


// some things need to be eaten immediately
// vs some things go into inventory and get consumed whenever it can
// be consummed at full potential


// ------------

// problem thematic ideas:


// what things cause damage in video games
// terrain
// monsters
// illness
// failure

// berries/mushrooms/plants that probabilistically heal you
// animals/physical obstacles that probabilistically hurt you


// -----


// problem flow:


// branching progressions
// equivlaence between
// X%, x:y chance, X in Y times









// Prompts, e.g. "You are really cold...", live in the template for 
// formatting flexibility. The decision is rendered like:
// 
// You are really cold. Do you...
//
// Try to start a fire:
// 20% chance: +15 HP (warmth)
// 60% chance: 0HP (you fail to start the fire)
// 20% chance: -20 HP (injury from trying to start the fire)

// Not bothering:
// 100% chance: -10HP (cold)

// [[Try to start a fire]] [[Don't even bother]]

// problem.name
// problem.choices
// choice.name
// choice.outcomes
var forestProblems = [

// Tricky EV: you can't more than die.
// You find an attractive mushroom. What do you do?
// todo: add explanation here if the user is wrong.
// {
// 	name: 'mushroom',
//  	choices: [
// 		{
// 			name: 'Eat',
// 			outcomes: [
// 				{certainty: 0.99, hp: 10}, 
// 				{certainty: 0.01, hp: -10000},
// 				],
// 		},
// 		{
// 			name: 'Don\'t eat',
// 			outcomes: [{certainty: 1.0, hp: 0}],
// 		},
// 	]
// },


// (A) 2 choice EV vs constant

// 2 choice EV vs constant
// You are really cold. Do you...
// {
// 	name: 'a-fire',
// 	images: ['fire.png'],
//  	choices: [
// 		{
// 			name: 'Try to start a fire',
// 			outcomes: [
// 				{certainty: 0.4, hp: 8, caption: 'warmth'}, 
// 				{certainty: 0.6, hp: 0, caption: 'you fail to start the fire'}
// 				],
// 		},
// 		{
// 			name: 'Don\'t even bother',
// 			outcomes: [{certainty: 1.0, hp: -10, caption: 'cold'}],
// 		},
// 	]
// },

// (A) 2 choice EV vs constant
// You are really thirsty:
// Don't drink the water: -12HP (thirst)
// Drink the water in the stream
// 70% chance: +5 HP (nourishment)
// 30% chance: -30HP (dysentery)

// {
// 	name: 'a-stream',
// 	images: ['stream1.png'],
// 	intro: 'You find yourself really thirsty. Do you...',
//  	choices: [
// 		{
// 			name: 'Drink the water in the stream',
// 			outcomes: [
// 				{certainty: 0.7, hp: 5, caption: 'nourishment'}, 
// 				{certainty: 0.3, hp: -30, caption: 'dysentery'}
// 				],
// 		},
// 		{
// 			name: 'Don\'t drink the water',
// 			outcomes: [{certainty: 1.0, hp: -12, caption: 'thirst'}],
// 		},
// 	]
// },

// (A) 2 choice EV vs constant (0)
// mushroom: 
// 70% chance: heals +20HP
// 30% chance: poisons -40HP
// [[Eat]] [[Don't eat]]

{
	name: 'a-mushroom',
	images: ['mushroom1.png'],
	intro: 'Ooh look a mushroom! Do you...',
 	choices: [
		{
			name: 'Eat',
			outcomes: [
				{text: 'heals', certainty: 0.7, hp: 20}, 
				{text: 'poisons', certainty: 0.3, hp: -40}
				],
		},
		{
			name: 'Don\'t eat',
			outcomes: [{certainty: 1.0, hp: 0}],
		},
	]
},

// (A) 2 choice EV vs constant
// Now you are really hungry

// 2 choice EV vs constant
// you are so hungry that you have to eat something
// or you just lose X HP from hunger


{
	name: 'a-hungry',
	images: ['mushroom2.png', 'berry1.png'],
	intro: 'You find yourself hungrily staring at the mysterious mushroom and fruit in the forest. Do you...',
 	choices: [
		{
			name: 'Eat mushroom',
			outcomes: [
				{text: 'heals', certainty: 0.5, hp: 20}, 
				{text: 'poisons', certainty: 0.5, hp: -40}
				],
		},
		{
			name: 'Eat berry',
			outcomes: [
				{text: 'heals', certainty: 0.7, hp: 20}, 
				{text: 'poisons', certainty: 0.3, hp: -40}
				],
		},
		{
			name: 'Don\'t eat',
			outcomes: [{certainty: 1.0, hp: -5}],
		},
	]
},


// ^ turn one of these into 3 parts/ 1part?
// todo: come up with more basic rv questions so we can  do things like
// 3 parts chance: heals +20HP
// 1 part chance: poisons -40HP




// (B) 2 choice EV vs 2 choice EV


// (B) 2 choice EV vs 2 choice EV
// You're really hungry. You feel compelled to eat something.

{
	name: 'b-berry-or-mushroom-1',
	images: ['berry2.png', 'mushroom3.png'],
	intro: 'You\'re really hungry. You feel compelled to eat something.',
 	choices: [
		{
			name: 'Eat berry',
			outcomes: [
				{certainty: 0.2, hp: 10}, 
				{certainty: 0.8, hp: -4}, 
			],
		},
		{
			name: 'Eat mushroom',
			outcomes: [
				{certainty: 0.7, hp: 20},
				{certainty: 0.3, hp: -5},
			],
		},
	]
},


// You're really a compulsive eater! You gotta eat something.
// Which will it be?
{
	name: 'b-berry-or-mushroom-2',
	images: ['berry3.png', 'mushroom4.png'],
 	choices: [
		{
			name: 'Eat berry',
			outcomes: [
				{certainty: 0.2, hp: 10}, 
				{certainty: 0.8, hp: -4}, 
			],
		},
		{
			name: 'Eat mushroom',
			outcomes: [
				{certainty: 0.7, hp: 20},
				{certainty: 0.3, hp: -5},
			],
		},
	]
},

// (C) 3 choice EV

// (C) Unfortunately, you encounter a bear who had bad day.

// Scramble down cliffs to escape: damage -10HP
// Try to scare bear off: 
// 20% chance: damage 0 (bear is scared of tiny human)
// 50% chance: damage -2HP (bear thinks tiny human funny and claps human on the back)
// 30% chance: damage -40HP (bear not amused)

{
	name: 'c-bear-or-cliff',
	images: ['bear3.png', 'cliff1.png'],
 	choices: [
		{
			name: 'Scare bear',
			outcomes: [
				{certainty: 0.2, hp: 0, caption: 'bear scared by tiny human'},
				{certainty: 0.5, hp: -5, caption: 'bear think tiny human funny, claps tiny human on back'},
				{certainty: 0.3, hp: -40, caption: 'bear not amused'},
			],
		},
		{
			name: 'Scramble down cliff',
			outcomes: [
				{certainty: 0.8, hp: -10, caption: 'hurt leg'}, 
				{certainty: 0.2, hp: -20, caption: 'hurt head'}, 
			],
		},
	]
},

// (D) 4 choice EV

// follow bunny rabbit A vs bunny rabbit B

// You encounter two different bunny rabbits who wish to guide you.
// They are arguing with eachother. 
// I'm higher EV! one claims.
// No, I am!! 
// Whom do you follow?
{
	name: 'd-bunny-rabbits',
	images: ['bunny1.png', 'bunny2.png'],
 	choices: [
		{
			name: 'Bunny A',
			outcomes: [
				{certainty: 0.8, hp: -10}, 
				{certainty: 0.2, hp: -20}, 
				{certainty: 0.8, hp: -10}, 
				{certainty: 0.2, hp: -20}, 
			],
		},
		{
			name: 'Bunny B',
			outcomes: [
				{certainty: 0.8, hp: -10}, 
				{certainty: 0.2, hp: -20}, 
				{certainty: 0.8, hp: -10}, 
				{certainty: 0.2, hp: -20}, 
			],
		},
	]
},


// Phew, good thing you followed me because now I can tell you about
// distributions. 

// You notice how the number of outcomes are increasing? 
// Well, it's possible to visualize them as a distribution

// Do the bunny example as distributions
// [[distribution]]

// [[visual-ev-game]]


// Now you can see choices as distributions...
// please make it out of the forest safe!

// [[Thank you, bunny]]


// (E) distributions

// distribution vs distribution
// paths are guarded by two different spiders
// which of two spiders would you rather encounter

// After the bunny leaves, you feel a surprising sense of dread.
// Do you holler for help? or remain silent?

{
	name: 'e-holler-for-help',
	renderAsDistribution: true,
	images: ['howl.png', 'silent.png'],
 	choices: [
		{
			name: 'Holler',
			outcomes: [
				{certainty: 0.2, hp: -5}, 
				{certainty: 0.6, hp:-3}, 
				{certainty: 0.2, hp:-2}
			], 
		},

		{
			name: 'Don\'t holler',
			outcomes: [
				{certainty: 0.2, hp: -5}, 
				{certainty: 0.6, hp:-3}, 
				{certainty: 0.2, hp:-2}
			], 
		},
	],
},


// (F) prob of a distribution vs prob of a distribution


// // You can face X, which has a 10% chance of attacking.
// // If X attacks, it is by [[this dist]].

// // Or, you can face Y, which has a 30% chance of attacking.
// // If Y attacks, it is by [[this dist]].


// You chose Face X.

// And...

// It doesn't attack.

// It decides to attack.
// You lose X HP.

// todo: may want to pull this into a component because there's a bit of logic.

{
	name: 'face-x-or-y',
	images: ['monster1.png', 'monster2.png'],
 	choices: [
		{
			name: 'Face X',
			outcomes: [
				{certainty: 0.1, hp: [{certainty: 0.2, hp: -5}, {certainty: 0.6, hp:-3}, {certainty: 0.2, hp:-2}]}, 
				{certainty: 0.9, hp: 0}, 
			],
		},

		{
			name: 'Face Y',
			outcomes: [
				{certainty: 0.3, hp: [{certainty: 0.2, hp: -7}, {certainty: 0.6, hp:-1}, {certainty: 0.2, hp:-4}]}, 
				{certainty: 0.7, hp: 0}, 
			],
		},
	]
},



];
//forestProblems = _.keyBy(forestProblems, 'name');



// e.g. Item({
// 	name: 'berry',
// 	outcomes: [{certainty: 1.0, hp: +10}],
//  description: 'Heals +10HP in a bind', 
// 	image: 'berry.jpg',
// 	storeable: true, //default: false
// })
function Item(item){
	// Apply default values
	item = _.defaults(item, {
		description: '',
		storeable: false,
	});

	return item;
}

var forestItems = {

	'spirit-berry': {
		name: 'berry',
		outcomes: [{certainty: 1.0, hp: 10}],
		description: 'Heals +10HP in a bind',
		image: 'berry.jpg',
		storeable: true,
	},

};
forestItems = _.mapValues(forestItems, v => Item(v));


// outcomes = [
// 	{certainty: 0.4, hp: 15, caption: 'warmth'}, 
// 	{certainty: 0.6, hp: 0, caption: 'you fail to start the fire'}
// ]
// outcomes is a list of {certainty: __}
function drawFromOutcomes(outcomes){
	var ind = drawIndFromOutcomes(outcomes);
	return outcomes[cumsum_ind];
}

function drawIndFromOutcomes(outcomes){
	var certainties = _.map(outcomes, 'certainty');
	if (!approx(sum(certainties), 1.0)){
		console.error('certainties for outcomes did not sum to 1: ' + outcomes);
	}

	var rand = Math.random();
	var cumsum_certainties = cumulativeSum(certainties);
	var cumsum_ind = 0;
	while (cumsum_certainties[cumsum_ind] < rand){
		cumsum_ind++;
	}
	return cumsum_ind;
}

// By the way, if you're acutally in a survival situation: 
// shelter
// water
// fire
// food
// in that order
