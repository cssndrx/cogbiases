
// // Note: Adding a special question requires adding an explanation in the
// // monk-interaction template.
// var specialMonkQuestions = [
// {
//   // uniform prior
//   id: 'uniform-prior',
//   question: 'Your quest is more likely to proceed through...',
//   answers: ['Ice Mountain', 'Crevasse of Doom'],
// },

// {
//   // priors
//   // http://www.bbc.com/earth/story/20150827-the-wettest-place-on-earth
//   // dang, there's some place where it rains 320 days a year.
//   id: 'rain-prior',
//   question: 'Will it rain in this town tomorrow?',
//   answers: ['Yes', 'No'],
//   correct: ['No'],
// },
// {
//   id: 'brenda-question',
//   question: 'Which is more likely?',
//   answers: ['Brenda is a millenial', 'Brenda is a millenial who spends too much time worrying about what her friends think of her and eats avocado toast'],
//   correct: ['Brenda is a millenial']
// },

// {
//   id: 'linda-question',
//   question: 'Linda is 31 years old, single, outspoken, and very bright. She majored in philosophy. As a student, she was deeply concerned with issues of discrimination and social justice, and also participated in anti-nuclear demonstrations. Which is more likely?',
//   answers: ['Linda is a bank teller', 'Linda is a bank teller and is active in the feminist movement.'],
//   correct: ['Linda is a bank teller']
// }

// ];


// // standard questions

// // https://www.urmc.rochester.edu/encyclopedia/content.aspx?contenttypeid=1&contentid=1169
// var basicMonkQuestions = [{
//   question: 'Which of the following compounds can be used to kill bedbugs?',
//   answers: ['Ginseng', 'Diatomaceous earth'],
//   correct: ['Diatomaceous earth']
// },

// {
//   question: 'Which of the following is used as a tea for reducing anxiety?',
//   answers: ['Tulsi', 'Gingko'],
//   correct: ['Tulsi'],
// },

// {
//   question: 'Which of the following has antimicrobial properties?',
//   answers: ['Garlic', 'Bull thistle'],
//   correct: ['Garlic']
// },

// {
//   question: 'Which of the following is older?',
//   answers: ['Etruscan Gold Book', 'Madrid Codex'],
//   correct: ['Etruscan Gold Book'],
//   images: ['etruscan_gold_book.jpg', 'madrid_codex.jpg']
// },

// {
//   question: 'Which of these plants is edible?',
//   answers: ['Cat tail', 'Angel\'s Trumpet'],
//   correct: ['Cat tail'],
//   images: [],
//   extra: ['The root of cat tail is edible']
// }, 

// // https://www.foodandwine.com/fwx/slideshow/wild-berries-you-can-eat-without-dying#saskatoon-berries
// {
//   question: 'Which of these berries is poisonous?',
//   answers: ['Poke weed', 'Dew berries'],
//   correct: ['Poke weed'],
//   images: [],
// }, 


// // stopped here: adding more questions -- will people be bored of these herbalism questions?
// // just generate more questions and play test


// /*

// How many published books?
// 130 million

// https://wiganlanebooks.co.uk/blog/interesting/10-of-the-oldest-known-surviving-books-in-the-world/
// Which book is older?
// Etruscan Gold Book *
// Madrid Codex


// edible plants list
// https://matteroftrust.org/14760/62-edible-wild-plants-that-you-didnt-know-you-can-eat

// poisonous plant list
// https://www.backpacker.com/skills/12-deadly-plants-you-should-never-eat

// should the herbalism ones use pictures instead of words?


// todo: pull out herbalism book
// which plant is used for X ? 


// speed of animals
// https://www.conservationinstitute.org/10-fastest-animals-on-earth/

// stopped here: adding visual plant questions

// */

// ];


// //basicMonkQuestions = [];
// //specialMonkQuestions = [specialMonkQuestions[2]];

// var monkQuestions = (function(){
//   // Add type attribute to all datums.
//   basicMonkQuestions.forEach(d => d['type'] = 'basic');
//   specialMonkQuestions.forEach(d => d['type'] = 'special');
//   return _.concat(basicMonkQuestions, specialMonkQuestions);
// })();


