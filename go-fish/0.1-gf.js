//Traditioinal GO Fish against 4 computer opponents

//Lyra Chamberlin (she/her)
//Monday October 2, 2023

//Get Books(4 cards of the same rank) by asking your opponents for cards you already have in hand.
//On your turn:
//Select a card in your hand using the 'A' and 'D' keys,
//Select an opponent to ask the selected card for by clicking their hand with the mouse

//Screen and cards readjust size based on window size

//actions will appear as text on screen

//when no one has any cards left in their hand AND the deck is empty, decide the winner
//the winner is whoever has the most Books

//Note: the bots are surprisingly good/aggresive considering they ask a random player with 4 or more cards (if possible), or a random player with at least 1 card in their hand (when no one has 4 or more), for a random card in their hand.
//Subnote: this is mostly to do with deck probability stuff.




let deck = [];
let numbers = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let suits = ["Clubs","Hearts","Spades","Diamonds"];

for (let colour in suits){
  for (let value in numbers){
    deck.push(numbers[value]);
  }

}
// console.log(deck);



//use 'spread' to mostly evenly space out the enemies


let hP = [];
let booksP = [];

let cps = 4;
let hCP = [];
for (let n =cps; n > 0; n--){
  hCP.push([]);
}
let booksCP = [];
for (let n =cps; n > 0; n--){
  booksCP.push([]);
}

let turn = false;


let w=600;
let h=600;

let cpPos;
// 'cback' function gets angry cause this didn't exist when it was 'let' in 'setup'
let spa;



//NOTE:
//array.sort() doesn't organize 10 as higher than 9 like you think it would, instead it alphabetically sorts them like how you would words (1 is like a, so '10' is put at the start like 'alpha' would be)
//(Uncommentthe console.log for the hands to see for your self)
//HOWEVER, this shouldn't matter because all we need is for the like cards to be next to eachother in the hand arrays.

function setup() {
  //shuffle the deck
  screen();
  limit();
  for(let n = 3; n>0; n--){
    shuffle(deck, true);
  }
  cDraw(5,false);
  hP.sort();
  // console.log("Hand:",hP);
  for (let hB in hCP){
    cDraw(5,hB);
    hCP[hB].sort();
    // console.log("Bot Hand:",hCP[hB]);
  }
}

function screen(){
  w=windowWidth;
  h=windowHeight;
  createCanvas(w, h);
}

let q;

function draw() {
  
  if (w !==windowWidth || h !==windowHeight){
    screen();
    limit();
  }
  
  if (game){
    if (wait()){
      dispGame();

      deckleft(tsize);
      // console.log(q);
      if (q === undefined){
        // does the turn and summons a queue of actions to take place before next turn.
        // console.log("do turn");
        doTurn(turn);
        // if (q === undefined){
        //   q = [];
        // }
      }else{
        // console.log(q);
      }
      }
      actionQ();
    // console.log(turn);
    
  }
  
}

function dispGame(){
  background(150);
  //change selected card
  choose(length(hP)-1);
  //display YOUR hand of cards
  hP.sort();
  hand(mrg*10,h,hP);
  //display opponent(s) hand(s)
  for (let hB in hCP){
    hCP[hB].sort();
    hand(cpPos[hB],0,hCP[hB],true,hB);
  }
}

function actionQ(){
  // console.log("before actionQ:",q);
  if (q != undefined && wait()){
    // console.log("actionQ:",q);
    if(q[0]==="goFish"){
      goFish(turn);
    }else if(q[0][0]==="cGain"){
      // console.log("triggered");
      cGain(q[0][1]);
    }
    //check if the player has a book (aka final part of a turn)
    //then make it next turn
    if(q[0]===true){
      if (turn===false){
        hP.sort();
      }else{
        hCP[turn].sort();
      }
      // console.log("has book?");
      hasBook(turn);

      // console.log("before turn change:",turn);
      turn = changeTurn(turn);
      // console.log("after turn change", turn);
      q = undefined;
      
    }else{
      //remove the performed action from the queue
      // console.log("resolved action from queue");
      q.splice(0,1);
    }
    
  }
}


