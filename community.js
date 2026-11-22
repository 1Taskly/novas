/* NodeTray community room (preview engine). Simulated members use American trader names/nicknames; human-like typing styles.
   Self-contained: <script src="community.js" defer></script> on the app page.
   Runs entirely in each visitor's browser, so it adds no load to your servers.
   While PREVIEW is true the room says on screen that conversations are simulated. */
(()=>{
const PREVIEW=true;
const ROOMS=[{id:"lounge",name:"Lounge"}];
/* ---- 150 people ---- */
const FIRST=["Mike","Jake","Tyler","Chris","Brandon","Austin","Cody","Dustin","Travis","Kyle","Matt","Josh","Ryan","Derek","Trevor","Jordan","Cole","Ethan","Logan","Hunter","Brian","Kevin","Dan","Steve","Tom","Nick","Zach","Luke","Sean","Greg","Jess","Ashley","Megan","Emily","Brittany","Kayla","Sarah","Lauren","Rachel","Katie","Amber","Danielle","Tony","Marcus","Darnell","Jamal","DeShawn","Carlos","Eric","Pat","Rick","Walt"];
const NICK=["Big Mike","JT","TJ","Dave","Tex","Smitty","Doc","Chip","Bubba","Mac","Ace","Slim","Cap","Rev","Hutch","Rocco","Moose","Duke","Ziggy","Sully"];
const SUF=["_trades","_hodl","_fx","_charts","_dca","_swing","_risk","_scalps","_ta","_flow","21","99","_btc","_daily","_longs","_atl","_nyc","_tx","_fl","_chi"];
const COLORS=["#f7931a","#627eea","#9945ff","#26a17b","#e8505b","#2d9cdb","#f2994a","#bb6bd9","#27ae60","#eb5757","#56ccf2","#f2c94c","#6fcf97","#ff7a59"];
const AVATAR_BASE="avatars/",AVATAR_COUNT=477,AVATAR_EXT="webp"; /* put numbered files in /avatars (1.jpg, 2.jpg ...) and set AVATAR_COUNT */
const LAST=["A","B","C","D","E","G","H","J","K","L","M","N","P","R","S","T","W"];
const NAMECOL=["#ff3d7f","#9b6bff","#2d9bff","#00d27a","#ffa012","#f23fd0","#00c2e0","#ff6a3d","#b57bff","#ffc400","#00d9b5","#ff5c9a"];
const PEOPLE=[],seen=new Set();
for(let i=0;i<1000;i++){const f=FIRST[(i*7+Math.floor(i/50))%FIRST.length];let n;const k=i%7;
  const role=i%40===1?"mod":i%20<7?"new":i%20<14?"vet":"chat";
  if(k===0)n=f.toLowerCase()+SUF[i%SUF.length];
  else if(k===1)n=NICK[i%NICK.length].replace(/ /g,"")+ri0(10,99);
  else if(k===2)n=f+"_"+LAST[i%LAST.length];
  else if(k===3)n=f.toLowerCase()+ri0(70,99);
  else if(k===4)n="the_"+f.toLowerCase()+(i>350?ri0(1,9):"");
  else if(k===5)n=f.toLowerCase()+LAST[(i*3)%LAST.length].toLowerCase()+ri0(1,98);
  else n=f+LAST[(i*5)%LAST.length]+ri0(80,99);
  if(role==="mod")n=f+"_Mod";
  while(seen.has(n))n+=ri0(0,9);seen.add(n);
  PEOPLE.push({n,c:COLORS[(i*5+3)%COLORS.length],nc:NAMECOL[(i*7+3)%NAMECOL.length],role,gem:role==="chat"&&Math.random()<.35,num:AVATAR_COUNT?((i*7919)%AVATAR_COUNT)+1:0,img:AVATAR_COUNT?AVATAR_BASE+(((i*7919)%AVATAR_COUNT)+1)+"."+AVATAR_EXT:"",
    style:{lower:Math.random()<.6,emoji:Math.random()<.35,typo:Math.random()<.3,terse:Math.random()<.4}})}
function ri0(a,b){return Math.floor(a+Math.random()*(b-a+1))}
const ME={n:"you",c:"#2f7bff",nc:"#ff9f1a",me:1,img:1};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const who=r=>pick(PEOPLE.filter(p=>p.role===r));
const SYMS=["BTC","ETH","SOL","BNB","XRP"];
/* neighbouring topics share a coin or a theme, so the room drifts instead of jumping */
const TOPICS=[{sym:"BTC",kind:"price"},{sym:"BTC",kind:"setup"},{sym:"ETH",kind:"setup"},{sym:"ETH",kind:"price"},{sym:"SOL",kind:"price"},{sym:"SOL",kind:"setup"},{sym:"SOL",kind:"risk"},{sym:"BTC",kind:"risk"}];
const TP={i:0,n:0,max:6};
const tsym=()=>TOPICS[TP.i].sym;
const px=s=>{try{const e=S.mk[s];if(e&&e.p>0)return e.p}catch(_){}return{BTC:64000,ETH:2500,SOL:130,BNB:600,XRP:2}[s]};
const chg=s=>{try{const e=S.mk[s];if(e&&typeof e.chg==="number")return e.chg}catch(_){}return rnd(-3,3)};
const fp=v=>v>=1000?v.toLocaleString(undefined,{maximumFractionDigits:0}):v>=10?v.toFixed(2):v.toFixed(3);
const sg=v=>(v>=0?"+":"")+v.toFixed(1)+"%";
const sub=(t,v)=>t.replace(/\{(\w+)\}/g,(_,k)=>v[k]??"");
const mention=a=>"@"+a.n;

/* ---- content pools ---- */
const QA={
new:[
["what is a stop loss and do I really need one?",["it is an order that closes your trade if price goes against you by a set amount. yes, you need a plan for being wrong, that is what keeps you in the game","decide it before you enter, not after. if you only decide after, fear decides for you"]],
["is leverage a good idea when you are starting out?",["honestly no. leverage makes small moves huge, in both directions. most beginners get liquidated learning that","learn on spot first. if you still want leverage later, use tiny size"]],
["what does liquidated mean?",["when a leveraged position loses so much that the exchange closes it to protect itself, and your margin is gone","same word is used for collateral on loans: if the borrower cannot cover, the collateral gets sold to cover the loss"]],
["how much should I start with?",["an amount you can lose without it changing your life. seriously. treat the first months as paid education","small and regular beats big and emotional"]],
["what is DCA?",["dollar cost averaging, you buy a fixed amount on a schedule, like weekly, no matter the price. it removes the pressure of timing","it will not beat a perfect entry, but nobody gets perfect entries"]],
["what is a seed phrase?",["the 12 or 24 words that control your wallet. anyone who has them owns your coins. never type them into a website, never send them to anyone","real support never asks for it. ever"]],
["what is the difference between a limit and a market order?",["market buys right now at whatever price is available. limit waits until price reaches the level you set","limit gives control, market gives speed. in fast markets market orders can fill worse than expected"]],
["why do fees matter so much?",["small fees repeated on every trade add up. frequent trading with tiny profits can end up negative after fees","same with loans, always read the total you repay, not just the monthly number"]],
["what is a stablecoin and is it safe?",["a coin designed to stay near one dollar. useful for holding value between trades. still not risk free, depends on who issues it and how it is backed","I keep some in stablecoins when I just want to step aside"]],
["how do I read candles?",["each candle shows open, high, low and close for a period. long wicks show rejection, big bodies show strength. start with one timeframe and learn it well","do not stack ten indicators, you will confuse yourself"]],
["what is support and resistance?",["levels where price has stopped or turned before. buyers showed up at support, sellers at resistance. they are zones, not exact lines","the more times a level was tested, the more people watch it"]],
["do I have to pay tax on crypto?",["rules differ by country and change, so check your local tax authority or ask an accountant. keep a record of every trade from day one","a simple spreadsheet now saves a headache later"]],
["how do I spot a scam?",["anyone promising guaranteed profit, anyone DMing you first, any site asking for your seed phrase, any 'send me crypto and I double it'. all scams","check the web address twice and only use official links"]],
["what is slippage?",["the gap between the price you expected and the price you got. it grows with big orders and thin markets","use limit orders on small coins to protect yourself"]],
["is it better to hold or trade?",["depends on your time, skill and stress level. holding is simpler. trading takes practice and has more ways to lose","many people do a mix, a long term core and a small trading account"]],
["what is FOMO and how do I stop it?",["fear of missing out, buying because it is pumping. the fix is a plan: entries only at levels you wrote down in advance","there is always another setup. missing one costs nothing, chasing one costs money"]]],
loans:[
["how does collateral work on a loan?",["it is a percentage of what you draw. the exact amount is shown before you confirm so read that screen properly","it is held until the loan is fully repaid. the terms explain what happens if payments are missed"]],
["what happens if I miss a payment?",["there is a late fee and the collateral can be liquidated, meaning sold, to cover the loss. the exact numbers are in the loan terms, read them before you accept","set a reminder a few days before every due date. that alone prevents most problems"]],
["is borrowing smarter than selling my coins?",["depends. you keep your position but pay fees and must repay on time. if you cannot repay comfortably it gets expensive fast","never borrow to gamble. borrow only what your income can repay"]],
["which repayment period should I choose?",["the shortest one you can actually afford. longer gives smaller payments but you pay more in fees overall","do the maths before clicking confirm"]],
["can I repay early?",["check the loan terms for the exact rules. paying less time usually means less cost, but read what applies to your loan"]],
["how do I know how much I will pay back in total?",["the draw screen shows the total and every payment date before you confirm. screenshot it so you have a record"]],
["why is there a fee on the loan?",["that is how the service is paid for. the fee depends on how long you borrow and is shown clearly before you accept","always compare the total repaid against what you receive"]]],
general:[],ideas:[]};
const CHAT=["gm everyone ☀️","gn traders 🌙","coffee first, charts second","market feels sleepy today","anyone else glued to the 4h candle?","weekend volume is always weird","remember to take breaks, charts will still be there","green day for the portfolio, nice 🟢","red day, staying calm 🔴","I journal every trade and it changed everything","patience is the real edge","the best trade today was the one I did not take","lol every time I buy it dips","buy the plan not the pump","slow and steady wins this one","who else is just DCAing and ignoring the noise?","good vibes in here today 🙌","small wins add up","wishing everyone disciplined trades today","stop losses are cheaper than regrets"];
const MEME=["my portfolio when I check it every 5 minutes vs once a week. one gives me a better life","me: I will not overtrade today. also me, 14 trades later","stop loss: exists. me: hmm what if I move it a little","'just one more trade' is the most expensive sentence in crypto","when price hits your stop and then immediately reverses 😭","every beginner's journey: lose, learn, journal, improve"];
const POLLS=[["Will BTC close higher today than yesterday?",["Yes 📈","No 📉"]],["Best strategy for beginners?",["DCA","Swing trading","Just hold"]],["How much of your account do you risk per trade?",["Under 1%","1 to 2%","More than 2%"]],["Do you use stop losses?",["Always","Sometimes","Never 😬"]],["Spot or leverage?",["Spot only","A bit of both","Leverage"]]];

/* ---- thread factories (return [[delaySec, person, body], ...]) ---- */
function market(){const s=tsym(),a=who("chat"),b=who("vet"),c=who("chat"),p=px(s),ch=chg(s);
  return[[0,a,sub("{s} sitting around {p} ({c} today). {t}",{s,p:fp(p),c:sg(ch),t:pick(["thin volume, I would not chase here","watching how it reacts to this level","not doing anything until it picks a direction","funding looks calm so far"])})],[6,b,pick(["agreed, thin books make every wick look like a trend","I keep size small in chop like this","range until proven otherwise"])],[7,c,pick(["waiting for a clean retest 🙏","patience pays more than clicks","I will let it come to me"])]]}
function qa(room){const [q,ans]=pick(QA[room]),a=who("new"),out=[[0,a,q]];ans.forEach((t,i)=>out.push([6+i*3,who("vet"),(i===0?mention(a)+" ":"")+t]));if(Math.random()<.65)out.push([6,a,pick(["thanks, that helps a lot 🙏","got it, never thought of it like that","ok that makes sense, appreciate it","saving this, thank you"])]);return out}
function card(){const s=tsym(),a=who("vet"),p=px(s),long=Math.random()<.58,e=p*(1+rnd(-.004,.004)),tg=e*(long?1+rnd(.03,.06):1-rnd(.03,.06)),st=e*(long?1-rnd(.015,.025):1+rnd(.015,.025));
  const out=[[0,a,{card:1,sym:s,side:long?"Long":"Short",e,tg,st}],[6,who("new"),pick(["what timeframe is this on?","how did you pick that stop?","what is the risk reward here?"])],[6,a,pick(["4h chart. I will cut it if the level breaks, no hero trades","stop is below the last swing low, target is the next resistance","about 1:2, I size it so the loss is small"])]];
  if(Math.random()<.5)out.push([10,who("chat"),pick(["clean levels, watching","respect for posting a stop, most people do not","nice setup 👀"])]);return out}
function result(){const s=tsym(),a=who("vet"),win=Math.random()<.62,r=win?rnd(1.6,6.2):-rnd(.9,2.4),p=px(s);
  return[[0,a,{card:1,sym:s,side:Math.random()<.5?"Long":"Short",e:p,tg:p*1.04,st:p*.98,res:r}],[6,who("chat"),win?"nice one, did you take profit in parts?":"stops exist for a reason, next one"],[7,a,win?"half at the first target, rest trailing":"small loss, moving on. position was small so it does not hurt"]]}
function lesson(){const a=who("vet");return[[0,a,pick(["post-mortem on yesterday's loss: I moved my stop because I 'felt' it would bounce. it did not. do not touch the stop 🙃","lesson of the week: I traded without a plan and paid for it. plan first, click second","I overtraded after a win and gave it all back. now I stop after two trades a day"])],[6,who("vet"),"we have all done it. write the rule down before the trade, not during"],[7,who("new"),"this is the kind of honesty I needed to read today, thanks"]]}
function topicChat(){const t=TOPICS[TP.i],s=t.sym,p=px(s),a=who("chat"),b=who("chat");
  const L={price:["{s} is the one I am watching today","{s} chop is annoying, anyone positioned?","what is everyone's level for {s} right now?","{s} holding around {p}, that is the line for me","{s} volume looks thin, I would not size up"],
   setup:["anyone got a clean {s} setup today?","my {s} idea is simple: wait for the retest, small size","{s} setup looks decent but I want confirmation first","how are you guys placing stops on {s}?"],
   risk:["how are you sizing {s} trades lately?","{s} moves a lot so I keep the position small and the stop honest","risk first on {s}: decide the loss before the entry","I cut my {s} size in half after last week, sleeping better"]}[t.kind];
  return[[0,a,sub(pick(L),{s,p:fp(p)})],[5,b,pick(["same here, waiting for a clean level","yeah I am flat until it picks a side","fair, I am keeping size small","agreed, no rush","this is what I do too"])]]}
function topicThread(){
  if(++TP.n>TP.max){TP.n=0;TP.max=ri(5,8);const from=TOPICS[TP.i];TP.i=(TP.i+1)%TOPICS.length;const t=TOPICS[TP.i],a=who("vet");
    const br=t.sym===from.sym?pick(["speaking of "+t.sym+", how are people handling "+t.kind+" on it?","ok different angle on "+t.sym+": what about "+t.kind+"?"]):pick(["same idea on "+t.sym+" though, anyone looking at it?","moving over to "+t.sym+" for a sec, what is the "+t.kind+" like there?"]);
    return[[0,a,br],[6,who("chat"),pick(["good call, been meaning to check that","yeah that one is on my list too","I have thoughts, give me a sec"])]]}
  const t=TOPICS[TP.i];
  return pick(t.kind==="price"?[market,market,topicChat,topicChat]:t.kind==="setup"?[card,card,result,topicChat]:[risk,lesson,topicChat,topicChat])()}
function modThread(){const m=who("mod"),a=who("new");return pick([
 [[0,m,"Quick reminder: never share your seed phrase, password or verification code with anyone. Our team will never DM you first."],[6,a,"good to know, thanks 🙏"]],
 [[0,a,"can I post a screenshot here?"],[6,m,mention(a)+" yes, but hide your account numbers, phone number and any personal info first"],[5,a,"will do, thanks"]],
 [[0,m,"Before you take a loan, read the repayment total on the draw screen. Only borrow what you can repay."],[6,who("vet"),"this ^ plan the repayment first, then borrow"]]])}
function banter(){return[[0,who("chat"),pick(CHAT)],[5,who("chat"),pick(CHAT)]]}
function meme(){return[[0,who("chat"),pick(MEME)],[4,who("chat"),pick(["😂😂","too real","this is my whole personality 😭","felt this in my soul"])]]}
function poll(){const [q,o]=pick(POLLS);return[[0,who("vet"),{poll:1,q,o,v:o.map(()=>ri(2,9)),my:-1}]]}
function risk(){const a=who("vet");return[[0,a,pick(["rule number one for me: never risk more than 1 to 2 percent of the account on a single trade","position size matters more than the entry. a great entry with a huge size still ruins you"])],[6,who("vet"),"1 percent if the setup is average, 2 if I really like it. never more"],[7,who("new"),mention(a)+" how do you work out the size?"],[7,a,"risk amount divided by the distance to your stop. smaller stop distance means a bigger size, that is the formula"]]}
/* ---- conversation generator: combines topics, coins, levels, patterns, moods and reactions into millions of distinct threads ---- */
const COINL=["BTC","ETH","SOL","BONK","WIF","PEPE","DOGE","XRP","LINK","AVAX","ADA","SHIB","FLOKI","BNB"],MAJ=["BTC","ETH","SOL","BNB","XRP"];
const TFS=["15m","1h","1h","4h","4h","daily","weekly"],TIMES=["today","this morning","since the open","last night","this week","in the last hour","since yesterday","over the weekend"];
const PATS=["bull flag","bear flag","double bottom","double top","ascending triangle","falling wedge","range breakout","head and shoulders","cup and handle","higher low","lower high","liquidity sweep","fakeout","retest of support","retest of resistance","inverse head and shoulders"];
const INDS=["RSI","MACD","the 50 EMA","the 200 EMA","VWAP","volume profile","Bollinger bands","funding rate","open interest","fib levels","order flow","the 20 EMA"];
const ZONES=["the weekly open","yesterday's high","yesterday's low","the 4h support","the range high","the range low","last week's close","the 200 EMA","the daily support","the previous swing high","the monthly open"];
const EMO=["fomo","revenge trading","anxiety","overconfidence","boredom","fear of missing the next pump","the urge to overtrade"];
const rn=v=>{const m=v>=5000?500:v>=1000?50:v>=100?5:v>=10?.5:v>=1?.05:.005;return Math.round(v/m)*m};
const lf=v=>v>=1000?Math.round(v).toLocaleString():v>=10?String(+v.toFixed(1)):v.toFixed(2);
function lv(c){if(MAJ.includes(c)){const p=px(c);if(p)return lf(rn(p*(1+rnd(-.04,.05))))}return pick(ZONES)}
function X(){const c=pick(COINL);let c2;do{c2=pick(COINL)}while(c2===c);return{c,c2,tf:pick(TFS),pat:pick(PATS),ind:pick(INDS),zone:pick(ZONES),t:pick(TIMES),pct:ri(2,14),pct2:ri(1,4),n:ri(2,7),emo:pick(EMO),side:Math.random()<.6?"long":"short",lvl:lv(c),lvl2:lv(c2)}}
const SETUP=["{c} printing a {pat} on the {tf}, waiting on {zone} to hold","anyone else seeing the {pat} on {c} {tf}?","{c} just reclaimed {lvl} and {ind} is finally turning","{c} wicked into {lvl} and got bought instantly, bullish for me","I'm flat until {c} closes the {tf} above {lvl}","{c} {tf} looks like a {pat} but {ind} says otherwise","took a small {c} {side} near {lvl}, stop just under {zone}","{c} vs {c2} this week, {c2} looks heavier to me","{ind} on {c} is flashing something odd right now","the {c} {tf} chart is so clean right now","{c} is chopping around {lvl} and it's testing my patience","is {c} really breaking out or is that a {pat} trap?","dca'd into {c} again, not touching it until {zone} breaks","{c} funding flipped {t}, feels like shorts are getting squeezed","set an alert on {c} at {lvl}, will decide once it gets there","{c} up {pct}% {t}, I'm not chasing that","{c} down {pct}% {t}, adding or waiting? ngl I'm a little nervous","the {pat} on {c} {tf} is the only chart I trust today","cut my {c} for a small loss, {zone} did not hold","the {c2}/{c} ratio is doing something weird {t}","{c} sitting right on {zone}, this is the decision point","watching {c} and {c2} together {t}, they keep moving as a pair","{c} volume is dead on the {tf}, I'd stay small","looking for a {side} on {c} but only if {ind} agrees","{c} has been range bound {t}, breakout either way soon","{c} {tf} candle closed strong, {zone} is the next test","trimmed some {c} {t}, locking in {pct2}% and letting the rest ride","my {c} {side} is up {pct2}% and I moved my stop to break even"];
const REACT=["that {pat} looks valid but I'd wait for the {tf} close","I'm watching {zone} too","{ind} is what I'd check before entering","waiting for {lvl} like everyone else tbh","fair, I keep size small when volume is this thin","same, got stopped out twice {t} lol","ngl that's a solid plan","nah I think it fakes out first","respect for having a stop","honestly I'd rather miss it than chase","I'd wait for a retest, no rush","lol every time I buy it dips","exactly why I only risk {pct2}% per trade","good eye 👀","this is the way","yeah the {tf} looks cleaner than the {tf} below it","I took the opposite side, we'll see who's right 😅","same setup, different coin 😂","the market loves to punish impatience","thanks for sharing the level, adding it to my chart","that's the same level I have marked","bold, I'd want more confirmation","not financial advice but that stop makes sense","this is why journaling helps, you'd see the pattern","nice, keep us posted","I got in earlier, now just managing the risk","if it loses {zone} I'm out, simple as that","been watching this exact thing since {t}","price respects that zone every time","hmm, risky with the news coming","never said it was easy 😂","lowkey the best read I've seen today"];
const FQ=[["what's your stop on that?",["just under {zone}, risking about {pct2}%","below the last swing low, nothing fancy","{pct2}% of the account max, whatever the distance"]],["what timeframe are you using?",["mostly the {tf}, then I zoom out to confirm","{tf} for the entry, daily for the bias"]],["how big is the position?",["small. {pct2}% risk, the size just follows from the stop","small enough that I won't care if it stops out"]],["are you using {ind}?",["yeah, together with price action, never by itself","only as confirmation, price first"]],["where's your target?",["first at {lvl}, then I trail the rest","next resistance, nothing greedy"]],["is it too late to get in?",["I'd rather wait for a pullback than chase it","depends on your stop, if the risk is small it's fine"]]];
const QUESTIONS=[["what's everyone using for entries, limit orders or market?",["limit almost always, you control the price and the fees are lower","market when it's fast, limit when I have time","I set a limit near {zone} and walk away"]],["is {ind} actually useful or am I overthinking it?",["useful as a second opinion, never as the only reason to trade","I dropped half my indicators and my results got better","{ind} is fine if you know what it measures"]],["how do you size a {c} trade with a {pct2}% stop?",["risk amount divided by the stop distance, that's your size","decide the dollar loss you can accept first, size comes after"]],["should I take profit on {c} or let it run?",["I take half at the first target and trail the rest","write the plan before the trade, not during it","there's no right answer, but having a rule beats guessing"]],["is it too late to get into {c}?",["nobody knows, so I buy in parts instead of all at once","if you're scared of being late, you're probably sizing too big","dca and stop worrying about the perfect entry"]],["{c} or {c2} for the next month?",["I'd rather hold both small than pick a winner","{c} for me, the chart is cleaner","depends, are you trading it or holding it?"]],["how do you deal with {emo} after a loss?",["I step away for an hour, charts will still be there","write down what happened, it takes the emotion out of it","reduce size for the next trades until you're calm again","I stop after {n} losses in a day, rule is rule"]],["what do you do when the market is just choppy?",["nothing. sitting out is a position too","smaller size and wider patience","I go for a walk honestly 😂"]],["how many trades a day is normal?",["quality over quantity, 1 to 3 for me","some days zero, and that's fine","more trades usually means more fees and more mistakes"]],["does anyone actually make money with {tf} charts?",["yes but it takes screen time and discipline","I found the {tf} less noisy than lower timeframes","start higher, you get fewer but better signals"]],["how do you pick which coin to trade?",["liquidity first, I stay with coins that have volume","I stick to {c} and {c2}, I know how they move","I only trade what I understand, meme coins are for tiny bets"]],["is it better to trade spot or use leverage?",["spot until you're consistent for months","leverage is a tool, not a strategy","if you have to ask, stay with spot for now"]],["what's the best time of day to trade?",["the US open has the most volume for me","I avoid the first few minutes after big news","whenever you can watch the screen without stress"]],["how do you handle a trade that goes against you right away?",["it either hits the stop or it doesn't, I don't touch it","I don't average down, ever","that's what the stop is for"]],["anyone else journaling their trades?",["yes, it's the best habit I picked up","screenshots with notes, takes two minutes","started last month and already spotted my mistakes"]],["what's a realistic monthly return?",["anything consistent beats screenshots of 100x","protect capital first, the return follows","people brag about wins, nobody posts the losses"]]];
const TAKES=["{c} is the strongest chart on my list right now","honestly the best trade {t} was the one I didn't take","everyone's bullish on {c}, which makes me nervous","{c} looks heavy, I'm staying out until {zone} breaks","I think {c} gets a squeeze if it clears {lvl}","can't believe how fast {c} moved {t}","my watchlist {t}: {c}, {c2}, and {pct2} coins I'm ignoring on purpose","no trade is also a trade, flat today","{c} reminds me of last cycle's {pat}","funding is wild on {c}, careful with leverage","{c2} has been quietly outperforming {c} {t}","weekend moves on {c} are never what they look like","I'd rather catch {pct}% on {c} with a tight stop than chase {pct}0% 😂","{ind} just turned on {c}, interesting","I keep checking {c} every {n} minutes and I hate it 😅","patience is paying off on {c} so far","I need to stop watching {c} {tf} candles, they're hypnotic","small wins on {c} {t}, feeling disciplined","rotated a bit from {c2} into {c} {t}, we'll see","can't decide between {c} and {c2}, so I'm doing neither lol","sentiment on {c} flipped fast {t}","{c} liquidity is thin {t}, spreads are wider than usual","green day, stayed calm, did nothing. best kind of day 🟢","red day on {c}, closing the chart and going outside 🔴"];
const WINS=["closed {c} {side} for +{pct2}.{n}%, stuck to the plan","stopped out on {c} for -{pct2}%, small and clean","{c} hit my first target, half off and stop to breakeven","{c} {side} got stopped right before it reversed 😭 classic","finally followed my rules on {c} and it paid 🙏","three losses in a row on {c}, sizing down tomorrow","{c} setup played out exactly as drawn, rare 😂","took profit early on {c}, it ran another {pct}%. I'm fine with it"];
const THX=["thanks, that helps 🙏","ok that makes sense","never thought of it that way","saving this","appreciate it 🙌","good tip, writing it down"];
function gSetup(){const x=X(),a=who(Math.random()<.5?"vet":"chat"),out=[[0,a,sub(pick(SETUP),x)]];const n=ri(1,3);for(let i=0;i<n;i++)out.push([4+i*4,who("chat"),sub(pick(REACT),x)]);
  if(Math.random()<.45){const [q,ans]=pick(FQ),b=who(Math.random()<.5?"new":"chat");out.push([6,b,sub(q,x)]);out.push([6,a,sub(pick(ans),x)])}return out}
function gQuestion(){const x=X(),[q,ans]=pick(QUESTIONS),a=who(Math.random()<.6?"new":"chat"),out=[[0,a,sub(q,x)]],k=ri(1,Math.min(3,ans.length)),pool=ans.slice().sort(()=>Math.random()-.5);
  for(let i=0;i<k;i++)out.push([5+i*4,who(i?"chat":"vet"),(i===0&&Math.random()<.6?mention(a)+" ":"")+sub(pool[i],x)]);if(Math.random()<.55)out.push([6,a,pick(THX)]);return out}
function gTake(){const x=X(),a=who("chat"),out=[[0,a,sub(pick(TAKES),x)]];const n=ri(1,2);for(let i=0;i<n;i++)out.push([5+i*4,who("chat"),sub(pick(REACT),x)]);return out}
function gWin(){const x=X(),a=who("chat"),out=[[0,a,sub(pick(WINS),x)]];out.push([5,who("vet"),pick(["that's how it's done","a small loss is just the cost of doing business","consistency beats hero trades","respect for sharing the loss too","nice discipline"])]);if(Math.random()<.5)out.push([5,who("chat"),sub(pick(REACT),x)]);return out}
const recent=[];
function fresh(f){for(let i=0;i<10;i++){const t=f(),k=typeof t[0][2]==="string"?t[0][2].toLowerCase().slice(0,60):"";if(!k||!recent.includes(k)){if(k){recent.push(k);if(recent.length>400)recent.shift()}return t}}return f()}

const F={lounge:[gSetup,gSetup,gSetup,gSetup,gSetup,gQuestion,gQuestion,gQuestion,gQuestion,gTake,gTake,gTake,gWin,gWin,topicThread,topicThread,modThread,meme,poll,()=>qa("loans"),()=>qa("new"),()=>qa("new"),banter]};
const REPLY=[[/\b(hi|hey|hello|gm|good (morning|evening))\b/i,["gm 👋 welcome in","hey, glad you are here 👋","hello! what are you trading these days?"]],
[/\b(loan|borrow|collateral|repay|late fee)\b/i,["the loan screen shows the collateral, fees and every payment date before you confirm. read it carefully and only borrow what you can repay"]],
[/\b(btc|bitcoin)\b/i,["BTC around __BTC__ here. I keep my size small until it picks a direction","bitcoin sets the mood for everything else so I watch it first"]],
[/\b(eth|ethereum)\b/i,["ETH has been choppy for me, I wait for clean levels"]],[/\b(sol|solana)\b/i,["SOL moves fast so I always use a stop and keep size modest"]],
[/\b(scam|safe|trust|seed)\b/i,["never share your seed phrase and double check every link. anyone promising guaranteed profit is a scam, walk away"]],
[/\?$/,["good question, depends on your timeframe and risk. what are you trying to do?","I would start small and write down your plan first","someone with more experience can add more, but I would keep position size small"]]];
const GENERIC=["interesting take","fair point","I think it depends on your risk","same here, still learning every day","good one 👌","true"];

/* ---- state ---- */
const state={room:"lounge",newCount:0,msgs:{lounge:[]},open:false,online:ri(380,620),nid:1,greeted:false,voted:{}};
const TYPOS=[[/\bthe\b/,"teh"],[/\bthink\b/,"thnk"],[/\bdefinitely\b/,"definately"],[/\bbecause\b/,"bc"],[/\bhonestly\b/,"honestly tbh"],[/\byou\b/,"u"],[/\bto be honest\b/,"tbh"],[/\bright now\b/,"rn"]];
function human(p,t){if(typeof t!=="string"||p.me||!p.style||p.role==="mod")return t;const st=p.style;
  if(st.lower)t=t.charAt(0).toLowerCase()+t.slice(1);
  if(st.terse&&t.length>90&&Math.random()<.5)t=t.split(/[.,] /)[0];
  if(st.typo&&Math.random()<.35){const x=pick(TYPOS);t=t.replace(x[0],x[1])}
  if(st.lower&&Math.random()<.5)t=t.replace(/[.]$/,"");
  if(st.emoji&&Math.random()<.3)t+=" "+pick(["😅","👀","💀","🫡","🤝","😬"]);
  return t}
/* ---- Scenes: a group of members stays on ONE live topic for 10-30 minutes, then drifts to the next ---- */
let gold=0;
function loadGold(){try{fetch("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd").then(r=>r.json()).then(j=>{const v=j&&j["pax-gold"]&&j["pax-gold"].usd;if(v>500)gold=v}).catch(()=>{})}catch(e){}}
const R=v=>lf(rn(v)),usdc=n=>"$"+Math.round(n).toLocaleString("en-US");
const ACK=["my bad, thanks 🙏","ah right, I mixed that up","oh good catch, thanks","ok yeah I had that wrong","lol I stand corrected","thanks, still learning","yep you're right, wrong number in my head"];
const CONF=["^ this","yep that's right","correct, same here","this is accurate","exactly","yeah, can confirm"];
const GR=["same","this 💯","facts","lol true","fair point","been there","yeah I noticed that too","honestly yes","hmm not sure I agree","respect","interesting","that's what I've been seeing","good point","I was thinking the same"];
const STORY=[["I got stopped out {t} and it reversed right after. classic","b"],["added too early {t} and had to sit through the dip","b"],["missed the bounce yesterday because I hesitated","b"],["took a small loss {t} and walked away instead of revenge trading, felt good","g"],["closed a position for a small win {t} and went to the gym instead of looking at charts","g"],["I've been flat since {t} and honestly it's been peaceful","g"],["started journaling {t}, my mistakes are so repetitive 😅","n"],["my last {n} trades were all small scratches, boring but I'll take it","n"]];
const SRB=["rough, we've all been there","ouch 😬","brutal, hope you're ok","been there, it gets better","lol same thing happened to me","happens to everyone"],SRG=["nice, that's discipline","that's a solid way to handle it","love that, keeps you sane","respect for sticking to the plan"];
const WRAP=["alright I'll leave it there, good chat","ok that's enough charts for me, going to grab food 🍕","thanks everyone, this was actually useful","I'm done for now, will check back later","good discussion, learned a couple of things"];
const TRANS=["unrelated but ","btw ","random thought: ","ok different topic, ","speaking of which, ",""];
const CHATTER=["gm everyone ☀️","coffee first, charts second","market feels slow today","lol this chat is the best part of my day","anyone else trading from their phone right now?","need a break from the screen 😅","this lounge is getting busy"];
const TOPICS2=[
{id:"fear",
open:["everything is red today. btc at {btc} and the fear index is basically on the floor. are you buying or sitting out?","feels like capitulation vibes. is anyone actually buying this or are we all just watching?","btc {chg} on the day and sentiment is in extreme fear. interesting, but I'm still not rushing","ok so btc is testing {sup} again. what's the plan if it breaks?"],
say:["I'm not catching knives, I want to see a base first","if {sup} goes, the next area I'm watching is around {sup2}","daily RSI is oversold, but oversold can stay oversold for weeks","funding is negative which means shorts are paying longs, usually a sign people are leaning too short","volume is thin so stops are getting run, keep size small","I'm just dca'ing the same amount every week and trying not to look at the chart","alts are down way more than btc, that's what hurts the most","I'd want a daily close back above {res} before I trust any bounce","I scaled in a little at {btc}, very small, with a stop under {sup}","the last liquidation flush cleared a lot of leverage, that's usually healthy","being flat is a position too, and it's paying me right now","I read the sentiment index as a contrarian signal, not a timing tool","remember we're down roughly {dd}% from the all-time high, so it's been a slow bleed, not a one day crash","if it reclaims {res} I'll think about adding, until then I do nothing"],
ask:[["is this a good time to buy or are we going lower?",["nobody knows, so split it into parts instead of one entry","for a trade, wait for a reclaim of {res}. for long term dca, just keep going","depends on your timeframe, what's yours?"]],["where do you guys put your stop here?",["under {sup}, because that's where buyers showed up last time","I use a percent of account instead of a level, usually 1 to 2%","below the last swing low on the 4h"]],["how long do these fear periods usually last?",["no fixed rule, sometimes days, sometimes months","longer than you want and shorter than it feels 😅"]],["should I wait for the bottom?",["you won't catch the exact bottom, nobody does. scaling in beats guessing","I'd rather buy 3 times than try to pick one candle"]]],
err:[["we're down like 80% from the top right now",["not 80%, it's closer to {dd}% from the all-time high. the 80% drops were 2018 and 2022","more like {dd}% from the high, 80% was the older bear markets"]],["extreme fear means a crash is coming",["it's a sentiment reading, not a prediction. extremes have often been near lows, not before crashes","not really, fear readings usually show up after the drop, not before it"]],["oversold means price has to bounce today",["no, oversold just means stretched, it can keep grinding lower","oversold isn't a buy signal by itself, it can stay that way a long time"]],["negative funding means price must go down",["negative funding means shorts pay longs, which often shows crowded shorts. it isn't a direction call","it just tells you who's paying whom, it doesn't call direction"]]],
debate:[["buying fear is the best long term play","only if you size for it to go lower first, buying the first dip has burned a lot of people"]]},
{id:"gold",
open:["gold is slipping again too. I thought it was supposed to be the safe haven?","§ggold around {gold} and still dropping. everything is getting sold, not just crypto","who's trading gold alongside crypto? futures or PAXG?"],
say:["a stronger dollar and higher yields hurt gold more than fear helps it","gold had a massive run, so a pullback isn't shocking","when everything gets sold, people sell what has profit in it to cover losses elsewhere, gold included","PAXG is a token backed by physical gold, so it tracks spot gold. handy if you want gold in the same wallet","§gI'm watching the {goldlvl} area for gold now","I keep a small gold position as a hedge, but it doesn't always act like one short term","gold and btc have been falling together, correlation goes up in a panic","real yields are the thing to watch for gold","I don't trade gold on CPI or Fed days, too whippy","gold moves slower than crypto, which is why I like it for balance"],
ask:[["is PAXG actually backed by gold?",["yes, each token is backed by one fine troy ounce of gold held by Paxos, and they publish attestations","backed 1:1 by physical gold in vaults, but read their docs before putting size in"]],["why does gold drop when there's fear? shouldn't it go up?",["in a liquidity squeeze people sell whatever is liquid, gold included","it often rises with fear but not always, rates and the dollar can overpower it"]],["gold or btc as a hedge?",["different animals. gold is the older store of value, btc is higher risk and more volatile","I hold some of both, just size btc smaller than you think"]]],
err:[["§ggold is at {goldw} right now",["it's around {gold}, {goldw} was a couple of years ago","spot is near {gold}, you're looking at an old price"]],["gold is quoted per gram on the big markets",["spot gold is quoted per troy ounce, which is about 31 grams","per troy ounce, not per gram, that's about 31.1 grams"]],["PAXG is just a coin with nothing behind it",["it's backed by physical gold, Paxos holds it and publishes reports","not true, each PAXG is redeemable against allocated physical gold, there are fees though"]],["gold and btc always move in opposite directions",["not always, in a sell off like this they've both dropped","correlation changes over time, lately they've moved together a lot"]]],
debate:[["gold is the real safe haven, btc is just a risk asset","btc trades like a risk asset in a panic, but that's not the whole story long term"]]},
{id:"fed",
open:["fed minutes today. are you flat or trading the release?","CPI and Fed days always wick both directions. what's your approach?","everyone's waiting on the minutes, volume is dead until then"],
say:["I cut size before the release, spreads widen right at the print","the first move is usually the fake one, I wait for the second","I just close the laptop on news days honestly","the market moves on rate expectations more than the actual numbers","higher for longer is hard on risk assets","a hawkish tone usually pressures btc and gold both","liquidity thins out right before big releases, that's when you get random wicks","I don't predict the number, I only react to the reaction","limit orders only around news, market orders get destroyed by slippage","every release looks obvious after the fact 😅"],
ask:[["what are the minutes exactly? new to this",["notes from the previous Fed meeting, released a few weeks after. they show how members discussed rates","a written summary of the last meeting's discussion. the decision was already announced back then"]],["do rate hikes hurt crypto?",["tighter policy tends to pressure risk assets because money gets more expensive","usually in the short run, but it depends on what the market had already priced in"]],["why does price wick so much on news?",["liquidity thins out and stops get hit on both sides","algos react in milliseconds and the book is thin, so price overshoots"]]],
err:[["the fed meets every month",["it's 8 scheduled meetings a year, roughly every six weeks","not monthly, eight times a year"]],["the minutes are where they announce the rate decision",["the decision is announced at the meeting, the minutes come out about three weeks later","minutes are the notes, the decision already happened"]],["CPI is published by the Fed",["CPI comes from the Bureau of Labor Statistics, the Fed just looks at it","it's the BLS that publishes it, not the Fed"]],["higher rates always mean btc goes down",["not always, it depends on expectations, markets often move before the decision","'always' is too strong, it's more about the surprise versus what's priced in"]]],
debate:[["I trade the news, that's where the volume is","I'd rather wait 15 minutes after, the first spike is mostly noise"]]},
{id:"leverage",
open:["lost a big chunk of my account on a 20x long yesterday. what a lesson","how much leverage do you guys actually use? be honest","liquidations were wild this week, did anyone get caught?"],
say:["at 20x a 5% move against you wipes the position, that's the whole problem","I never go above 3x, I like sleeping","isolated margin so one bad trade can't touch the rest of my balance","set the stop before the entry, always","your liquidation price should be way beyond your stop, otherwise the stop is decorative","funding adds up if you hold leveraged positions for days","leverage doesn't make a good setup better, it just makes mistakes more expensive","the traders who last are the ones who size small, not the ones with the best entries","I use leverage to free up capital, not to size up risk","I got liquidated twice early on, that's why I'm careful now"],
ask:[["how do I know my liquidation price?",["your exchange shows it next to the position, check it before you enter, not after","it depends on leverage and margin, higher leverage puts it closer to your entry"]],["isolated or cross?",["isolated for anything risky, cross if you really know what you're doing","I start everyone on isolated, it caps the damage"]],["is 5x too much for a beginner?",["start at 1 to 2x until you've stuck to a plan for a few months","lower is easier to survive, and size matters more than the number"]]],
err:[["at 10x you get liquidated at exactly -10%",["slightly earlier than that, maintenance margin and fees put it more like -9%","close, but fees and maintenance margin put it a bit before -10%"]],["cross margin means you can't lose more than the position",["cross uses your whole balance as margin so one bad trade can drain it. isolated is the one that caps it","other way round, isolated caps the loss to the margin on that position"]],["a stop loss guarantees your exit price",["it doesn't, in fast markets it fills at the next available price, that's slippage","stops trigger an order, they don't guarantee a price, gaps can skip right through"]],["leverage lowers your risk because you put in less money",["it raises risk per dollar, a small move hits a bigger position","you put in less but control more, so losses scale with the full position size"]]],
debate:[["high leverage with tight stops is a legit strategy","tight stops at high leverage get hit by normal noise, I've seen it eat accounts"]]},
{id:"memes",
open:["memes are getting hit harder than majors. is the season over or is this a shakeout?","bonk, wif, pepe. which one actually holds up in a fear market?","every meme is bleeding and I'm still watching the charts like it'll change 😅"],
say:["liquidity on memes dries up fast, so keep size tiny","I only trade memes with money I'm fine losing, full stop","memes move on attention, not fundamentals, so watch volume and social buzz","when btc dumps, memes dump harder, that's beta","the spread on small memes can eat you alive when you exit","take profit in memes earlier than you think, they don't wait","if it's down 30% and your plan didn't include that, the position was too big","bonk and wif being on solana means solana's health matters for them","pepe has the biggest community of the three, that helps in a bounce, not in a crash","I'd rather hold btc and trade memes for small bursts"],
ask:[["what chain is bonk on?",["Solana, it launched as an airdrop to the Solana community","it's a Solana token"]],["is pepe supply capped?",["yes, fixed supply of around 420 trillion tokens","fixed supply, no minting, but that doesn't make it safe"]],["how big should a meme position be?",["small enough that going to zero doesn't change your month","I cap it at 1 to 2% of the account"]]],
err:[["bonk is an ethereum token",["bonk is on Solana, not Ethereum","it's Solana, that's why it moves with sol"]],["pepe has unlimited supply so it always dilutes",["pepe has a fixed supply, it can't be minted more","supply is fixed, the risk is price, not dilution"]],["wif was launched back in 2021",["dogwifhat launched in late 2023 on Solana","wif is much newer, late 2023"]]],
debate:[["memes are just gambling, stay away","it's gambling if you size it like a bet. with a tiny position and a plan it's just a high risk trade"]]},
{id:"safety",
open:["someone just DM'd me saying they're 'support' and need my seed phrase to fix my account. that's a scam, right?","reminder for the new people: nobody legit will ever ask for your seed phrase","anyone else getting spammed with fake giveaway links?"],
say:["never share your seed phrase or password, with anyone, ever","use an authenticator app for 2FA instead of sms","bookmark the real site and only log in from the bookmark","if a giveaway says send 1 get 2 back, it's a scam every time","check the url carefully, fake sites change one letter","I keep a small amount on exchange and the rest in cold storage","a screenshot of your seed phrase in your photos is a bad idea","scammers love fear markets because people get desperate","a mod will never dm you first asking for anything, report it","urgency is the trick, take a minute before clicking anything","turn on withdrawal whitelist if your platform offers it","write the seed phrase on paper and store it somewhere safe"],
ask:[["how do I tell if a site is fake?",["check the exact url, use bookmarks, and never click links from dms","real sites don't pressure you, scams always say hurry"]],["is sms 2fa enough?",["better than nothing, but an authenticator app or hardware key is safer","sim swaps are a thing, so use an app"]],["what do I do if I think I got scammed?",["move what you can to a fresh wallet, change passwords, and report it to the platform","stop sending anything, secure your accounts, and contact support through the official site"]]],
err:[["it's fine to give support the seed phrase if they're verified",["no, nobody legit needs it, verified or not, never share it","absolutely not, support never needs your seed phrase"]],["sms 2fa is the safest option",["authenticator apps or hardware keys are safer, sim swaps beat sms","sms is the weakest 2fa, use an app"]],["if you send crypto to the wrong address you can call the bank to reverse it",["crypto transfers are final, there's no bank to call, double check addresses","no reversals on chain, that's why you test with a small amount first"]]],
debate:[["I keep everything on the exchange, it's easier","easier until it isn't, I'd keep a chunk off exchange"]]},
{id:"sizing",
open:["how do you size trades, fixed dollars or percent of account?","trying to fix my risk management. with a ${acct} account how much do you risk per trade?"],
say:["I risk {rp}% per trade, whatever the setup looks like","size comes from the stop, not the other way round","position size is the risk amount divided by the stop distance","with a {stop}% stop and ${risk} at risk, that's about a ${size} position","I write the risk down before I enter, it kills the temptation to size up","if you lose {n} in a row, the {rp}% rule keeps you alive","I cut size in half after a losing streak, then build back","fees matter, small accounts get eaten by frequent trades","I treat a stop out as the cost of the system, not a mistake"],
ask:[["how do I calculate position size?",["risk amount divided by the stop distance in percent. ${risk} of risk with a {stop}% stop is about ${size}","decide how much you can lose first, then work back to size from your stop"]],["is {rp}% too small to be worth it?",["it adds up, survival comes first and returns come later","small risk lets you stay in the game long enough to get good"]]],
err:[["with a ${acct} account and {rp}% risk, that's ${risk10} per trade",["that's ${risk}, you added a zero","check the math, {rp}% of ${acct} is ${risk}"]],["the 1% rule means you only put 1% of your account in the trade",["it means you risk 1% of the account, the position itself can be bigger depending on the stop","risk and position size are different, 1% is the loss if the stop hits"]],["a wider stop means a bigger position",["opposite, a wider stop means a smaller position for the same risk","for the same dollar risk, wider stop equals smaller size"]]],
debate:[["fixed dollar risk is simpler","percent of account scales better as it grows"]]},
{id:"stops",
open:["what's killing your trades right now? mine is getting stopped out right before the move","tell me I'm not the only one getting wicked out at the lows 😅","what are people getting wrong this week? I feel like I keep chasing"],
say:["stop hunts around round numbers like {round}, I put stops a bit beyond them","chasing green candles is my biggest leak","I widen stops on news days and cut the size to match","revenge trading cost me more than any bad setup","overtrading in chop, I should have just waited","I keep moving my stop and it never ends well","most of my losses come from entering without a plan","fees plus slippage in chop add up quietly","I take fewer trades now and my results are better","the move always happens when I'm away from the screen"],
ask:[["how do you avoid getting stopped out before the move?",["put the stop beyond the level, not on it, and size smaller so you can afford the room","accept some stop outs, they're the cost of doing business"]],["how do you stop revenge trading?",["hard daily loss limit, once it's hit I'm done for the day","step away for an hour, charts will still be here"]]],
err:[["stop hunts only happen in crypto",["liquidity grabs happen in every market, stocks and forex too","not just crypto, any market with obvious stop clusters sees it"]],["moving the stop further away is how you manage risk",["moving it away increases risk. risk management means keeping the stop where the plan put it","the plan sets the stop, moving it away just takes more risk"]]],
debate:[["tight stops are always better","tight stops get hit by noise, the right stop is where the idea is wrong"]]},
{id:"etf",
open:["watching daily etf flows lately, they seem to lead the mood","are etf outflows the reason for this drop or just a symptom?"],
say:["flows are a sentiment gauge, not a magic signal","when price drops, outflows usually follow, hard to say which caused which","I check the daily flow numbers but never trade off one day","institutions rebalance on their own schedule, it's not the same as retail panic","etf demand is part of the story, macro is the other part","with an etf the custodian holds the actual coins, you just own shares","I care more about the trend of flows over weeks than a single day"],
ask:[["can I withdraw bitcoin from an etf?",["no, you own shares of the fund, the custodian holds the bitcoin","shares only, you can't withdraw coins from it"]],["is an etf better than holding btc yourself?",["different trade-offs. etf is convenient inside a brokerage, self custody gives you the coins","depends on whether you want convenience or control, and taxes"]]],
err:[["with an etf you can send the btc to your own wallet",["no, an etf gives you shares, not coins","you hold shares of the fund, the coins stay with the custodian"]],["etfs trade 24/7 like crypto",["etfs trade during stock market hours only, crypto never closes","only market hours, that's why you see gaps on monday"]]],
debate:[["etfs made btc more stable","more mainstream, but still volatile, we're seeing that now"]]},
{id:"tax",
open:["tax season is going to be a mess for me, anyone organized with their records?","do you guys track every trade for taxes or just wing it?"],
say:["not tax advice, but keep records of every trade, it saves so much pain later","most tax software can import your exchange history","tracking cost basis from day one is the whole game","I set aside a percentage of every profit when I close a winner","rules differ a lot between countries, check yours","a good accountant pays for themselves","tax loss harvesting is a thing in some places, ask a pro"],
ask:[["do I owe tax if I just hold?",["generally tax events come when you sell or swap, but rules vary, ask an accountant","in many places holding isn't a taxable event, selling or swapping is"]]],
err:[["swapping btc to eth isn't taxable until you cash out to dollars",["in the US a crypto to crypto swap counts as a disposal, check your country's rules","in many countries swaps count as taxable events, not just cashing out"]],["losses can't be used for anything",["in many places capital losses can offset gains, with limits, ask a tax pro","often you can offset gains with losses, rules and limits vary"]]],
debate:[["I'll sort the taxes at the end of the year","tracking as you go is way easier, rebuilding a year of trades is painful"]]},
{id:"alts",
open:["eth/btc keeps sliding. is it time to rotate or stay in btc?","anyone trading eth or sol here instead of btc right now?"],
say:["eth/btc is the ratio people watch for alt appetite","when btc dominance rises, alts bleed more","I hold eth for staking but trade btc for the moves","sol's been the fast one both ways","ratio trades are a different game, you can be right on direction and wrong on the pair","eth near {eth} and sol near {sol}, I'm watching both for a bounce","alts need btc to stabilize first, then they move","I'd rather add to btc in fear and rotate later if it turns","liquidity is better on majors when things get ugly"],
ask:[["what does btc dominance mean?",["btc's share of the total crypto market cap, when it rises alts usually underperform","the percentage of the whole market that's bitcoin"]]],
err:[["eth/btc going up means eth price is going up",["not necessarily, it means eth is outperforming btc, both could be falling","the ratio can rise while eth falls, if btc falls faster"]],["staking eth has no risk",["staking has risks, slashing, lockups and smart contract risk, it isn't risk free","there are risks, validator penalties and withdrawal queues, it's not risk free"]]],
debate:[["eth will catch up to btc soon","maybe, but I'd want the ratio to turn first, hope isn't a setup"]]}];
const goodLine=t=>!(t.indexOf("§g")===0&&!gold);
function ctxNow(sc){const b=px("BTC"),K=sc.K;return Object.assign({},K,{btc:R(b),sup:R(b*(1-rnd(.025,.05))),sup2:R(b*(1-rnd(.07,.11))),res:R(b*(1+rnd(.03,.06))),eth:R(px("ETH")),sol:R(px("SOL")),chg:sg(chg("BTC")),dd:String(Math.max(5,Math.round((1-b/126000)*100))),round:fp(Math.round(b/1000)*1000),gold:gold?R(gold):"",goldw:gold?R(gold*.56):"",goldlvl:gold?fp(Math.round(gold*.97/50)*50):"",t:pick(["today","this morning","since the open","last night","this week","since yesterday"]),c:pick(["btc","eth","sol"])})}
const cleanL=(t,C)=>sub(String(t).replace(/^§g/,""),C);
function pickLine(sc,arr,key,isSay){const ok=arr.filter(x=>goodLine(key?x[0]:x)&&!sc.used.has(key?x[0]:x));if(!ok.length){if(isSay)sc.dry=true;return null}const x=pick(ok);sc.used.add(key?x[0]:x);return x}
function pickU(sc,arr){const u=sc.u2||(sc.u2=new Set());let c=arr.filter(x=>!u.has(x));if(!c.length){u.clear();c=arr.filter(x=>x!==sc.lastU)}const x=pick(c);u.add(x);sc.lastU=x;return x}
function MEM(sc,roles,ex){let pool=sc.members.filter(p=>roles.indexOf(p.role)>-1&&ex.indexOf(p)<0);if(!pool.length)pool=sc.members.filter(p=>ex.indexOf(p)<0);pool=pool.concat(pool.filter(p=>sc.lead.indexOf(p)>-1));return pick(pool)}
function pickN(a,n){const c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o}
function makeScene(prevId,start,force){const pool=TOPICS2.filter(t=>t.id!==prevId&&(t.id!=="gold"||gold)),T=(force&&TOPICS2.find(t=>t.id===force&&(t.id!=="gold"||gold)))||pick(pool),by=r=>PEOPLE.filter(p=>p.role===r);
  const members=pickN(by("vet"),5).concat(pickN(by("chat"),7),pickN(by("new"),6));if(Math.random()<.4)members.push(pick(by("mod")));
  const acct=pick([2000,2500,5000,10000]),rp=pick([1,2]),stop=pick([2,3,4,5]),risk=acct*rp/100;
  return{T,id:T.id,members,lead:members.slice(0,2),start,end:start+ri(10,30)*60000,used:new Set(),last:null,lastP:null,sinceErr:0,K:{acct:acct.toLocaleString("en-US"),rp,stop,risk:risk.toLocaleString("en-US"),risk10:(risk*10).toLocaleString("en-US"),size:Math.round(risk/(stop/100)).toLocaleString("en-US"),n:ri(3,5)}}}
function beat(sc,kind){const C=ctxNow(sc),T=sc.T,out=[],F=t=>cleanL(t,C);
  const push=(p,t,re,g)=>{out.push({p,t,re,g});sc.lastP=p};
  const say=(ex)=>{const p=MEM(sc,["vet","chat","chat","new"],ex||[sc.lastP]),t=pickLine(sc,T.say,0,1);if(t)push(p,F(t),null,0);return p};
  if(kind==="open"){const p=sc.lead[0],t=pickLine(sc,T.open);push(p,(sc.trans||"")+F(t),null,0);const n=ri(1,2);for(let i=0;i<n;i++)push(MEM(sc,["chat","new","vet"],[p]),pickU(sc,GR),0,ri(6,16));if(Math.random()<.6){say([p])}sc.sinceErr=0}
  else if(kind==="say"){const p=say();if(Math.random()<.4){const q=MEM(sc,["chat","new","vet"],[p]);push(q,pickU(sc,GR),0,ri(6,16))}}
  else if(kind==="ask"){const a=pickLine(sc,T.ask,1);if(!a)return beat(sc,"say");const asker=MEM(sc,["new","new","chat"],[sc.lastP]);push(asker,F(a[0]),null,0);
    const ans=a[1].slice().sort(()=>Math.random()-.5),r1=MEM(sc,["vet","vet","chat"],[asker]);push(r1,(Math.random()<.6?mention(asker)+" ":"")+F(ans[0]),0,ri(8,20));
    if(ans[1]&&Math.random()<.5){push(MEM(sc,["vet","chat"],[asker,r1]),F(ans[1]),0,ri(8,18))}
    if(Math.random()<.6)push(asker,pick(["thanks, that helps 🙏","ok that makes sense","never thought of it that way","saving this","appreciate it 🙌","good tip, writing it down"]),out.length-1,ri(8,18))}
  else if(kind==="err"){const e=pickLine(sc,T.err,1);if(!e)return beat(sc,"say");const w=MEM(sc,["chat","new"],[sc.lastP]);push(w,F(e[0]),null,0);
    const fx=MEM(sc,["vet","vet","chat"],[w]);push(fx,(Math.random()<.65?mention(w)+" ":"")+F(pick(e[1])),0,ri(9,24));
    if(Math.random()<.5)push(MEM(sc,["chat","vet"],[w,fx]),pickU(sc,CONF),1,ri(6,14));
    if(Math.random()<.75)push(w,pickU(sc,ACK),1,ri(7,16));sc.sinceErr=-1}
  else if(kind==="story"){const st=pickU(sc,STORY),p=MEM(sc,["chat","new","vet"],[sc.lastP]),pool=st[1]==="b"?SRB:st[1]==="g"?SRG:GR;push(p,F(st[0]),null,0);const n=ri(1,2),seen=[p];for(let i=0;i<n;i++){const q=MEM(sc,["chat","vet","new"],seen);seen.push(q);push(q,pickU(sc,pool),0,ri(6,16))}}
  else if(kind==="debate"){const d=pickLine(sc,T.debate||[],1);if(!d)return beat(sc,"say");const a=MEM(sc,["chat","vet"],[sc.lastP]),b=MEM(sc,["vet","chat"],[a]);push(a,d[0],null,0);push(b,F(d[1]),0,ri(8,18));if(Math.random()<.6)push(a,pickU(sc,["fair, I'll give you that","hmm ok, good point","maybe, I still lean my way though","true, depends on the person"]),1,ri(8,18))}
  else if(kind==="chat"){push(MEM(sc,["chat","new"],[sc.lastP]),pickU(sc,CHATTER),null,0)}
  else if(kind==="wrap"){push(MEM(sc,["vet","chat"],[sc.lastP]),pick(WRAP),null,0)}
  return out}
function pickKind(sc){sc.sinceErr++;if(sc.sinceErr>=5)return"err";const r=Math.random();return r<.34?"say":r<.51?"ask":r<.63?"story":r<.71?"debate":r<.84?"chat":sc.sinceErr>=3?"err":"say"}
/* ================= FEED: posts, photos, comments (replaces the old chat UI) ================= */
const TICKRE=/\b(btc|eth|sol|bonk|wif|pepe|bnb|xrp)\b/gi;
const tk=t=>String(t).replace(TICKRE,m=>"$"+m.toUpperCase());
const CHGC={};
const chgS=s=>{try{const e=S.mk[s];if(e&&typeof e.chg==="number")return e.chg}catch(_){}return CHGC[s]!==undefined?CHGC[s]:(CHGC[s]=rnd(-5,5))};
const pxS=s=>{try{const e=S.mk[s];if(e&&e.p>0)return e.p}catch(_){}return{BTC:64000,ETH:2500,SOL:130,BNB:600,XRP:2,BONK:.00002,WIF:.8,PEPE:.000008}[s]||100};
const TM={
 fear:{e:"📉",g:["#2b0a14","#d6455d"],syms:["BTC","ETH"],h:[C=>`Fear index hits extreme as BTC slides toward ${C.btc}`,C=>`Why traders are split as bitcoin tests ${C.sup}`]},
 gold:{e:"🥇",g:["#3d2b08","#f0b90b"],syms:["BTC","ETH"],h:[C=>`Gold slips${C.gold?" near "+C.gold:""} as the dollar firms up`,C=>"Gold and bitcoin fall together: what is driving it?"]},
 fed:{e:"🏦",g:["#0b1f3a","#2f7bff"],syms:["BTC","ETH"],h:[()=>"Fed minutes today: what traders are watching",()=>"Rate expectations move markets again"]},
 leverage:{e:"⚡",g:["#3a1208","#ff7a2f"],syms:["BTC","SOL"],h:[()=>"Over-leveraged longs get flushed in a sharp move",()=>"The leverage mistake that wipes accounts"]},
 memes:{e:"🐸",g:["#0d3320","#27c26b"],syms:["BONK","WIF","PEPE"],h:[()=>"Meme coins fall harder than majors in the selloff",()=>"Is the meme season over or just a shakeout?"]},
 safety:{e:"🛡️",g:["#2a1040","#9b6bff"],syms:["BTC"],h:[()=>"Scam alert: fake support DMs asking for seed phrases",()=>"5 habits that keep your crypto safe"]},
 sizing:{e:"🎯",g:["#0b2c33","#18c3d6"],syms:["BTC"],h:[()=>"Position sizing: the one rule that keeps accounts alive",()=>"How much should you risk per trade?"]},
 stops:{e:"🛑",g:["#3a0d0d","#ef4a4a"],syms:["BTC","SOL"],h:[()=>"Why stop-outs cluster around round numbers",()=>"From emotional trades to disciplined growth"]},
 etf:{e:"🏛️",g:["#12253d","#4aa3ff"],syms:["BTC","ETH"],h:[()=>"Spot ETF flows turn negative again",()=>"ETF vs self-custody: what is the difference?"]},
 tax:{e:"🧾",g:["#2b2b10","#d9c23a"],syms:["BTC","ETH"],h:[()=>"Crypto tax season checklist",()=>"Keep records now, save headaches later"]},
 alts:{e:"🔀",g:["#1d1240","#7a5cff"],syms:["ETH","SOL"],h:[()=>"ETH/BTC ratio sits near multi-month lows",()=>"Altcoins bleed as bitcoin dominance rises"]}};
const PAIR={BTC:"BTCUSDT",ETH:"ETHUSDT",SOL:"SOLUSDT",BNB:"BNBUSDT",XRP:"XRPUSDT",BONK:"BONKUSDT",WIF:"WIFUSDT",PEPE:"PEPEUSDT"};
let rs=1;const rr=()=>{rs=(rs*16807)%2147483647;return rs/2147483647};
const CH={};
function chartSVG(sym,K,iv){const n=K.length,W=300,H=200,L=8,R=46,T=40,B=24;
  const cs=K.map(k=>({o:+k[1],h:+k[2],l:+k[3],c:+k[4],v:+k[5]}));
  const mn=Math.min(...cs.map(c=>c.l)),mx=Math.max(...cs.map(c=>c.h)),Y=a=>T+(H-T-B)*(1-(a-mn)/(mx-mn||1)),sx=(W-L-R)/n;
  const last=cs[n-1].c,ch=(last/cs[0].o-1)*100,col0=ch>=0?"#0ecb81":"#f6465d";
  let g="";for(let i=0;i<6;i++){const y=T+(H-T-B)*i/5,val=mx-(mx-mn)*i/5;g+=`<line x1="${L}" x2="${W-R+4}" y1="${y}" y2="${y}" stroke="#2b3139" stroke-width=".5"/><text x="${W-R+7}" y="${y+2.5}" fill="#848e9c" font-size="7">${fp(val)}</text>`}
  let k="";cs.forEach((c,i)=>{const x=L+i*sx+sx/2,col=c.c>=c.o?"#0ecb81":"#f6465d",y1=Y(Math.max(c.o,c.c)),y2=Y(Math.min(c.o,c.c));k+=`<line x1="${x}" x2="${x}" y1="${Y(c.h)}" y2="${Y(c.l)}" stroke="${col}" stroke-width=".8"/><rect x="${x-sx*.33}" y="${y1}" width="${sx*.66}" height="${Math.max(.8,y2-y1)}" fill="${col}"/>`});
  const pts=cs.map((c,i)=>{const a=cs.slice(Math.max(0,i-8),i+1).reduce((t,q)=>t+q.c,0)/Math.min(i+1,9);return(L+i*sx+sx/2).toFixed(1)+","+Y(a).toFixed(1)}).join(" ");
  const ly=Y(last),vol=cs.reduce((t,c)=>t+c.v,0);
  return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${sym} chart" text-rendering="geometricPrecision"><rect width="${W}" height="${H}" rx="10" fill="#161a1e"/><text x="10" y="16" fill="${col0}" font-size="13" font-weight="700">${fp(last)}</text><text x="10" y="28" fill="#848e9c" font-size="7.5">${PAIR[sym]||sym+"USDT"} · ${iv} · ${sg(ch)} over ${n} candles</text><text x="${W-10}" y="14" fill="#848e9c" font-size="7" text-anchor="end">Binance live data</text>${g}${k}<polyline points="${pts}" fill="none" stroke="#f0b90b" stroke-width=".9"/><line x1="${L}" x2="${W-R+4}" y1="${ly}" y2="${ly}" stroke="#848e9c" stroke-width=".6" stroke-dasharray="2 2"/><rect x="${W-R+2}" y="${ly-5}" width="42" height="10" rx="2" fill="#2b3139"/><text x="${W-R+6}" y="${ly+2.5}" fill="#eaecef" font-size="7">${fp(last)}</text><text x="${L}" y="${H-8}" fill="#848e9c" font-size="6.5">Volume ${kfmt(Math.round(vol))} ${sym} · MA(9)</text></svg>`}
async function fetchCharts(){
  for(const [s,iv] of [["BTC","4h"],["ETH","4h"],["SOL","1h"]]){
    try{const c=new AbortController(),to=setTimeout(()=>c.abort(),8000);
      const r=await fetch("https://api.binance.com/api/v3/klines?symbol="+PAIR[s]+"&interval="+iv+"&limit=48",{signal:c.signal});clearTimeout(to);
      const k=await r.json();if(Array.isArray(k)&&k.length>20)CH[s]={k,iv}}catch(_){}}
  /* attach real charts to some existing discussion posts */
  let ch=false;postsList.forEach(P=>{if(P.kind==="say"&&!P.media&&Math.random()<.35){const ss=(TM[P.topic]||TM.fear).syms.filter(x=>CH[x]);if(ss.length){const s=pick(ss);P.media={t:"chart",svg:chartSVG(s,CH[s].k,CH[s].iv),sym:s};P.chips=[s];ch=true}}});
  if(ch&&state.open)render()}
function artSVG(tm,seed){rs=(seed*104729+5)%2147483647||9;let d="";for(let i=0;i<9;i++)d+=`<circle cx="${rr()*320}" cy="${rr()*150}" r="${6+rr()*30}" fill="#fff" opacity="${.04+rr()*.08}"/>`;
  return`<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tm.g[0]}"/><stop offset="1" stop-color="${tm.g[1]}"/></linearGradient></defs><rect width="320" height="150" fill="url(#g${seed})"/>${d}<text x="160" y="98" font-size="64" text-anchor="middle">${tm.e}</text></svg>`}
const ICON={
 cm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
 rp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
 lk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v10H3V11z"/><path d="M7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 21H7"/></svg>',
 vw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 20v-6M12 20V6M18 20v-9"/></svg>',
 sh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5l7 7-7 7v-4c-6 0-10 2-12 5 1-7 5-11 12-11z"/></svg>',
 ar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>'};
const kfmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e4?(n/1e3).toFixed(1)+"K":n>=1e3?(n/1e3).toFixed(1)+"K":String(n);
const postsList=[];
function neg(t){return /(stopped|stop out|loss|lost|dip|missed|rough|revenge|liquidat|wicked|bleed)/i.test(t)}
function makePost(sc,kind,ts,live){
  const msgs=beat(sc,kind);if(!msgs.length)return null;
  const h=msgs[0],p=h.p,C=ctxNow(sc),tm=TM[sc.id]||TM.fear,id=state.nid++;
  const P={id,p,ts,kind,text:tk(human(p,h.t)),media:null,chips:[],tag:null,comments:[],likes:0,reposts:0,views:0,fresh:!!live,topic:sc.id};
  const ropen=kind==="open",r=Math.random();
  if(kind==="say"&&r<.38){const ss=tm.syms.filter(x=>CH[x]);if(ss.length){const s=pick(ss);P.media={t:"chart",svg:chartSVG(s,CH[s].k,CH[s].iv),sym:s}}}
  const chipSyms=(P.media&&P.media.t==="chart")?[P.media.sym]:(kind==="open"||kind==="say")?tm.syms.slice(0,Math.random()<.5?1:2):[];
  P.chips=chipSyms;
  if(kind==="ask")P.tag="Question";
  else if(p.role==="vet"&&Math.random()<.4)P.tag="Top traders by profit in 30D";
  else if(P.media&&(P.media.t==="chart"||kind==="say")&&Math.random()<.6)P.tag=chgS("BTC")<0?"Bearish":"Bullish";
  const role=p.role==="vet"?3:p.role==="mod"?2:1,age=Math.max(0,(Date.now()-ts)/3600000);
  P.likes=Math.floor(ri(0,6)*role*(1+age*.5));P.reposts=Math.floor(P.likes*rnd(.03,.18));P.views=Math.floor(P.likes*ri(25,90)+ri(60,500)+age*ri(80,400));
  let t=ts;msgs.slice(1).forEach(m=>{t+=m.g*1000+ri(3,12)*1000;P.comments.push({p:m.p,t:tk(human(m.p,m.t)),ts:t,likes:Math.random()<.35?ri(1,9):0})});
  return P}
function addPost(P,top){postsList.unshift(P);if(postsList.length>70)postsList.pop();
  if(top&&state.open)prependEl(P)}
/* ---- rendering ---- */
const tagCls=t=>t==="Bearish"?"bear":t==="Bullish"?"bull":t==="Question"?"qn":"top";
const txt2=t=>esc(t).replace(/\$[A-Z]{2,6}\b/g,m=>`<span class="tk">${m}</span>`).replace(/@[\w.]+/g,m=>`<span class="at">${m}</span>`);
function mediaHtml(P){const m=P.media;if(!m||m.t==="none")return"";
  if(m.t==="chart")return`<div class="cmImg">${m.svg}</div>`;
  if(m.t==="news"){const cov=m.img?`<div class="cover"><img src="${esc(m.img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><span class="lab">${ICON.ar}Article</span></div>`:"";
    return`<a class="cmArt cmNews" href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${cov}<div class="ttl">${esc(m.title)}</div><div class="src">${esc(m.src)} · ${ago(m.pub)} ↗</div></a>`}
  if(m.t==="art")return`<div class="cmArt"><div class="cover">${m.svg}<span class="lab">${ICON.ar}Article</span></div><div class="ttl">${esc(m.title)}</div></div>`;
  if(m.t==="trade")return`<div class="cmTr"><b>${m.pair}</b><span class="pp">Perp</span><span class="pp sd">${m.side}</span><b class="pnl ${m.pnl>=0?"w":"l"}">${m.pnl>=0?"+":"-"}${Math.abs(m.pnl).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} USDT</b></div>`;
  if(m.t==="live")return`<div class="cmLive"><span class="lb"><i></i>LIVE</span><span class="lw">👤 ${m.n}</span><div class="lav">${avatar(P.p)}</div></div>`;
  return""}
function chipsHtml(P){return P.chips.length?`<div class="cmChips">${P.chips.map(s=>{const c=chgS(s);return`<span class="chip" data-s="${s}">${s} <b class="${c>=0?"up":"dn"}">${sg(c)}</b></span>`}).join("")}</div>`:""}
function commentHtml(c){return`<div class="cmC"><div class="cmA s2">${avatarInner(c.p)}</div><div class="cb"><div><b class="cn" style="color:${c.p.nc}">${esc(c.p.n)}</b><span class="ago" data-ts="${c.ts}">${ago(c.ts)}</span></div><div class="ct">${txt2(c.t)}</div></div></div>`}
const myUid=()=>{try{return S.uid}catch(_){return null}};
function avatarInner(p){if(p.me){const u=myUid();if(u&&typeof avSvg==="function")return avSvg(u)+(window.ntImg?ntImg(u):"");p.num=u||"me"}return `${esc((p.n[0]||"?").toUpperCase())}${p.img?(window.ntImg?window.ntImg(p.num):`<img src="${esc(p.img)}" alt="" onerror="this.remove()">`):""}`}
function avatar(p,cls){if(p.me)p.num=myUid()||"me";return `<div class="cmA${cls?" "+cls:""}" style="background:${p.me?"var(--accent,#2f7bff)":p.c}">${avatarInner(p)}</div>`}
function postInner(P){const p=P.p,open=state.openC[P.id],badge=p.role==="mod"?`<span class="bd">${GEM("#8b5cf6",14)}MOD</span>`:p.role==="vet"?`<span class="vf" title="Verified">${GEM("#f0b90b",15)}</span>`:"";
  const live=P.media&&P.media.t==="live";
  return`<div class="cmRow">${live?`<div class="cmA ph" style="background:${p.c}">${avatarInner(p)}</div>`:avatar(p)}<div class="cmBody"><div class="cmN"><span class="nm">${esc(p.n)}</span>${badge}<span class="dot">•</span><span class="ago" data-ts="${P.ts}">${ago(P.ts)}</span>${P.tag?`<span class="tg ${tagCls(P.tag)}">${esc(P.tag)}</span>`:""}<button class="x" data-a="x" aria-label="Hide post">×</button></div>
  <div class="cmT">${txt2(P.text)}</div>${mediaHtml(P)}${chipsHtml(P)}
  <div class="cmAct"><button data-a="cm" class="${open?"on":""}">${ICON.cm}<span>${P.comments.length}</span></button><button data-a="rp" class="${P.rp?"on":""}">${ICON.rp}<span>${P.reposts}</span></button><button data-a="lk" class="${P.lk?"on lk":""}">${ICON.lk}<span>${P.likes}</span></button><span class="vw">${ICON.vw}<span>${kfmt(P.views)}</span></span><button data-a="sh" aria-label="Share">${ICON.sh}</button></div>
  ${open?`<div class="cmCs">${P.comments.map(commentHtml).join("")}<div class="cmCin"><input placeholder="Add a comment" maxlength="240" autocomplete="off" aria-label="Add a comment"><button data-a="send" type="button">Post</button></div></div>`:""}</div></div>`}
function kinds(P){return"cmP"+(P.kind==="ask"?" kq":"")+(P.media&&P.media.t==="news"?" kn":"")+(P.media&&(P.media.t==="chart"||P.media.t==="trade")?" kc":"")}
function mkEl(P){const el=document.createElement("article");el.className=kinds(P);el.dataset.id=P.id;el.innerHTML=postInner(P);return el}
function elOf(id){return $("cmLog")&&$("cmLog").querySelector('.cmP[data-id="'+id+'"]')}
function refresh(P){const el=elOf(P.id);if(!el)return;let v="",f=false;const i=el.querySelector(".cmCin input");if(i){v=i.value;f=document.activeElement===i}
  el.innerHTML=postInner(P);const j=el.querySelector(".cmCin input");if(j&&v){j.value=v;if(f)j.focus()}}
function prependEl(P){const log=$("cmLog");if(!log)return;const el=mkEl(P);el.classList.add("pin");const at=log.scrollTop<40,h0=log.scrollHeight;log.insertBefore(el,log.firstChild);
  if(!at){log.scrollTop+=log.scrollHeight-h0;state.newCount++;showNew()}
  while(log.children.length>Math.max(70,state.lim||14))log.lastElementChild.remove()}
function render(){const log=$("cmLog");log.innerHTML="";const f=document.createDocumentFragment();postsList.slice(0,state.lim||14).forEach(P=>f.appendChild(mkEl(P)));log.appendChild(f);const m=$("cmMore");if(m)m.style.display=postsList.length>(state.lim||14)?"block":"none"}
function showNew(){const b=$("cmNew");if(!b)return;b.textContent="↑ "+state.newCount+(state.newCount===1?" new post":" new posts");b.style.display=state.newCount?"block":"none"}
const ago=t=>{const s=Math.max(0,(Date.now()-t)/1000);return s<60?"now":s<3600?Math.floor(s/60)+"m":s<86400?Math.floor(s/3600)+"h":new Date(t).toLocaleDateString([],{month:"short",day:"numeric"})};
const GEM=(c,s)=>`<svg width="${s||14}" height="${s||14}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="${c}"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
/* ---- scheduling ---- */
function schedule(P){ /* comments for a live post arrive one by one, then likes and views creep up */
  const all=P.comments.slice();P.comments=[];const t0=Date.now();
  all.forEach(c=>{const d=Math.max(1500,c.ts-P.ts);setTimeout(()=>{c.ts=Date.now();P.comments.push(c);if(state.open)refresh(P)},d)})}
function newLive(sc,kind){const P=makePost(sc,kind,Date.now(),true);if(!P)return;schedule(P);addPost(P,true)}
function live(){const sc=state.scene;
  if(Date.now()>sc.end||sc.dry){const n=makeScene(sc.id,Date.now());n.trans=pick(TRANS);state.scene=n;newLive(n,"open");n.trans=""}
  else newLive(sc,pickKind(sc));
  setTimeout(live,ri(30,85)*1000)}
function seedFeed(){const now=Date.now();let prev=null,sc=null;
  [[21*3600,3],[15*3600,3],[9*3600,2],[5*3600,3],[130*60,3],[70*60,3],[30*60,3],[9*60,2]].forEach(([a,n])=>{
    sc=makeScene(prev,now-a*1000);prev=sc.id;sc.end=now+ri(8,20)*60000;
    for(let j=0;j<n;j++){let ts=now-a*1000+j*ri(5,16)*60000;if(ts>now-60000)ts=now-ri(1,4)*60000;
      const P=makePost(sc,j===0?"open":pickKind(sc),ts,false);if(!P)continue;
      P.comments=P.comments.filter(c=>c.ts<now-5000);postsList.unshift(P)}});
  postsList.sort((x,y)=>y.ts-x.ts);state.scene=sc}

/* ---- real news (CryptoCompare, free) ---- */
const NEWSMAP=[[/\b(fed|fomc|rate cut|rate hike|interest rate|inflation|cpi|powell|treasur)/i,"fed"],[/\bgold\b/i,"gold"],[/\b(etf|blackrock|fidelity|grayscale|inflows?|outflows?)\b/i,"etf"],[/\b(hack|exploit|scam|phish|drain|stolen|rug|breach|fraud)/i,"safety"],[/\b(liquidat|leverage|futures|open interest|short squeeze)/i,"leverage"],[/\b(meme|doge|shib|pepe|bonk|wif|trump coin)/i,"memes"],[/\b(tax|irs|regulat|sec\b|lawsuit|bill|law|ban|court|compliance)/i,"tax"],[/\b(ethereum|eth\b|solana|sol\b|altcoin|xrp|cardano|ada\b|bnb|dominance)/i,"alts"],[/\b(crash|plunge|tumble|slump|selloff|sell-off|fear|drop|falls?|slides?)\b/i,"fear"]];
const topicFor=t=>{for(const [re,id] of NEWSMAP)if(re.test(t))return id;return pick(["fear","alts","etf","fed"])};
const symsFor=t=>{const o=[];[["BTC",/bitcoin|\bbtc\b/i],["ETH",/ethereum|\beth\b|ether\b/i],["SOL",/solana|\bsol\b/i],["XRP",/\bxrp\b|ripple/i],["BNB",/\bbnb\b|binance/i]].forEach(([s,re])=>{if(re.test(t)&&o.length<2)o.push(s)});return o.length?o:["BTC"]};
const LEAD=["Worth a read 👇","This one matters for traders","Just came out","Everyone will be talking about this","Heads up, this is moving the chat","Reading this now 👀","New headline, thoughts?"];
const newsSeen=new Set(),newsQueue=[];
function newsPost(it,live){
  if(!it||!it.title||!/^https:\/\//.test(it.url||""))return null;
  const title=String(it.title).slice(0,170),id=topicFor(title+" "+(it.categories||"")),tm=TM[id]||TM.fear,pid=state.nid++;
  const pub=Math.min(Date.now(),(+it.published_on||0)*1000||Date.now());
  const sc=makeScene(null,pub,id);let ms=[];
  ["say","ask","say","debate","say"].slice(0,ri(3,5)).forEach(k=>{try{beat(sc,k).forEach(m=>ms.push(m))}catch(_){}});
  const author=pick(PEOPLE.filter(p=>p.role==="vet"||p.role==="mod"));
  let img=String(it.imageurl||"");if(!/^https:\/\//.test(img))img="";
  const P={id:pid,p:author,ts:pub,kind:"news",text:tk(pick(LEAD)),media:{t:"news",img,url:it.url,src:String(it.source_info&&it.source_info.name||it.source||"News").slice(0,30),title,pub},chips:symsFor(title),tag:"News",comments:[],likes:0,reposts:0,views:0,fresh:!!live,topic:id};
  const age=Math.max(0,(Date.now()-pub)/3600000);
  P.likes=Math.floor(ri(8,60)*(1+age*.6));P.reposts=Math.floor(P.likes*rnd(.05,.2));P.views=Math.floor(P.likes*ri(30,90)+age*ri(200,700));
  let t=pub;const seen=[];ms.slice(0,5).forEach(m=>{if(seen.indexOf(m.t)>-1)return;seen.push(m.t);t+=ri(40,420)*1000;P.comments.push({p:m.p,t:tk(human(m.p,m.t)),ts:t,likes:Math.random()<.35?ri(1,9):0})});
  return P}
async function fetchNews(){
  let list=[];
  try{const c=new AbortController(),to=setTimeout(()=>c.abort(),9000);
    const r=await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN",{signal:c.signal});clearTimeout(to);
    const j=await r.json();list=(j&&j.Data)||[]}catch(_){return}
  if(!Array.isArray(list)||!list.length)return;
  const fresh=list.filter(x=>x&&x.id&&!newsSeen.has(x.id)&&/^https:\/\//.test(x.imageurl||""));fresh.forEach(x=>newsSeen.add(x.id));
  if(!fresh.length)return;
  if(!state.newsInit){state.newsInit=true;
    fresh.slice(0,7).forEach(it=>{const P=newsPost(it,false);if(!P)return;const now=Date.now();P.comments=P.comments.filter(c=>c.ts<now-4000);postsList.push(P)});
    postsList.sort((a,b)=>b.ts-a.ts);if(state.open)render()}
  else fresh.slice(0,4).forEach(it=>newsQueue.push(it))}
function drainNews(){const it=newsQueue.shift();if(it){const P=newsPost(it,true);if(P){const all=P.comments.slice();P.comments=[];all.forEach(c=>{const d=ri(3,40)*1000+(c.ts-P.ts)/20;setTimeout(()=>{c.ts=Date.now();P.comments.push(c);if(state.open)refresh(P)},d)});addPost(P,true)}}
  setTimeout(drainNews,ri(150,300)*1000)}
/* ---- you: post, like, comment ---- */
function answerFor(t){let ans=null;for(const [re,o] of REPLY){if(re.test(t)){ans=pick(o).replace("__BTC__",fp(px("BTC")));break}}
  if(!ans&&state.scene&&Math.random()<.85){const sc=state.scene,C=ctxNow(sc),T=sc.T;let l=null;if(/\?/.test(t)){const a=pickLine(sc,T.ask,1);if(a)l=pick(a[1])}if(!l)l=pickLine(sc,T.say);if(l)ans=cleanL(l,C)}
  return ans||(Math.random()<.45?pick(GENERIC):null)}
function trickleLikes(P,n){let k=0;(function nx(){setTimeout(()=>{k++;P.likes++;P.views+=ri(3,25);if(state.open)refresh(P);if(k<n)nx()},ri(1000,3000))})()}
function userPost(){const i=$("cmIn"),t=i.value.trim().slice(0,400);if(!t)return;i.value="";
  const P={id:state.nid++,p:ME,ts:Date.now(),kind:"user",text:tk(t),media:null,chips:[],tag:null,comments:[],likes:0,reposts:0,views:ri(1,6),topic:"you"};
  addPost(P,true);const log=$("cmLog");log.scrollTop=0;state.newCount=0;showNew();
  if(Math.random()<.85)trickleLikes(P,ri(2,8));
  const ans=answerFor(t),n=ans?ri(1,3):0;
  if(ans)setTimeout(()=>{P.comments.push({p:who(/\?/.test(t)?"vet":"chat"),t:tk(mention(ME)+" "+ans),ts:Date.now(),likes:0});if(state.open)refresh(P)},ri(4000,9000));
  if(n>1)setTimeout(()=>{P.comments.push({p:who("chat"),t:pick(["agreed 👍","same here","good point","welcome in 👋"]),ts:Date.now(),likes:0});if(state.open)refresh(P)},ri(11000,17000))}
function userComment(P,t){t=t.trim().slice(0,240);if(!t)return;P.comments.push({p:ME,t:tk(t),ts:Date.now(),likes:0});refresh(P);
  const ans=answerFor(t);if(ans)setTimeout(()=>{P.comments.push({p:who(/\?/.test(t)?"vet":"chat"),t:tk(mention(ME)+" "+ans),ts:Date.now(),likes:0});if(state.open)refresh(P)},ri(2200,5500))}
/* ---- UI ---- */
const css=`#cmBtn{display:none!important}
#cmDlg{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;margin:0;border:0;border-radius:0;background:transparent;color:var(--text,#f5f5f5);overflow:visible;font-family:inherit}
.cmH{flex:none;padding:4px 4px 0;background:transparent}
.cmH .ttl{font-size:21px;font-weight:800;letter-spacing:-.4px;color:var(--strong,#fff)}
.cmTabs{display:flex;gap:20px;margin-top:8px}.cmTabs button{background:none;border:0;padding:8px 0 9px;font:inherit;font-size:15px;font-weight:700;color:var(--muted,#9a9a9f);cursor:pointer;border-bottom:3px solid transparent}.cmTabs button.on{color:var(--strong,#fff);border-bottom-color:#f0b90b}
.cmWrap{position:relative;flex:1;min-height:0;display:flex}
#cmLog{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:auto;overflow-anchor:auto;scrollbar-width:none}#cmLog::-webkit-scrollbar{display:none}
#cmLog[data-f="q"] .cmP:not(.kq),#cmLog[data-f="c"] .cmP:not(.kc){display:none}
.cmP{padding:14px 4px 4px;border-bottom:1px solid color-mix(in srgb,var(--line,#282828) 55%,transparent)}.cmP:last-child{border-bottom:0}
@media(prefers-reduced-motion:no-preference){.cmP.pin{animation:cmpin .45s ease}}@keyframes cmpin{from{opacity:0;transform:translateY(-10px)}}
.cmRow{display:flex;gap:11px;align-items:flex-start}
.cmA{flex:none;position:relative;overflow:hidden;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px}.cmA svg{width:100%;height:100%;display:block}.cmA img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cmA.s2{width:28px;height:28px;font-size:11px}.cmA.ph{box-shadow:0 0 0 2px var(--s1,#151515),0 0 0 4px #8b5cf6}
.cmBody{min-width:0;flex:1}
.cmN{position:relative;display:flex;align-items:center;flex-wrap:wrap;gap:3px 7px;line-height:1.25;min-height:24px;padding-right:26px}
.cmN .nm{font-size:16px;font-weight:800;letter-spacing:-.1px;color:var(--strong,#fff)}.cmN .dot{color:var(--muted,#85858a);font-size:11px}
.cmN .ago{font-size:13px;color:var(--muted,#85858a);font-weight:600}
.cmN .bd{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:800;padding:2px 8px 2px 6px;border-radius:7px;background:var(--s2,#202020);border:1px solid var(--bd,#303030)}
.cmN .vf{display:inline-flex}
.cmN .tg{font-size:13px;font-weight:700}.tg.bear{color:#f6465d}.tg.bull{color:#0ecb81}.tg.qn{color:#4aa3ff}.tg.top{color:var(--muted,#85858a);flex-basis:100%}
.cmN .x{position:absolute;right:-4px;top:-4px;background:none;border:0;color:var(--muted,#85858a);font-size:22px;line-height:1;padding:0 4px;cursor:pointer}
.cmT{font-size:15.5px;line-height:1.5;margin-top:3px;word-break:break-word;font-weight:600}
.cmT .tk{color:#d9a100;font-weight:800}.cmT .at,.ct .at{color:#4aa3ff;font-weight:700}
.cmImg{margin-top:9px;max-width:300px}.cmImg svg{display:block;width:100%;height:auto;border-radius:10px}
.cmArt{display:block;margin-top:9px;border:1px solid var(--line,#303030);border-radius:16px;overflow:hidden;background:var(--s1,#151515);color:inherit;text-decoration:none}
.cmArt .cover{position:relative}.cmArt .cover svg{display:block;width:100%;height:auto}.cmNews .cover{aspect-ratio:16/9;background:var(--s2,#202020);overflow:hidden}.cmNews .cover img,.cmNews .cover svg{width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto}.cmArt .src{padding:0 13px 12px;font-size:12.5px;font-weight:600;color:var(--muted,#85858a)}.cmNews .ttl{padding-bottom:5px}
.cmArt .lab{position:absolute;left:8px;bottom:8px;display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:8px;background:rgba(0,0,0,.65);color:#fff;font-weight:800;font-size:13px}.cmArt .lab svg{width:15px;height:15px}
.cmArt .ttl{padding:11px 13px 13px;font-size:16px;font-weight:800;line-height:1.4;color:var(--strong,#fff)}
.cmTr{margin-top:9px;display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;padding:12px 13px;border:1px solid var(--line,#303030);border-radius:14px;font-size:15px}
.cmTr b{font-weight:800;color:var(--strong,#fff)}.cmTr .pp{font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px;background:var(--s2,#202020)}
.cmTr .pnl{margin-left:auto;font-size:16px}.pnl.w{color:#0ecb81!important}.pnl.l{color:#f6465d!important}
.cmLive{margin-top:9px;position:relative;height:130px;border-radius:14px;background:linear-gradient(135deg,#efe8ff,#d9ccff);display:grid;place-items:center;overflow:hidden}
.cmLive .lb{position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:6px;background:#7c4dff;color:#fff;font-weight:800;font-size:12px;padding:4px 9px;border-radius:7px}.cmLive .lb i{width:6px;height:6px;border-radius:50%;background:#fff}
.cmLive .lw{position:absolute;left:78px;top:10px;background:rgba(40,40,60,.7);color:#fff;font-weight:700;font-size:12px;padding:4px 9px;border-radius:7px}
.cmLive .lav .cmA{width:70px;height:70px;box-shadow:0 0 0 3px #fff,0 0 0 6px #b79cff}
.cmChips{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}.chip{display:inline-flex;gap:6px;padding:6px 11px;border-radius:8px;background:var(--s2,#202020);font-weight:800;font-size:14px;color:var(--strong,#fff)}.chip b.up{color:#0ecb81}.chip b.dn{color:#f6465d}
.cmAct{display:flex;align-items:center;justify-content:space-between;margin:8px 0 4px;color:var(--muted,#85858a);font-size:14px;font-weight:700}
.cmAct button,.cmAct .vw{display:inline-flex;align-items:center;gap:6px;background:none;border:0;padding:6px 2px;color:inherit;font:inherit;cursor:pointer}.cmAct .vw{cursor:default}
.cmAct svg{width:19px;height:19px}.cmAct button.on{color:var(--accent,#2f7bff)}.cmAct button.lk.on,.cmAct button.lk.on svg{color:#f0b90b;fill:rgba(240,185,11,.25)}
.cmCs{border-top:1px solid var(--line,#282828);margin-top:4px;padding:8px 0 10px}
.cmC{display:flex;gap:9px;padding:7px 0}.cmC .cb{min-width:0;flex:1}.cmC .cn{font-size:14px;font-weight:800;margin-right:7px}.cmC .ago{font-size:12px;color:var(--muted,#85858a)}.cmC .ct{font-size:14.5px;line-height:1.45;word-break:break-word}.ct .tk{color:#d9a100;font-weight:800}
.cmCin{display:flex;gap:8px;margin-top:6px}.cmCin input{flex:1;min-width:0;background:var(--s2,#202020);border:1px solid var(--bd,#303030);border-radius:20px;padding:9px 14px;font:inherit;font-size:15px;color:inherit;outline:none}
.cmCin button{border:0;border-radius:20px;background:var(--accent,#2f7bff);color:#fff;font-weight:800;padding:0 16px;cursor:pointer}
.cmNew{position:absolute;top:10px;left:50%;transform:translateX(-50%);box-shadow:0 4px 14px rgba(0,0,0,.4);border:0;border-radius:999px;background:var(--accent,#2f7bff);color:#fff;padding:7px 14px;font:inherit;font-size:13px;font-weight:700;display:none;cursor:pointer;z-index:2}
.cmComp{display:flex;align-items:center;gap:10px;margin:10px 0 6px;padding:7px 7px 7px 8px;border-radius:30px;background:var(--s2,#202020);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--bd,#303030) 60%,transparent);transition:box-shadow .2s}
.cmComp:focus-within{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,#f0b90b 70%,transparent),0 4px 18px rgba(240,185,11,.12)}
.cmComp .cmA{width:36px;height:36px;font-size:14px}
.cmComp input{flex:1;min-width:0;background:none;border:0;padding:8px 2px;font:inherit;font-size:16px;color:inherit;outline:none}.cmComp input::placeholder{color:var(--muted,#85858a)}
.cmComp button{flex:none;display:grid;place-items:center;width:40px;height:40px;border:0;border-radius:50%;background:linear-gradient(135deg,#ffd75e,#f0b90b 60%,#ff9f1a);color:#1a1a1a;cursor:pointer;box-shadow:0 3px 10px rgba(240,185,11,.35);transition:transform .15s}.cmComp button:active{transform:scale(.92)}.cmComp button svg{width:18px;height:18px}
#cmMore{display:none;width:100%;margin:8px 0 4px;padding:12px;border:0;border-radius:24px;background:var(--s2,#202020);color:var(--strong,#fff);font:inherit;font-weight:800;font-size:15px;cursor:pointer}
#cmLog[data-f="n"] .cmP:not(.kn){display:none}
@media(min-width:900px){#cmMore{display:none!important}}
@media(max-width:899px){#loungeSec{height:auto!important;max-height:none!important;min-height:0!important}#cmDlg{display:block}.cmWrap{display:block}#cmLog{overflow:visible!important;height:auto}.cmNew{position:sticky;display:none;margin:0 auto}}
`;
function build(){
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const d=document.createElement("section");d.id="cmDlg";d.setAttribute("aria-label","Trader lounge");
  d.innerHTML=`<div class="cmH"><div class="ttl">Trader Lounge</div><div class="cmTabs" role="tablist"><button class="on" data-f="">Discover</button><button data-f="n">News</button><button data-f="q">Questions</button><button data-f="c">Charts</button></div></div>
  <form class="cmComp" onsubmit="return false"><div id="cmMe"></div><input id="cmIn" placeholder="What's on your mind? ✨" maxlength="400" autocomplete="off" aria-label="Write a post"><button id="cmSend" type="button" aria-label="Post"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>
  <div class="cmWrap"><div id="cmLog" role="feed" aria-label="Posts"></div><button class="cmNew" id="cmNew" type="button"></button></div>
  <button id="cmMore" type="button">Show more posts</button>`;
  (document.getElementById("loungeSec")||document.getElementById("mkSec")||document.body).appendChild(d);
  try{const e=document.getElementById("uEmail"),h=(e&&e.textContent||"").split("@")[0].replace(/[^\w.]/g,"").slice(0,16);if(h)ME.n=h}catch(_){}
  state.open=true;state.openC={};state.lim=innerWidth>=900?70:14;const me=$("cmMe");me.outerHTML=avatar(ME);render();$("cmMore").onclick=()=>{state.lim+=14;render()};
  const log=$("cmLog");
  d.querySelector(".cmTabs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;d.querySelectorAll(".cmTabs button").forEach(x=>x.classList.toggle("on",x===b));log.dataset.f=b.dataset.f;log.scrollTop=0});
  log.addEventListener("scroll",()=>{if(log.scrollTop<40){state.newCount=0;showNew()}},{passive:true});
  $("cmNew").onclick=()=>{log.scrollTo({top:0,behavior:"smooth"});state.newCount=0;showNew()};
  log.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const el=b.closest(".cmP"),P=postsList.find(x=>x.id==+el.dataset.id);if(!P)return;const a=b.dataset.a;
    if(a==="lk"){P.lk=!P.lk;P.likes+=P.lk?1:-1;refresh(P)}
    else if(a==="rp"){P.rp=!P.rp;P.reposts+=P.rp?1:-1;refresh(P)}
    else if(a==="cm"){state.openC[P.id]=!state.openC[P.id];refresh(P)}
    else if(a==="x"){const i=postsList.indexOf(P);if(i>-1)postsList.splice(i,1);el.remove()}
    else if(a==="sh"){try{navigator.clipboard.writeText(location.href)}catch(_){}b.innerHTML=ICON.sh+"<span>Link copied</span>";setTimeout(()=>{b.innerHTML=ICON.sh},1800)}
    else if(a==="send"){const i=el.querySelector(".cmCin input");userComment(P,i.value)}});
  log.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest(".cmCin")){const el=e.target.closest(".cmP"),P=postsList.find(x=>x.id==+el.dataset.id);if(P)userComment(P,e.target.value)}});
  (function(){const pg=document.getElementById("pg")||log.closest(".pg");
    log.addEventListener("wheel",e=>{const up=e.deltaY<0,end=up?log.scrollTop<=0:log.scrollTop+log.clientHeight>=log.scrollHeight-1;
      if(end&&pg&&e.deltaY){pg.scrollTop+=e.deltaY;e.preventDefault()}},{passive:false})})();
  $("cmSend").onclick=userPost;$("cmIn").addEventListener("keydown",e=>{if(e.key==="Enter")userPost()});
  setInterval(()=>{document.querySelectorAll("#cmLog .ago[data-ts]").forEach(x=>{x.textContent=ago(+x.dataset.ts)});
    document.querySelectorAll("#cmLog .chip[data-s]").forEach(x=>{const c=chgS(x.dataset.s);x.innerHTML=x.dataset.s+' <b class="'+(c>=0?"up":"dn")+'">'+sg(c)+"</b>"})},30000);
  setInterval(()=>{const now=Date.now();postsList.filter(P=>now-P.ts<25*60000&&Math.random()<.6).slice(0,2).forEach(P=>{P.views+=ri(5,60);if(Math.random()<.5)P.likes++;if(state.open)refresh(P)})},6000)}
function boot(){seedFeed();build();setTimeout(live,ri(14,28)*1000);fetchNews();fetchCharts();setInterval(fetchNews,600000);setInterval(fetchCharts,900000);(function(){let u=null;setInterval(()=>{try{if(myUid()&&myUid()!==u){u=myUid();const m=document.querySelector(".cmComp .cmA");if(m)m.outerHTML=avatar(ME);document.querySelectorAll("#cmLog .cmA").forEach(x=>{})}}catch(_){}},1500)})();setTimeout(drainNews,ri(90,180)*1000)}
function start(){loadGold();let n=0;(function w(){let ok=false;try{ok=S.mk&&S.mk.BTC&&S.mk.BTC.p>0}catch(e){}if((ok&&gold)||n++>16)boot();else setTimeout(w,250)})()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