Vue.component('fair-bet-viz', {
  props: {
    certainty: { type: Number, default: 0.5 },
  },
  computed: {
    numTimesRightOutOf10: function(){
      return Math.round(this.certainty * 10);
    },
    numLoseIfWrong: function(){
      const params = this.$root.paramsFromCertainty(this.certainty);
      return params.numLoseIfWrong;      
    },
    fulcrumStyle: function(){
      return {height: lerp(this.certainty, 0.5, 1.0, 200, 400) + 'px'};
    },
  },
  methods: {
    wobble: function(){
      this.$refs['fulcrum'].wobble(1);      
    }
  },
  template: '#fair-bet-viz-template'
});


Vue.component('monk-dual-quiz', {
  props: {
    certainties: {
      type: Array, 
      default: function(){
        return [0.5, 0.67, 0.8, 0.9, 0.99];
      },
    },
  },
  data: function(){
    return {
      activeInd: 0,
      isEndGame: false,
      
      monkAnswer: null,
      isMonkThinking: false,
      params: null,
    }
  },

  watch: {
    activeInd: function(){
      this.$root.play('swish');
    },
  },

  methods: {
    betSubmit: function(params){
      this.params = params;
      this.isMonkThinking = true;
    },
    showAnswer: async function(){
      var params = this.params;
      // check if the number of moneybags is correct
      const certainty = this.certainties[this.activeInd];
      const user_answer = params.numLoseIfWrong;
      const correct_answer = Math.round(this.$root.paramsFromCertainty(certainty).numLoseIfWrong); 

      const user_correctness = user_answer == correct_answer;

      this.isMonkThinking = false;
      this.monkAnswer = user_correctness ? 'Correct': 'Try again';

      // const sound = user_correctness ? 'swish' : 'incorrect';
      // this.$root.play(sound);

      if (user_correctness === true){
        await wait(1000);
        this.activeInd++;
        this.monkAnswer = null;

        if (this.activeInd >= this.certainties.length){
          this.isEndGame = true;
        }          
      } else {
        this.$root.play('incorrect');
      }
    },
    leftWobble: async function(){
      await this.$refs['fulcrum'].leftWobble();
    },
    rightWobble: async function(){
      await this.$refs['fulcrum'].rightWobble();
    },
  },
  template: '#monk-dual-quiz-template',  
});


Vue.component('monk-intro', {
  data: function(){
    return {
      hyderabadCertainty: null,
      hyderabadBetParams: null,
    };
  },
  computed: {
    hyderabadCertaintyParams: function(){
      return this.$root.paramsFromCertainty(this.hyderabadCertainty);
    },

    isUserCalibrated: function(){
      if (this.hyderabadCertainty === null || this.hyderabadBetParams === null){
        return null;
      }

      var floatLoseMoneybags = this.hyderabadCertaintyParams.numLoseIfWrong;
      var intLoseMoneybags = this.hyderabadBetParams.numLoseIfWrong;

      return Math.round(floatLoseMoneybags) === intLoseMoneybags;
    },

    fairBetVizCertainty: function(){
      return this.hyderabadCertainty == 0.5 ? 0.8 : this.hyderabadCertainty;
    }
  },
  methods: {
    hyderabadCertaintySubmit: function(params){
      this.hyderabadCertainty = params.certainty;
      this.show('monk-hyderabad-bet');
    },
    hyderabadBetSubmit: function(params){
      this.hyderabadBetParams = params;
      this.show('monk-hyderabad-dual');
    },
    show: show, 
  },
  template: '#monk-intro-template',
});