//variables for 'card' function
//find the smallest screen measurement to base card size off of
let lmt;
let cw;
let ch;
let tsize;
let cap;
let mrg;


let jeez = Math.sqrt(cps);//Math.sqrt(cps));
// console.log("jeez:",jeez);

function limit(){
  if (w<=h){
    lmt = w;
  }else{
    lmt = h;
  }
  //calculate card sizes
  cw = lmt/5-20; //400 -> 60
  ch = lmt/4;  //400 -> 100
  tsize = lmt/16+5;  //30
  mrg = tsize/6;    //30 -> 5
  //prepare for oversized check  
  
  //align bot hands
  
  // console.log(((w-mrg*2)-mrg*4)/cps);
  spa = ((w-mrg*2)-mrg*4)/cps;
    
  cpPos = spread(mrg*2-spa,cps,spa);
  // console.log(cpPos);
  cap = [lmt*80/600,lmt*125/600,lmt*36/600]; //36.25 text size
  // console.log("origin cap", cap);
  
  for (let n in cap){
  cap[n] = cap[n]/(jeez); 
    
  
}
// console.log("proper cap",cap);
}






// console.log(lmt,cw,ch,tsize,mrg);
  //variable also for 'choose' fnctn
let spot = 0;
let kheld = false;

// for choosing an opponent to fish from
let selh = false;

//give length of an array
function length(array){
  let l = 0;
  // console.log(array);
  for (let n in array){
    l ++;
  }
  return l;
}



function cRaw(n){
  let rawed = [];
  let crd;
  // console.log(deck);
  while(n>0){
    n --;
    crd = deck[0];
    // console.log("New card:",crd);
    deck.splice(0,1);
    // console.log(deck);
    rawed.push(crd);
  }
  console.log("Rawed:",rawed);
  return [rawed];
}

let deckfull = true;
function cDraw(n,who){
  let crd;
  // console.log(deck);
  while(n>0 && deckfull, n--){
    if (length(deck) === 0){
      console.log("the deck is empty");
      deckfull = false;
      return false;
    }
    crd = deck[0];
    // console.log("New card:",crd);
    deck.splice(0,1);
    // console.log(deck);
    if (who===false){
      hP.push(crd);
    }else{
      hCP[who].push(crd);
    }
  }
  // if (!who){
  //     console.log("new hand:", hP);
  //   }else{
  //     console.log("new hand:", hCP[who]);
  //   }
}

function deckleft(ts){
  fill("black");
  strokeWeight(0);
  textAlign(LEFT,CENTER);
  textSize(ts)
  let t;
  if (deckfull){
    t = "Deck:"+str(length(deck));
  }else{
    t = "Deck Empty";
  }
  text(t,0,h/3);
  
}

//keys
let a = 65;
let d = 68;
function choose(limit){ 
  if (!kheld&&keyIsPressed){
    kheld = true;
    if (keyCode === a){
      if (spot === 0){
        spot = limit;
      }else{
        spot --;
      }  
    }else if (keyCode === d){
      if (spot === limit){
        spot = 0;
      }else{
        spot ++;
      }  
    }
  }
}
function keyReleased(){
  kheld = false;
}


let clicked = false;
function mouseReleased(){
  if (!turn){
    clicked = true;
  }
}

function saySkip(who){
  let t;
  fill("black");
  stroke("orange");
  strokeWeight(1);
  textAlign(CENTER,CENTER);
  textSize(tsize);
  
  // console.log("show who:",who)
  if (who===false){
    t = ("You do nothing for your turn");
  }else{
    t = ("B"+str(who)+"t does nothing for their turn");
  }
  text(t,w/2,h/2);
  // console.log(t);
  //enforce the wait fnct 
  end = millis()+ 3*1000;
}

