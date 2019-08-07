//const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Show the branching story.
// Things to show must be <story>s, but you can apply styling.
// <story> is hidden at first, and scrolls when it appears.
// Example:
// <once-group>
//    <once-button value="choice-a">press me</once-button>
//    <once-button value="choice-b">press me</once-button>
// </once-group>    
// <story ref="choice-a">this is choice a</story>
// <story ref="choice-b">this is choice b</story>  
function show(ref_name){
  // https://stackoverflow.com/questions/36970062/vue-js-document-getelementbyid-shorthand
  console.log('hitting show: ' + ref_name);

  // Turn all the other refs inactive.
  _.values(this.$refs).forEach(function(comp){
    if (comp.data && comp.data.isVisible === true){
      comp.data.isVisible = false;
    }
  });

  // Turn one ref active.
  var vue_component = this.$refs[ref_name];
  if (vue_component === undefined){
    throw 'cannot find ref_name: ' + ref_name;
  } else {
    vue_component.$data.isVisible = true;        
  }
}

// component: a vue component
// value_to_show a ref-name
// Returns a boolean for whether the component can show that ref name.
function hasShow(component, value_to_show){
  try{
    component.show(value_to_show)    
  } catch(e){
    return false;
  }
  return true;
}

// Gently scroll the screen down every 50ms. 
// If the old value == new value, stop.
function scrollWindow(){
  var num_attempts = 0;
  var last_window_y = 0;

  var scroll_timer = setInterval(function(){
    var pre_scroll_y = window.scrollY;

    // User has scrolled up, compared to the last time we scrolled down!
    // Cancel the scroll down.
    if (pre_scroll_y < last_window_y){
      clearInterval(scroll_timer);
    }

    console.log('scrolling');
    window.scrollBy(0, 10);
    last_window_y = window.scrollY;

    // Log a failure to scroll.
    if (window.scrollY == pre_scroll_y){
      num_attempts++;
    }

    // Clear the scroll if we haven't been able to scroll past in 
    // num_attempts.
    if (num_attempts > 5){
      clearInterval(scroll_timer);
    }
  }, 50); 
}



/*
* Randomly selects an element out of an array or out of the arguments list
*/
function randSelect(){
  var arr;
  if (arguments.length == 1 && _.isArray(arguments[0])){
    arr = arguments[0];
  } else {
    arr = Array.prototype.slice.call(arguments);
  }
  var ind = Math.floor(Math.random() * arr.length);
  return arr[ind];
}

/*
* Returns the sum of an array
*/
function sum(arr){
  var result = 0;
  for (var i=0; i<arr.length; i++){
    result+=arr[i];
  }
  return result;
}

/*
* Returns a boolean measuring if two numbers are approximately equal
*/
function approx(a, b, epsilon){
  var epsilon = _.isUndefined(epsilon) ? .001 : epsilon;
  return Math.abs(a - b) < epsilon;
}

// /*
// * Returns an array of x repeated num_times
// */
// function repeat(x, num_times){
//   return _.range(num_times).map(function(){
//     if (x instanceof jQuery){
//       return x.clone();
//     }
//     return x;
//   });
// }

/*
* Returns a normalized version of the input arr
*/
function normalizeArr(arr){
  var arr_sum = sum(arr);
  return arr.map(function(x){
    return x / arr_sum;
  });
}

/*
* Returns a formatted string for the number as a percent,
* given the number and desired digits after the decimal point.
*/
// function format_pct(number, after_decimal){
//   var x = number * 100;
//   var after_decimal = _.isUndefined(after_decimal) ? 0 : after_decimal;
//   return x.toFixed(after_decimal) + '%';
// }


function clamp(x, a, b){
  return Math.min(Math.max(x, a), b);
}

function lerp(from_x, from_lo, from_hi, to_lo, to_hi){
  var scale = (to_lo-to_hi)/(from_lo-from_hi);
  return to_lo + (from_x-from_lo)*scale;
}

function cumulativeSum(arr){
  if (arr.length < 1){
    return [];
  }

  var total = [arr[0]];
  for (var i=1; i<arr.length; i++){
    var last = total[total.length - 1];
    total.push(last + arr[i]);
  }
  return total;
}

// function cumavg(arr){
//   var cumsums = cumsum(arr);
//   for (var i=0; i<cumsums.length; i++){
//     cumsums[i] /= (i+1);
//   }
//   return cumsums;
// }


// function mean(arr){
//   if (arr.length === 0){
//     return null;
//   }
//   return sum(arr)/arr.length;
// }

// function variance(arr){
//   if (arr.length === 0){
//     return null;
//   }

//   var mn = mean(arr);

//   var total = 0;
//   for (var i=0; i<arr.length; i++){
//     total += (arr[i]-mn)*(arr[i]-mn);
//   }
//   return total / arr.length;
// }

// function stdev(arr){
//   if (arr.length === 0){
//     return null;
//   }
//   return Math.sqrt(variance(arr));
// }


function formatPct(certainty){
  return roundTo(certainty*100, 0) + '%';
}

// round_to(2.777777, 0) -> 3
// round_to(2.777777, 2) -> 2.78
function roundTo(x, num_decimals){
  return parseFloat(x.toFixed(num_decimals));
}
