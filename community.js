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
const AVATAR_BASE="avatars/",AVATAR_COUNT=300,AVATAR_EXT="webp"; /* put numbered files in /avatars (1.jpg, 2.jpg ...) and set AVATAR_COUNT */
const LAST=["A","B","C","D","E","G","H","J","K","L","M","N","P","R","S","T","W"];
const NAMECOL=["#e03a5f","#8b5cf6","#2f7bff","#12a15a","#e8890c","#d946ef","#0ea5b7","#ef4444","#7c3aed","#c98a04","#0f9d8a","#f0568a"];
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
const ME={n:"you",c:"#2f7bff",nc:"#2f7bff",me:1};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const who=r=>pick(PEOPLE.filter(p=>p.role===r));
const SYMS=["BTC","ETH","SOL","BNB","XRP"];
/* neighbouring topics share a coin or a theme, so the room drifts instead of jumping */
const TOPICS=[{sym:"BTC",kind:"price"},{sym:"BTC",kind:"setup"},{sym:"ETH",kind:"setup"},{sym:"ETH",kind:"price"},{sym:"SOL",kind:"price"},{sym:"SOL",kind:"setup"},{sym:"SOL",kind:"risk"},{sym:"BTC",kind:"risk"}];
const TP={i:0,n:0,max:6};
const tsym=()=>TOPICS[TP.i].sym;
const px=s=>{try{const e=S.mk[s];if(e&&e.p>0)return e.p}catch(_){}return{BTC:98000,ETH:3400,SOL:210,BNB:640,XRP:2.3}[s]};
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
const F={lounge:[modThread,topicThread,topicThread,topicThread,topicThread,topicThread,topicThread,topicThread,meme,poll,()=>qa("loans"),()=>qa("new"),banter],general:[topicThread,topicThread,topicThread,topicThread,topicThread,topicThread,meme,poll],ideas:[topicThread,topicThread,topicThread,topicThread,poll],loans:[()=>qa("loans"),()=>qa("loans"),()=>qa("loans"),banter,poll],new:[()=>qa("new"),()=>qa("new"),()=>qa("new"),()=>qa("new"),banter,meme]};
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
const prevTxt=b=>typeof b==="string"?b:b.poll?"📊 "+b.q:"📈 "+b.sym+" "+b.side+" idea";
function add(room,p,body,ts,silent,re){
  body=human(p,body);
  const m={id:state.nid++,p,body,ts:ts||Date.now(),rx:{}};
  if(re)m.re={p:re.p,t:prevTxt(re.body)};
  if(Math.random()<.4)m.rx[pick(["🔥","👍","📈","😂","🙏"])]=ri(1,8);
  const L=state.msgs[room];L.push(m);if(L.length>400)L.shift();
  if(!silent&&state.open)appendMsg(m);return m}
const wantReply=(prev,p,k)=>k>0&&prev&&prev.p!==p&&Math.random()<.78?prev:null;
function seed(){let t=Date.now()-ri(50,110)*60000;for(let i=0;i<24;i++){let prev=null;pick(F.lounge)().forEach((x,k)=>{t+=ri(15,140)*1000;prev=add("lounge",x[1],x[2],t,true,wantReply(prev,x[1],k))})}}
function run(room){let d=0,prev=null;pick(F[room])().forEach((x,k)=>{d+=x[0]*1000+ri(300,1500);const p=x[1];
  setTimeout(()=>{const go=()=>{prev=add(room,p,x[2],undefined,false,wantReply(prev,p,k))};
    if(state.open){setTyping(p);setTimeout(()=>{setTyping(null);go()},ri(900,2200))}else go()},d)})}