function doTurn(who){
  
  let queue;
  // console.log("opened");
  if (who===false){
    // console.log("player turn");
    if(length(hP)===0){
      if (deckfull){
        cDraw(n,false);
      }else{
        endCheck();
        if(game){
          saySkip(who);
          return;
        }
      }
    }else{
      
      if(clicked){
        clicked = false;
        // console.log("the mouse button was released");
        // console.log(selh);
        if (selh){
          // console.log("asks for",hP[spot]);
          doGF = askFor(selh,hP[spot],who);
          // console.log("action:",doGF);
          //go fish, book check
          queue = [doGF,true]
          // console.log("queue:",queue)
          q = queue;
          // console.log("q",q);
        } 
      }
    }
  }else{
    // console.log("bot turn");
    if(length(hCP[who])===0){
      if (deckfull){
        cDraw(n,who);
      }else{
        endCheck();
        if(game){
          saySkip(who);
          return;
        }
      }
    }else{
      let cheese = botAI(who);
      doGF = askFor(cheese[0],cheese[1],who);
      // console.log("action:",doGF);
      queue = [doGF,true]
      // console.log("queue:",queue)
      q = queue;
      // console.log("q",q);
    }
  }

}

function endCheck(){
  
  let check = true;
  if (length(hP)===0){
    for(let hand in hCP){
      if(length(hand)===0){
        check = false;
        break;
      }
    }
  }else{
    check = false;
  }
  
  if(check){
    gameDone();
  }
}


let game = true;
function gameDone(){
  game = false;
  fill("black");
  stroke("yellow");
  strokeWeight(3);
  textAlign(CENTER,CENTER);
  textSize(tsize*2)
  text("The winner is:", w/2, h/2-tsize*2);
  
  let longest = 0;
  let lbot = [];
  let books;
  for(let bot in booksCP){
    books = booksCP[bot];
    if (length(books)>longest){
      longest = length(books);
      lbot = [bot];
    }else if(length(books)===longest)
      lbot.push(bot);
  }
  
  let t;
  if(length(booksP)>=longest){
    t = "You!";
    if(length(booksP)===longest){
      for(let name of lbot){
        t = t+ " B"+str(name)+"t!";
      }
    }
  }else{
    t = '';
    for(let name of lbot){
      t = t+ " B"+str(name)+"t!";
    }
  }
  textSize(tsize*2.2);
  text(t,w/2,h/2+tsize*2);
  
}

function changeTurn(current){
  if (current === false){
    //start of bot turns
    // console.log("first bot");
    return 0;
  }else{
    if (current === length(hCP)-1){
      // console.log("player");
      fill("black");
      stroke("yellow");
      strokeWeight(2);
      textAlign(CENTER,CENTER);
      textSize(tsize*2);
      text("YOUR TURN!",w/2,h/2);
      //enforce the wait fnct 
      end = millis()+ 2*1000;
      return false;
    }
    // console.log("next bot");
    return current+1;
    
  }
}

let end=0;
function wait(){
  // console.log("time:",millis()-start);
  if(millis() >= end){
    return true;
  }
  return false;
  // while(millis()<end){}
}

function hasBook(who){
  let count;
  let last;
  let start;
  let card;
  
  if (who===false){
    for (let place in hP){
      card = hP[place];
      if (last != card){
        count = 1;
        last = card;
        start = place;
      }else if (last === card){
        count ++;
        if (count === 4){
          let crd;
          let book = [];
          while(count > 0, count--){
            crd = hP[start];
            hP.splice(start,1);
            // console.log("hand since cards removed:",hP);
            book.push(crd);
            booksP.push(crd);
            madeBook(who,book);
          }         
          
        }
      }
    
    }
  }else{
    for (let place in hCP[who]){
      card = hCP[who][place];
      if (last != card){
        count = 1;
        last = card;
        start = place;
      }else if (last === card){
        count ++;
        if (count === 4){
          let crd;
          let book = [];
          while(count > 0, count--){
            crd = hCP[who][start];
            hCP[who].splice(start,1);
            // console.log("hand since cards removed:",hCP[who]);
            book.push(crd);
            booksCP[who].push(crd);
            madeBook(who,book);
          }         
          
        }
      }
    
    }
  }
  
  // console.log("made book:",book);
  
}