Vue.component('monk-game', {
  props: {
    numMoneybagsNeeded: {type: Number, default: 10},
    monkQuestions: {type: Array, default: () => monkQuestions},
  },
  data: function(){
    return {
      questionInd: 0, // index of the active question
      numUserMoneybags: 0,

      gameOutcome: null, // 'userWon', 'monkOutOfQuestions'
      userWantsToProceedPoor: null,
      isGameComplete: false,
    };
  },
  computed: {
    // todo curiosity: when does computed trigger?
    visibleQuestions: function(){
      // Return slice from [0, questionInd] inclusive.
      // Slice is safe from array out of bounds errors.
      return this.monkQuestions.slice(0, this.questionInd+1);
    },
  },
  watch: {
    visibleQuestions: scrollWindow,
    gameOutcome: scrollWindow
  },
  methods: {
    show: show,
    onQuestionComplete: function(params){
      this.numUserMoneybags += params.numMoneybagsGained;

      if (this.numUserMoneybags == this.numMoneybagsNeeded){
        // todo: trigger game end
        this.gameOutcome = 'userWon';        
      } else if (this.questionInd == this.monkQuestions.length){
        // todo: trigger game end
        this.gameOutcome = 'monkOutOfQuestions';
      } else {
        this.questionInd++;        
      }
    },
    completeGame: function(){
      this.$emit('monk-game-complete'); // todo: just call this.$root.show on the next elt.
    }
  },
  template: '#monk-game-template'
});


Vue.component('fulcrum', {
  props: {
    width: {type: Number, default: 400},
    certainty: {type: Number, default: null},
  },

  data: function(){
    return {
      numLeftRows: 0, 
      numRightRows: 0, 
      shouldLeftWobble: false,
      shouldRightWobble: false,

      animationTime: 500,
      betweenAnimationTime: 200,
    };
  },
  computed: {
    percent: function(){
      if (!this.certainty){
        return '';
      }
      const params = this.$root.paramsFromCertainty(this.certainty);
      return params.percent;
    },
    fulcrumStyle: function(){
      const certainty = this.certainty || 0.5;
      return {left: (this.width*certainty - 50) + 'px'};
    }
  },
  methods: {
    wobble: async function(num_times){
      for (var i=0; i<num_times; i++){
        await this.leftWobble();
        await this.rightWobble();
      }
    },
    leftWobble: async function(){
      this.shouldLeftWobble = true;        
      await wait(this.animationTime);
      this.shouldLeftWobble = false;
      await wait(this.betweenAnimationTime);      
    },

    rightWobble: async function(){
      this.shouldRightWobble = true;        
      await wait(this.animationTime);
      this.shouldRightWobble = false;
      await wait(this.betweenAnimationTime);      
    }
  },

  template: '#fulcrum-template'
});


Vue.component('moneybag', {
  props: {
    color: {type: String, default: 'brown'},
    number: {type: Number, default: 1},
    width: {type: Number, default: 20},
    isHorizontal: {type: Boolean, default: true},
  },
  computed:{
    // e.g. 0.3, if numLoseIfWrong == 2.3.
    positiveFraction: function(){
      return this.number - Math.floor(this.number);
    },

    // {width: '10px', height:'30px', top:'-4px'}
    fractionalCoverStyle: function(){
      // compute the styling of a white square that is aligned right
      // which creates the illusion of the fractional moneybag.
      const fudge = 4;
      return {
        width: (1-this.positiveFraction) * this.width + 'px',
        height: this.width * 236/200 + fudge + 'px',
      };
    },
  },
  template: '#moneybag-template'
});

Vue.component('fair-bet', {
  props: {
    numWinIfRight: {type: Number, default: 1},
    numLoseIfWrong: {type: Number, default: 1},
    showCertainty: {type: Boolean, default: true},
  },
  computed:{
    percent: function(){
      var params = this.$root.paramsFromBet(this.numWinIfRight, this.numLosingMoneybags);
      return params.percent;
    },
  },
  template: '#fair-bet-template'
});

// static moneybag widget: renders 1:4 statically
// interactive moneybag widget: reports back the number of moneybags (inits with 1:1)


Vue.component('monk-head', {
  methods: {
    hasSlot: function(name){
      return !!this.$slots[ name ] || !!this.$scopedSlots[ name ];
    }
  },
  template: '#monk-head-template'
});