function notice(room,txt){const L=state.msgs[room],m={id:state.nid++,sys:1,p:{n:"",c:"#333"},body:txt,ts:Date.now(),rx:{}};L.push(m);if(L.length>400)L.shift();if(state.open)appendMsg(m)}
function schedule(){const lull=Math.random()<.2;setTimeout(()=>{const r="lounge";
  if(Math.random()<.12)notice(r,pick(PEOPLE).n+" joined the room");else run(r);schedule()},lull?ri(20000,45000):ri(3500,9000))}

/* ---- UI ---- */
const css=`#cmBtn{display:none!important}
#cmDlg{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;margin:0;border:1px solid var(--line,#282828);border-radius:22px;background:var(--bg,#000);color:var(--text,#f5f5f5);overflow:hidden;box-shadow:0 14px 34px -18px rgba(0,0,0,.5)}
.cmH{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:1px solid var(--line,#282828)}
.cmH .ttl{display:flex;align-items:center;gap:8px;font-size:19px;font-weight:800;letter-spacing:-.3px}.cmH .hs{color:var(--soft,#85858a);font-weight:700}
.cmOn{font-size:12px;color:var(--muted,#9a9a9f);margin-top:3px}.cmOn i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#35e875;margin-right:6px}
.cmTag{flex:none;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--s2,#202020);color:var(--muted,#9a9a9f);border:1px solid var(--line,#303030)}
.cmWrap{position:relative;flex:1;min-height:0;display:flex}
#cmLog{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;overflow-anchor:none;padding:14px 14px 6px;display:flex;flex-direction:column;gap:18px;scrollbar-width:thin}
.cmM{display:flex;flex-direction:column;flex:none}
.cmRow{display:flex;gap:12px;align-items:flex-start}
.cmA{flex:none;position:relative;overflow:hidden;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:16px}.cmA img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cmA.s{width:20px;height:20px;font-size:10px}
.cmRe{position:relative;display:flex;align-items:center;gap:7px;margin:0 0 4px 21px;padding-left:28px;min-height:22px;font-size:13.5px;color:var(--muted,#9a9a9f)}
.cmRe:before{content:"";position:absolute;left:0;top:50%;bottom:-9px;width:24px;border-left:2px solid var(--bd,#303030);border-top:2px solid var(--bd,#303030);border-top-left-radius:9px}
.cmRe .rt{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.cmRe .rt b{font-weight:750}
.cmBody{min-width:0;flex:1}
.cmN{display:flex;align-items:center;flex-wrap:wrap;gap:4px 8px;line-height:1.25}
.cmN .nm{font-size:17px;font-weight:750;letter-spacing:-.2px}
.cmN .bd{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;padding:2px 8px 2px 6px;border-radius:7px;background:var(--s2,#202020);border:1px solid var(--bd,#303030);color:var(--text,#f5f5f5)}
.cmN .bd svg,.cmN .gm svg{display:block}
.cmN .ago{font-size:12.5px;color:var(--muted,#85858a);font-weight:500}
.cmT{font-size:17px;line-height:1.42;margin-top:3px;word-break:break-word}
.cmT .at{color:var(--accent,#2f7bff);font-weight:650;background:color-mix(in srgb,var(--accent,#2f7bff) 16%,transparent);padding:0 4px;border-radius:5px}
.cmM.me .cmRow{background:color-mix(in srgb,var(--accent,#2f7bff) 9%,transparent);margin:0 -8px;padding:6px 8px;border-radius:12px}
.cmCard{margin-top:6px;padding:12px;border-radius:16px;background:var(--s1,#151515);border:1px solid var(--line,#303030);min-width:230px;max-width:340px}
.cmCard .t{display:flex;justify-content:space-between;font-weight:750;margin-bottom:8px}.cmCard .s{padding:2px 9px;border-radius:999px;font-size:12px;font-weight:750}.s.L{background:#12301f;color:#35e875}.s.S{background:#3a1616;color:#ff8a8a}
.cmCard .g{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:12px;color:var(--muted,#9a9a9f)}.cmCard .g b{display:block;color:var(--text,#f5f5f5);font-size:14px}
.cmCard .r{margin-top:8px;font-weight:750;font-size:13px}.r.w{color:#35e875}.r.l{color:#ff6b6b}
.cmPoll button{display:flex;justify-content:space-between;width:100%;margin-top:6px;border:1px solid var(--line,#303030);background:var(--bg,#000);color:inherit;border-radius:10px;padding:9px 11px;font:inherit;font-size:14px;cursor:pointer;position:relative;overflow:hidden}
.cmPoll button i{position:absolute;left:0;top:0;bottom:0;background:color-mix(in srgb,var(--accent,#2f7bff) 28%,transparent)}.cmPoll button span{position:relative}
.cmRx{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap}.cmRx button{border:1px solid var(--bd,#303030);background:var(--s2,#202020);color:inherit;border-radius:9px;padding:3px 9px;font-size:13px;cursor:pointer}
.cmTy{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted,#85858a);padding:0 16px 6px;min-height:22px}
.cmTy .dots{display:inline-flex;gap:3px}.cmTy .dots i{width:7px;height:7px;border-radius:50%;background:var(--muted,#85858a);opacity:.5}
@media(prefers-reduced-motion:no-preference){.cmTy .dots i{animation:cmd 1s infinite}.cmTy .dots i:nth-child(2){animation-delay:.15s}.cmTy .dots i:nth-child(3){animation-delay:.3s}}
@keyframes cmd{50%{opacity:1;transform:translateY(-2px)}}
.cmF{display:flex;align-items:center;gap:8px;margin:4px 12px 8px;padding:6px 6px 6px 16px;border-radius:26px;background:var(--s2,#202020);border:1px solid var(--bd,#303030)}
.cmF input{flex:1;min-width:0;background:none;border:0;padding:8px 0;font:inherit;font-size:16px;color:inherit;outline:none}
.cmF button{flex:none;display:grid;place-items:center;width:44px;height:40px;border:0;border-radius:14px;background:var(--accent,#2f7bff);color:#fff;cursor:pointer}.cmF button svg{width:20px;height:20px}
.cmDis{font-size:11px;color:var(--soft,#85858a);text-align:center;padding:0 16px 10px;line-height:1.4}
.cmNew{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);box-shadow:0 4px 14px rgba(0,0,0,.4);border:0;border-radius:999px;background:var(--accent,#2f7bff);color:#fff;padding:7px 14px;font:inherit;font-size:13px;font-weight:700;display:none;cursor:pointer}
`;
const GEM=(c,s)=>`<svg width="${s||14}" height="${s||14}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" fill="${c}"/><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const ago=t=>{const s=Math.max(0,(Date.now()-t)/1000);return s<60?"now":s<3600?Math.floor(s/60)+"m":new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})};
const txt=t=>esc(t).replace(/@[\w.]+/g,m=>`<span class="at">${m}</span>`);
function bodyHtml(b,m){
  if(typeof b==="string")return `<div class="cmT">${txt(b)}</div>`;
  if(b.poll){const tot=b.v.reduce((a,c)=>a+c,0);return `<div class="cmCard cmPoll"><b>📊 ${esc(b.q)}</b>${b.o.map((o,i)=>`<button data-poll="${m.id}" data-i="${i}"><i style="width:${Math.round(b.v[i]/tot*100)}%"></i><span>${esc(o)}</span><span>${Math.round(b.v[i]/tot*100)}%</span></button>`).join("")}<div class="cmN" style="margin-top:6px"><span class="ago">${tot} votes</span></div></div>`}
  const L=b.side==="Long",res=b.res==null?"":`<div class="r ${b.res>=0?"w":"l"}">${b.res>=0?"Closed +":"Stopped "}${b.res.toFixed(1)}%</div>`;
  return `<div class="cmCard"><div class="t"><span>${b.sym}/USD</span><span class="s ${L?"L":"S"}">${b.side}</span></div><div class="g"><span>Entry<b>${fp(b.e)}</b></span><span>Target<b>${fp(b.tg)}</b></span><span>Stop<b>${fp(b.st)}</b></span></div>${res}</div>`}
function avatar(p,sm){return `<div class="cmA${sm?" s":""}" style="background:${p.c}">${esc((p.n[0]||"?").toUpperCase())}${p.img?`${window.ntImg?window.ntImg(p.num).replace("<img ","<img loading=\"lazy\" "):`<img src="${esc(p.img)}" alt="" onerror="this.remove()">`}`:""}</div>`}
function inner(m){const p=m.p;if(m.sys)return `<div class="cmN" style="justify-content:center;opacity:.75"><span class="ago">${esc(m.body)}</span></div>`;
  const re=m.re?`<div class="cmRe">${avatar(m.re.p,1)}<span class="rt"><b style="color:${m.re.p.nc}">@${esc(m.re.p.n)}</b> ${esc(m.re.t)}</span></div>`:"";
  const badge=p.role==="mod"?`<span class="bd">${GEM("#8b5cf6",15)}MOD</span>`:p.role==="vet"?`<span class="bd">${GEM("#2f7bff",15)}PRO</span>`:p.gem?`<span class="gm">${GEM(p.nc,17)}</span>`:"";
  return `${re}<div class="cmRow">${avatar(p)}<div class="cmBody"><div class="cmN"><span class="nm" style="color:${p.nc}">${esc(p.n)}</span>${badge}<span class="ago" data-ts="${m.ts}">${ago(m.ts)}</span></div>${bodyHtml(m.body,m)}${Object.keys(m.rx).length?`<div class="cmRx">${Object.entries(m.rx).map(([e,k])=>`<button data-m="${m.id}" data-e="${e}">${e} ${k}</button>`).join("")}</div>`:""}</div></div>`}
function mkEl(m){const el=document.createElement("div");el.className="cmM"+(m.p.me?" me":"");el.dataset.id=m.id;el.innerHTML=inner(m);return el}
const atBottom=log=>log.scrollHeight-log.scrollTop-log.clientHeight<80;
function showNew(){const b=$("cmNew");if(!b)return;b.textContent=state.newCount+(state.newCount===1?" new message":" new messages")+" ↓";b.style.display=state.newCount?"block":"none"}
function toBottom(){const log=$("cmLog");log.scrollTop=log.scrollHeight;state.newCount=0;showNew()}
function appendMsg(m){const log=$("cmLog");if(!log)return;const stick=atBottom(log)||m.p.me;
  log.appendChild(mkEl(m));
  while(log.children.length>260){const f=log.firstElementChild,h=f.offsetHeight+18;f.remove();if(!stick)log.scrollTop=Math.max(0,log.scrollTop-h)}
  if(stick)toBottom();else{state.newCount++;showNew()}}
function refreshMsg(m){const el=$("cmLog").querySelector('[data-id="'+m.id+'"]');if(el)el.innerHTML=inner(m)}
function setTyping(p){const t=$("cmTy");if(!t)return;t.innerHTML=p?`<span class="dots"><i></i><i></i><i></i></span><span><b>${esc(p.n)}</b> is typing…</span>`:""}
const onl=()=>`<i></i>${state.online.toLocaleString()} of 1,000 simulated members online`;
function render(){const log=$("cmLog");if(!log)return;log.innerHTML="";const f=document.createDocumentFragment();state.msgs.lounge.slice(-120).forEach(m=>f.appendChild(mkEl(m)));log.appendChild(f);toBottom();$("cmOn").innerHTML=onl()}
function botSay(room,p,t,delay,re){setTimeout(()=>{if(state.open)setTyping(p);setTimeout(()=>{setTyping(null);add(room,p,t,undefined,false,re)},ri(900,2000))},delay)}
function userSay(){
  const i=$("cmIn"),t=i.value.trim().slice(0,300);if(!t)return;i.value="";const mine=add("lounge",ME,t),room="lounge";
  let ans=null;for(const [re,o] of REPLY){if(re.test(t)){ans=pick(o).replace("__BTC__",fp(px("BTC")));break}}
  ans=ans||(Math.random()<.75?pick(GENERIC):null);
  if(ans){botSay(room,who(/\?/.test(t)?"vet":"chat"),mention(ME)+" "+ans,ri(1200,3200),mine);if(Math.random()<.4)botSay(room,who("chat"),pick(["agreed 👍","same here","good point"]),ri(5000,8000),mine)}}
function greet(){if(state.greeted)return;state.greeted=true;setTimeout(()=>botSay("lounge",who("chat"),"welcome "+mention(ME)+" 👋 glad you joined",0),1500);setTimeout(()=>botSay("lounge",who("mod"),mention(ME)+" welcome! ask anything, nobody here minds beginner questions 🙂",0),5500)}
function build(){
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const d=document.createElement("section");d.id="cmDlg";d.setAttribute("aria-label","Traders lounge");
  d.innerHTML=`<div class="cmH"><div><div class="ttl"><span class="hs">#</span>Traders-Lounge</div><div class="cmOn" id="cmOn"></div></div><span class="cmTag" title="The members and messages here are simulated, not real users">Simulated</span></div>
  <div class="cmWrap"><div id="cmLog" role="log" aria-live="off" aria-label="Messages"></div><button class="cmNew" id="cmNew" type="button">New messages ↓</button></div><div class="cmTy" id="cmTy"></div>
  <div class="cmF"><input id="cmIn" placeholder="Message #traders-lounge" maxlength="300" autocomplete="off" aria-label="Your message"><button id="cmSend" type="button" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>
  <div class="cmDis">Not financial advice. Trading and borrowing carry risk. Never share your seed phrase or passwords.</div>`;
  (document.getElementById("loungeSec")||document.getElementById("mkSec")||document.body).appendChild(d);
  try{const e=document.getElementById("uEmail"),h=(e&&e.textContent||"").split("@")[0].replace(/[^\w.]/g,"").slice(0,16);if(h)ME.n=h}catch(_){}
  state.open=true;render();greet();
  const log=$("cmLog");
  log.addEventListener("scroll",()=>{if(atBottom(log)){state.newCount=0;showNew()}},{passive:true});
  log.addEventListener("click",e=>{const rx=e.target.closest("[data-e]"),pl=e.target.closest("[data-poll]"),all=state.msgs.lounge;
    if(rx){const m=all.find(x=>x.id==+rx.dataset.m);if(m){m.rx[rx.dataset.e]=(m.rx[rx.dataset.e]||0)+1;refreshMsg(m)}}
    if(pl){const m=all.find(x=>x.id==+pl.dataset.poll);if(m&&!state.voted[m.id]){state.voted[m.id]=1;m.body.v[+pl.dataset.i]++;refreshMsg(m)}}});
  $("cmNew").onclick=toBottom;
  $("cmSend").onclick=userSay;$("cmIn").addEventListener("keydown",e=>{if(e.key==="Enter")userSay()});
  setInterval(()=>{state.online=Math.max(300,Math.min(750,state.online+ri(-6,6)));const o=$("cmOn");if(o)o.innerHTML=onl()},5000);
  setInterval(()=>{document.querySelectorAll("#cmLog .ago[data-ts]").forEach(x=>{x.textContent=ago(+x.dataset.ts)})},30000);
  setInterval(()=>{const polls=state.msgs.lounge.filter(m=>m.body&&m.body.poll);if(polls.length){const m=pick(polls);m.body.v[ri(0,m.body.v.length-1)]+=ri(1,2);refreshMsg(m)}},9000)}
function start(){seed();build();schedule();setTimeout(()=>run("lounge"),3000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