function madeBook(who,book){
  let t;
  fill("black");
  stroke("black");
  strokeWeight(1);
  textAlign(CENTER,CENTER);
  textSize(tsize);
  
  // let b = '';
  // for (let item in book){
  //   b += str(item)+" ";
  // }
  let b = str(book[0])+"s";
  if (who===false){
    t = "You made a book of:"+b;
    // console.log(booksP);
  }else{
    t = "B"+str(who)+"t made a book of:"+b;
    // console.log(booksCP[who]);
  }
  text(t,w/2,h/2);
  console.log(t);
  //enforce the wait fnct 
  end = millis()+ 2*1000;
}

function cGain(num){
  fill("black");
  stroke("yellow");
  strokeWeight(2);
  textAlign(CENTER,CENTER);
  textSize(tsize*1.5);
  let t = str(num)+" cards taken";
  text(t,w/2,h/2);
  //enforce the wait fnct 
  end = millis()+ 2*1000;
}

function goFish(who){
  fill("black");
  stroke("yellow");
  strokeWeight(2);
  textAlign(CENTER,CENTER);
  textSize(tsize*2);
  let t;
  if (deckfull){
    // console.log(who,"went go fish");
    t = "GO FISH!"
  }else{
    t = "NO FISH!"
  }
  text(t,w/2,h/2);
  //enforce the wait fnct 
  end = millis()+ 2*1000;

  cDraw(1,who);
  
}

function showAsked(target,asked,who){
  let t;
  fill("black");
  stroke("black");
  strokeWeight(1);
  textAlign(CENTER,CENTER);
  textSize(tsize);
  
  // console.log("show who:",who)
  if (who===false){
    t = ("You asked B"+ str(target)+"t for their "+ str(asked)+"s");   
  }else{
    let trgt;
    if (target===false){
      trgt = ["You","your"];
    }else{
      trgt = ["B"+str(target)+"t", "their"];
    }
    t = ("B"+ str(who)+"t  asked "+str(trgt[0])+" for "+str(trgt[1])+" "+str(asked)+"s");
  }
  text(t,w/2,h/2);
  // console.log(t);
  //enforce the wait fnct 
  end = millis()+ 3*1000;
}

function askFor(target,asked,who){
  
  showAsked(target,asked,who);
  
  let start;
  let ln;
  
  let targethand;
  if (target===false){
      targethand = hP;
    }else{
      targethand = hCP[target];
      // console.log("th set:",targethand);
    }
  let card;
  // console.log(asked);
  for(let pos in targethand){
    card = targethand[pos];
    // console.log("pos:", pos);
    // console.log(card);
    if (card===asked){
      // console.log("who:",who);
      if (who===false){
        hP.push(card);
        // console.log("taker's hand:", hP);
      }else{
        hCP[who].push(card);
        // console.log("taker's hand:", hCP[who]);
      }
      if (start === undefined) {
        start = pos;
        ln = 1;
      }else{
        ln ++;
      }
    }
  }
  
        // console.log("target hand:",targethand);

  // console.log("start",start,"ln",ln);
  if(start === undefined){
    return "goFish";
  }else{
    if (target===false){
      hP.splice(start,ln);
    // console.log("taken hand:",hP);
    }else{
      hCP[target].splice(start,ln);
    // console.log("taken hand:", hCP[target]);
    }
    return ["cGain",ln];
  }
  // console.log(targethand);
} 

function botAI(which){
  //make list of viable targets
  let targets = [];
  let goodtargets = [];
  if(length(hP)>=4){
    goodtargets.push(false);
  }else if(length(hP)>=1){
    targets.push(false);
  }
  for(let bot in hCP){
    if (bot != which){
      if(length(hCP[bot])>=4){
        goodtargets.push(bot);
      }else if (length(hCP[bot])>=1){
        targets.push(bot);
      }
    }
  }
  //pick an opponent
  let opponent;
  if (length(goodtargets)>=1){
    opponent = random(goodtargets);
  }else if (length(targets)>=1){
    opponent = random(targets);
  }
  //pick a card to ask for
  let choice = random(hCP[which]);
  
  return [opponent,choice];
  
}