Vue.component('monk-question', {
  props: {
    // question: 'Which of the following is older?',
    // answers: ['Etruscan Gold Book', 'Madrid Codex'],
    // correct: ['Etruscan Gold Book'],
    // images: ['etruscan_gold_book.jpg', 'madrid_codex.jpg']
    // extra: ['Blah blah']
    datum: {type: Object},
    vizType: {type: String, default: 'certainty'}, // 'bet', 'certainty'

    // Give the monk something to say in a speech bubble.
    monkSays: {type: String, default: null},
  },

  data: function(){
    return {
      userAnswer: null, 
      params: null,
      showThinkingBubble: false,
    }
  },

  watch: {
    userAnswer: scrollWindow,
  },

  methods: {
    // e.g. Hyderabad, Islamabad
    userChoseAnswer: function(answer){
      this.userAnswer = answer;
    },

    onBetSubmit: function(params){
      params['userAnswer'] = this.userAnswer;
      this.params = params;
      this.showThinkingBubble = true;
    },

    onThinkingComplete: function(){
      this.$emit('answer-complete', this.params);      
    }

  },
  template: '#monk-question-template'
});

Vue.component('monk-interaction', {
  props: {
    // question: 'Which of the following is older?',
    // answers: ['Etruscan Gold Book', 'Madrid Codex'],
    // correct: ['Etruscan Gold Book'],
    // images: ['etruscan_gold_book.jpg', 'madrid_codex.jpg']
    // extra: ['Blah blah']
    datum: {type: Object},
    vizType: {type: String, default: 'certainty'}, // 'bet', 'certainty'
  },

  data: function(){
    return {
      params: null,
      userCertainty: null, // duplication of params.userCertainty

      isMonkDoneThinking: false,
      showExplanation: false,
    }
  },

  computed: {
    isUserCorrect: function(){
      if (this.datum.id == 'uniform-prior'){
        return this.userCertainty == 0.5;
      }
      if (this.datum.id == 'rain-prior'){
        if (this.userCertainty == 0.5){
          return false;
        }
      }
      return _.includes(this.datum.correct, this.params.userAnswer);
    },

    percent: function(){
      return this.$root.renderAsPercent(this.userCertainty);
    },    
    monkSays: function(){
      if (this.isMonkBetting === null){
        return null;
      }
      if (this.isMonkBetting === false){
        return 'Eh';
      }
      return this.isUserCorrect ? 'Correct' : 'Incorrect';
    },

    isMonkBetting: function(){
      if (this.params === null){
        return null;
      }
      const certainty = this.params.certainty;
      if (this.datum.type == 'special'){
        return true;
      }
      if (certainty > 0.6){
        return true;
      }      
      var p = {
        0.6: 0.8,
        0.5: 0.5
      }[certainty];
      return Math.random() < p;
    },

    numMoneybagsGained: function(){
      if (this.isMonkBetting === false){
        return 0;
      }

      if (this.datum.id == 'rain-prior' && this.userCertainty == 0.5){
        return 0;
      }

      if (this.isUserCorrect === false){
        // Just lose 1 moneybag for messing up a prior question.
        if (['uniform-prior', 'rain-prior'].indexOf(this.datum.id) > -1){
          return -1;
        }
      }


      return this.isUserCorrect ? this.params.numWinIfRight : -this.params.numLoseIfWrong; 
    },
  },
  methods: {

    // params = {userAnswer: certainty: numWinIfRight: numLoseIfWrong: }
    onAnswerComplete: function(params){
      this.params = params;
      this.userCertainty = params.certainty;
      this.isMonkDoneThinking = true;
    },

    monkReactionComplete: function(){
      var this_ = this;
      setTimeout(function(){
        this_.$emit('question-complete', {
          // may need to pass in other info ??
          numMoneybagsGained: this_.numMoneybagsGained
        });      
      }, 1000);
    }
  },
  template: '#monk-interaction-template'
});


Vue.component('certainty-widget', {
  props: {
    certainties: {
      type: Array, 
      default: function(){
        return [0.5, 0.6, 0.7, 0.8, 0.9];
      },
    },
    showMoneybagWidget: {type: Boolean, default: true},
  },
  data: function(){
    return {
      hoveredCertainty: null,
    };
  },
  methods: {
    submitCertainty: function(certainty){
//      var certainty = params.answer;
      this.$emit('bet-submit', 
        this.$root.paramsFromCertainty(certainty)
      );
    },
    onHover: function(certainty){
      if (this.showMoneybagWidget) { 
        this.hoveredCertainty = certainty;
      }
    },
  },
  template: '#certainty-widget-template'
});
