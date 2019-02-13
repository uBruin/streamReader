var input = document.getElementById("input");
let message = "This is a reading assisant, enter the text you would like to read, StreamReader will parse it by periods, and display one sentence at a time! When you wish to move on, click next. After six sentences, StreamReader will analyze your reading-rate and move on for you! If you wish to disable this functionality at any time, check the 'Manual' box. Before entering new text, please refresh this page."
alert(message);
var i = 0;
let k = 0;
var past = new Date();
var now = past.getTime();
let times = [0];
let intervals = [];
let fourMovingMean = [];

function parse()
  {
    var str = input.value;
    var parsedInput = str.split(".");   //raw parsed input by periods
    var j = 0;
    var mag = [];
    var mister = [];
    while (j < parsedInput.length)
      {
        mag.push(parsedInput[j].length);
        mister.push(parsedInput[j].substr(parsedInput[j].length - 3, parsedInput[j].length));     //here we are getting the last 3 characters of each string stored in an array
        if (mister[j] === (" Mr" || "Mrs" || " Dr"))                      /*this loop is specifically for the interception of sentences erroneously cut by a period after Mr, Mrs, or Dr.
                                                                          These are only the most common title, I felt it was ok not to do Sr., Jr., Gen., Pres. etc for brevity */
          {
            parsedInput[j] = parsedInput[j] + ". " + parsedInput[j+1];    //sewing the strings together
            parsedInput.splice(j+1, 1);                                   //here we cut out the second half of the erroneously cut string
          }
        j++;
      }
    document.getElementById("output").textContent = parsedInput[0];
    return parsedInput;                                             //returning the array of split sentences
  }

function next()
  {
    i++;
    let past = new Date();
    let now = past.getTime();
    times.push(now);                          //Storing times the user moved on from a sentence
    intervals.push(times[i]-times[i-1]);      //Storing the gaps between these times in miliseconds
    if (i/6 >= 1)
    {
      fourMovingMean.push(intervals[i-1]+intervals[i-2]+intervals[i-3]+intervals[i-4]);       //One of the few non-array variables created. Stores time taken to read last 4 sentences
      let fourMovingSum = parse()[i-1].length + parse()[i-2].length + parse()[i-3].length + parse()[i-4].length;  //figuring the amount of characters read in the last 4 sentences
      let readingRate = fourMovingSum/fourMovingMean[i-6]
      timeout = setTimeout(next, parse()[i].length/readingRate);          //setting how long until the next sentence changes based on the length of the current setence and the moving average reading rate
      if (document.getElementById("mode").checked === true)
        {
          window.clearTimeout(timeout);
          document.getElementById("next").style.display = "block";        //making the Manual box work
        } else
          {
            document.getElementById("next").style.display = "none";
          }
    }
    document.getElementById("output").textContent = parse()[i];
  }
function prev()
  {
    i--;
    document.getElementById("output").textContent = parse()[i];

  }