function spread(origin,length,space){
  let shft = [];
  // console.log("length",length);
  for (let n =1; n <= length; n++){
    // console.log("shft item:",origin+(n*(space)));
    shft.push(origin+(n*(space)));
  }
  return shft;
}

function card(x,y,value,place,scaled){
  // rectMode(CENTER);
  // console.log(x,cw);
  // console.log(ln)
  
  // let caw = cw;
  // let cah = ch;
  let tesize = scaled[0];
  let marg = scaled[1];
  
  // console.log(caw);
  // if (ln >= 7){
    // let shrink = Math.sqrt(ln)
    // // console.log(shrink)
    // caw = caw/shrink;
    // cah = cah/shrink;
    // tesize = tesize/shrink;
    // marg = marg/shrink;
  // }
  // console.log(caw)
  
  let left = x-cw/2;
  let top = y-ch-2*marg;
  if (spot === int(place)){
    fill(250);
    strokeWeight(3);
    stroke("yellow");
  }else{
    fill(220);
    strokeWeight(2);
    stroke("black");
  }
  rect(left,top,cw,ch);
  textAlign(LEFT,TOP);
  fill("black");
  strokeWeight(0);
  textSize(tesize);
  // console.log(left, mrg);
  text(value,left+marg,top+marg);
}

function cback(x,y,cn, bord){
  let shr = Math.sqrt((cps*2)/cn);
  // console.log("shrink:",shr);
  let wd = cap[0];
  let hi = cap[1];
  let ts = cap[2];
  if (cn >= cps+1){
    wd = wd/shr;
    hi = hi/shr;
  }
  // console.log(wd,hi);
  
  let left = x-wd/2+ts/2;
  let top = y+2*ts/6;
  fill("red");
  strokeWeight(2);
  stroke(bord);
  rect(left,top,wd,hi);
}

function points(x,y,books, ts){
  fill("black");
  strokeWeight(0);
  textAlign(CENTER,CENTER);
  textSize(ts);
  let t = "Points:"+str(length(books));
  text(t, x, y);
}

let clrs = ["green",'blue','pink','orange','purple'];

function hand(x,y,hand,isComputer,num){

  // console.log(length(hand));
  let shft;
  
  if (isComputer){
    let bord = "black";
    
    let inY = (mouseY >= y && mouseY <= y+cap[1]);
    if (inY && !turn){
      let inX = (mouseX >= x && mouseX <= x+spa);
      if (inX){
        selh = num;
        bord = "yellow";
      }
    }else if(turn === num){
      selh = num;
      bord = "green";
    }else{
      selh = false;
    }
    let ln = length(hand);
    let tscap = cap[2]
    let ts = tscap/Math.sqrt(ln);
    shft = spread(x,ln,ts+(ts/6)*2);
    // console.log("books of bots:",booksCP);
    
    for (let c in hand){
      cback(shft[c],y,ln,bord); 
    }
    points(x+tscap*3,y+tscap*5,booksCP[num],tscap*1.5);
    fill(clrs[num]);
    stroke("black");
    strokeWeight(3);
    let t = "B"+str(num)+"t";
    textAlign(LEFT,TOP);
    text(t,x+ts,y=ts);
  }else{
    // let caw = cw;
    // let cah = ch;
    let tesize = tsize;
    let marg = mrg;
    let ln = length(hand);
    if ( ln >= 7){
      tesize = tesize-Math.sqrt(25*(ln-5));
      marg = marg-Math.sqrt(2*(ln-5));
    }
    
    shft = spread(x,length(hand),tesize+marg*3);
    for (let c in hand){
//       console.log("c:",c);
      // console.log(length(hand))
      card(shft[c],y,hand[c],c,[tesize,marg]);
    }
//     h-(tsize+mrg*2)
    points(x+tsize,y-(cw+tsize*2),booksP,tsize);
  }
}


// console.log(key,keyCode);