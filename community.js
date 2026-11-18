/* NodeTray community room (preview engine). Simulated members use American trader names/nicknames; human-like typing styles.
   Self-contained: <script src="community.js" defer></script> on the app page.
   Runs entirely in each visitor's browser, so it adds no load to your servers.
   While PREVIEW is true the room says on screen that conversations are simulated. */
(()=>{
const PREVIEW=true;
const ROOMS=[{id:"general",name:"General"},{id:"ideas",name:"Trade ideas"},{id:"loans",name:"Loans & collateral"},{id:"new",name:"New to crypto"}];
/* ---- 150 people ---- */
const FIRST=["Mike","Jake","Tyler","Chris","Brandon","Austin","Cody","Dustin","Travis","Kyle","Matt","Josh","Ryan","Derek","Trevor","Jordan","Cole","Ethan","Logan","Hunter","Brian","Kevin","Dan","Steve","Tom","Nick","Zach","Luke","Sean","Greg","Jess","Ashley","Megan","Emily","Brittany","Kayla","Sarah","Lauren","Rachel","Katie","Amber","Danielle","Tony","Marcus","Darnell","Jamal","DeShawn","Carlos","Eric","Pat","Rick","Walt"];
const NICK=["Big Mike","JT","TJ","Dave","Tex","Smitty","Doc","Chip","Bubba","Mac","Ace","Slim","Cap","Rev","Hutch","Rocco","Moose","Duke","Ziggy","Sully"];
const SUF=["_trades","_hodl","_fx","_charts","_dca","_swing","_risk","_scalps","_ta","_flow","21","99","_btc","_daily","_longs","_atl","_nyc","_tx","_fl","_chi"];
const COLORS=["#f7931a","#627eea","#9945ff","#26a17b","#e8505b","#2d9cdb","#f2994a","#bb6bd9","#27ae60","#eb5757","#56ccf2","#f2c94c","#6fcf97","#ff7a59"];
const PEOPLE=[],seen=new Set();
for(let i=0;i<150;i++){const f=FIRST[i%50];let n;
  const k=i%5;
  if(k===0)n=f.toLowerCase()+SUF[(i*7+Math.floor(i/50)*5)%SUF.length];
  else if(k===1)n=NICK[(i*3+Math.floor(i/50))%NICK.length].replace(/ /g,"")+ri0(10,99);
  else if(k===2)n=f+"_"+"ABCDEFGHJKLMNPRSTW"[(i*11)%18];
  else if(k===3)n=f.toLowerCase()+ri0(70,99);
  else n="the_"+f.toLowerCase();
  while(seen.has(n))n+="_";seen.add(n);
  PEOPLE.push({n,c:COLORS[(i*5+3)%COLORS.length],role:i%20<7?"new":i%20<14?"vet":"chat",
    style:{lower:Math.random()<.6,emoji:Math.random()<.35,typo:Math.random()<.3,terse:Math.random()<.4}})}
function ri0(a,b){return Math.floor(a+Math.random()*(b-a+1))}
const ME={n:"you",c:"#a995f5",me:1};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const who=r=>pick(PEOPLE.filter(p=>p.role===r));
const SYMS=["BTC","ETH","SOL","BNB","XRP"];
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
function market(){const s=pick(SYMS),a=who("chat"),b=who("vet"),c=who("chat"),p=px(s),ch=chg(s);
  return[[0,a,sub("{s} sitting around {p} ({c} today). {t}",{s,p:fp(p),c:sg(ch),t:pick(["thin volume, I would not chase here","watching how it reacts to this level","not doing anything until it picks a direction","funding looks calm so far"])})],[6,b,pick(["agreed, thin books make every wick look like a trend","I keep size small in chop like this","range until proven otherwise"])],[7,c,pick(["waiting for a clean retest 🙏","patience pays more than clicks","I will let it come to me"])]]}
function qa(room){const [q,ans]=pick(QA[room]),a=who("new"),out=[[0,a,q]];ans.forEach((t,i)=>out.push([6+i*3,who("vet"),(i===0?mention(a)+" ":"")+t]));if(Math.random()<.65)out.push([6,a,pick(["thanks, that helps a lot 🙏","got it, never thought of it like that","ok that makes sense, appreciate it","saving this, thank you"])]);return out}
function card(){const s=pick(SYMS),a=who("vet"),p=px(s),long=Math.random()<.58,e=p*(1+rnd(-.004,.004)),tg=e*(long?1+rnd(.03,.06):1-rnd(.03,.06)),st=e*(long?1-rnd(.015,.025):1+rnd(.015,.025));
  const out=[[0,a,{card:1,sym:s,side:long?"Long":"Short",e,tg,st}],[6,who("new"),pick(["what timeframe is this on?","how did you pick that stop?","what is the risk reward here?"])],[6,a,pick(["4h chart. I will cut it if the level breaks, no hero trades","stop is below the last swing low, target is the next resistance","about 1:2, I size it so the loss is small"])]];
  if(Math.random()<.5)out.push([10,who("chat"),pick(["clean levels, watching","respect for posting a stop, most people do not","nice setup 👀"])]);return out}
function result(){const s=pick(SYMS),a=who("vet"),win=Math.random()<.62,r=win?rnd(1.6,6.2):-rnd(.9,2.4),p=px(s);
  return[[0,a,{card:1,sym:s,side:Math.random()<.5?"Long":"Short",e:p,tg:p*1.04,st:p*.98,res:r}],[6,who("chat"),win?"nice one, did you take profit in parts?":"stops exist for a reason, next one"],[7,a,win?"half at the first target, rest trailing":"small loss, moving on. position was small so it does not hurt"]]}
function lesson(){const a=who("vet");return[[0,a,pick(["post-mortem on yesterday's loss: I moved my stop because I 'felt' it would bounce. it did not. do not touch the stop 🙃","lesson of the week: I traded without a plan and paid for it. plan first, click second","I overtraded after a win and gave it all back. now I stop after two trades a day"])],[6,who("vet"),"we have all done it. write the rule down before the trade, not during"],[7,who("new"),"this is the kind of honesty I needed to read today, thanks"]]}
function banter(){return[[0,who("chat"),pick(CHAT)],[5,who("chat"),pick(CHAT)]]}
function meme(){return[[0,who("chat"),pick(MEME)],[4,who("chat"),pick(["😂😂","too real","this is my whole personality 😭","felt this in my soul"])]]}
function poll(){const [q,o]=pick(POLLS);return[[0,who("vet"),{poll:1,q,o,v:o.map(()=>ri(2,9)),my:-1}]]}
function risk(){const a=who("vet");return[[0,a,pick(["rule number one for me: never risk more than 1 to 2 percent of the account on a single trade","position size matters more than the entry. a great entry with a huge size still ruins you"])],[6,who("vet"),"1 percent if the setup is average, 2 if I really like it. never more"],[7,who("new"),mention(a)+" how do you work out the size?"],[7,a,"risk amount divided by the distance to your stop. smaller stop distance means a bigger size, that is the formula"]]}
const F={general:[market,market,banter,banter,meme,poll,risk,()=>qa("new")],ideas:[card,card,result,lesson,market,risk,poll],loans:[()=>qa("loans"),()=>qa("loans"),()=>qa("loans"),banter,poll],new:[()=>qa("new"),()=>qa("new"),()=>qa("new"),()=>qa("new"),banter,meme]};
const REPLY=[[/\b(hi|hey|hello|gm|good (morning|evening))\b/i,["gm 👋 welcome in","hey, glad you are here 👋","hello! what are you trading these days?"]],
[/\b(loan|borrow|collateral|repay|late fee)\b/i,["the loan screen shows the collateral, fees and every payment date before you confirm. read it carefully and only borrow what you can repay"]],
[/\b(btc|bitcoin)\b/i,["BTC around __BTC__ here. I keep my size small until it picks a direction","bitcoin sets the mood for everything else so I watch it first"]],
[/\b(eth|ethereum)\b/i,["ETH has been choppy for me, I wait for clean levels"]],[/\b(sol|solana)\b/i,["SOL moves fast so I always use a stop and keep size modest"]],
[/\b(scam|safe|trust|seed)\b/i,["never share your seed phrase and double check every link. anyone promising guaranteed profit is a scam, walk away"]],
[/\?$/,["good question, depends on your timeframe and risk. what are you trying to do?","I would start small and write down your plan first","someone with more experience can add more, but I would keep position size small"]]];
const GENERIC=["interesting take","fair point","I think it depends on your risk","same here, still learning every day","good one 👌","true"];

/* ---- state ---- */
const state={room:"general",msgs:{},unread:0,open:false,online:ri(120,190),typing:null,nid:1,greeted:false,voted:{}};
ROOMS.forEach(r=>state.msgs[r.id]=[]);
const TYPOS=[[/\bthe\b/,"teh"],[/\bthink\b/,"thnk"],[/\bdefinitely\b/,"definately"],[/\bbecause\b/,"bc"],[/\bhonestly\b/,"honestly tbh"],[/\byou\b/,"u"],[/\bto be honest\b/,"tbh"],[/\bright now\b/,"rn"]];
function human(p,t){if(typeof t!=="string"||p.me||!p.style)return t;const st=p.style;
  if(st.lower)t=t.charAt(0).toLowerCase()+t.slice(1);
  if(st.terse&&t.length>90&&Math.random()<.5)t=t.split(/[.,] /)[0];
  if(st.typo&&Math.random()<.35){const x=pick(TYPOS);t=t.replace(x[0],x[1])}
  if(st.lower&&Math.random()<.5)t=t.replace(/[.]$/,"");
  if(st.emoji&&Math.random()<.3)t+=" "+pick(["😅","👀","💀","🫡","🤝","😬"]);
  return t}
function add(room,p,body,ts,silent){
  body=human(p,body);
  const m={id:state.nid++,p,body,ts:ts||Date.now(),rx:{}};
  if(Math.random()<.4)m.rx[pick(["🔥","👍","📈","😂","🙏"])]=ri(1,8);
  const L=state.msgs[room];L.push(m);if(L.length>90)L.shift();
  if(!silent){if(room===state.room&&state.open)render(true);else{state.unread++;badge()}}return m}
function seed(){ROOMS.forEach(r=>{let t=Date.now()-ri(50,110)*60000;for(let i=0;i<5;i++)pick(F[r.id])().forEach(x=>{t+=ri(15,140)*1000;add(r.id,x[1],x[2],t,true)})})}
function run(room){let d=0;pick(F[room])().forEach(x=>{d+=x[0]*1000+ri(300,1500);const p=x[1];
  setTimeout(()=>{if(room===state.room&&state.open){state.typing=p.n;render(true);setTimeout(()=>{state.typing=null;add(room,p,x[2])},ri(900,2200))}else add(room,p,x[2])},d)})}
function notice(room,txt){const L=state.msgs[room];L.push({id:state.nid++,sys:1,p:{n:"",c:"#333"},body:txt,ts:Date.now(),rx:{}});if(L.length>90)L.shift();if(room===state.room&&state.open)render(true)}
function schedule(){const lull=Math.random()<.2;setTimeout(()=>{const r=Math.random()<.55&&state.open?state.room:pick(ROOMS).id;
  if(Math.random()<.12)notice(r,pick(PEOPLE).n+" joined the room");else run(r);schedule()},lull?ri(25000,60000):ri(4000,12000))}

/* ---- UI ---- */
const css=`#cmBtn{position:fixed;right:16px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:30;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 16px;background:var(--accent,#a995f5);color:#17131f;font:inherit;font-weight:750;box-shadow:0 6px 24px rgba(0,0,0,.35);cursor:pointer}
#cmBtn .b{min-width:20px;height:20px;border-radius:10px;background:#ff4d4d;color:#fff;font-size:12px;display:none;place-items:center;padding:0 5px}
#cmDlg{padding:0;border:1px solid var(--line,#282828);border-radius:22px;background:var(--s1,#151515);color:var(--text,#f5f5f5);width:min(96vw,580px);height:min(88vh,800px);max-height:none;overflow:hidden}
#cmDlg[open]{display:flex;flex-direction:column}#cmDlg::backdrop{background:rgba(0,0,0,.65)}
.cmH{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px 8px}.cmH b{font-size:19px}
.cmOn{font-size:12px;color:var(--muted,#9a9a9f)}.cmOn i{display:inline-block;width:8px;height:8px;border-radius:50%;background:#35e875;margin-right:6px}
.cmX{border:1px solid var(--line,#303030);background:var(--s2,#202020);color:inherit;border-radius:50%;width:36px;height:36px;cursor:pointer}
.cmRooms{display:flex;gap:8px;overflow-x:auto;padding:4px 16px 10px;scrollbar-width:none}
.cmRooms button{flex:none;border:0;border-radius:999px;padding:8px 14px;background:var(--s2,#202020);color:var(--muted,#a8a8ad);font:inherit;font-size:14px;cursor:pointer}
.cmRooms button.on{background:var(--accent,#a995f5);color:#17131f;font-weight:700}
.cmBan{margin:0 16px 8px;padding:8px 12px;border-radius:12px;background:#2a2112;border:1px solid #4a3a1a;color:#e7c98a;font-size:12px;line-height:1.5}
#cmLog{flex:1;overflow-y:auto;padding:8px 16px;display:flex;flex-direction:column;gap:12px;position:relative}
.cmM{display:flex;gap:10px;align-items:flex-start}.cmA{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:14px}
.cmN{font-size:13px;font-weight:700}.cmN small{font-weight:500;color:var(--muted,#85858a);margin-left:6px;font-size:11px}
.cmT{font-size:14px;line-height:1.5;margin-top:2px;word-break:break-word}.cmT .at{color:var(--accent,#a995f5);font-weight:650}
.cmM.me .cmT{background:var(--accent,#a995f5);color:#17131f;padding:7px 11px;border-radius:14px;display:inline-block}.cmM.me .cmT .at{color:#17131f}
.cmCard{margin-top:6px;padding:12px;border-radius:14px;background:var(--s2,#202020);border:1px solid var(--line,#303030);min-width:230px}
.cmCard .t{display:flex;justify-content:space-between;font-weight:750;margin-bottom:8px}.cmCard .s{padding:2px 9px;border-radius:999px;font-size:12px;font-weight:750}.s.L{background:#12301f;color:#35e875}.s.S{background:#3a1616;color:#ff8a8a}
.cmCard .g{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:12px;color:var(--muted,#9a9a9f)}.cmCard .g b{display:block;color:var(--text,#f5f5f5);font-size:13px}
.cmCard .r{margin-top:8px;font-weight:750;font-size:13px}.r.w{color:#35e875}.r.l{color:#ff6b6b}
.cmPoll button{display:flex;justify-content:space-between;width:100%;margin-top:6px;border:1px solid var(--line,#303030);background:var(--s1,#151515);color:inherit;border-radius:10px;padding:8px 10px;font:inherit;font-size:13px;cursor:pointer;position:relative;overflow:hidden}
.cmPoll button i{position:absolute;left:0;top:0;bottom:0;background:rgba(169,149,245,.22)}.cmPoll button span{position:relative}
.cmRx{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}.cmRx button{border:1px solid var(--line,#303030);background:var(--s2,#202020);color:inherit;border-radius:999px;padding:2px 8px;font-size:12px;cursor:pointer}
.cmTy{font-size:12px;color:var(--muted,#85858a);padding:0 16px 4px;min-height:18px}
.cmF{display:flex;gap:8px;padding:10px 16px;border-top:1px solid var(--line,#282828)}
.cmF input{flex:1;min-width:0;background:var(--s2,#202020);border:1px solid var(--line,#303030);color:inherit;border-radius:14px;padding:12px;font:inherit}
.cmF button{border:0;border-radius:14px;background:var(--accent,#a995f5);color:#17131f;font-weight:750;padding:0 16px;cursor:pointer}
.cmDis{font-size:11px;color:var(--muted,#85858a);text-align:center;padding:0 16px 10px}
.cmNew{position:sticky;bottom:4px;align-self:center;border:0;border-radius:999px;background:var(--accent,#a995f5);color:#17131f;padding:6px 12px;font:inherit;font-size:12px;font-weight:700;display:none;cursor:pointer}
@media(max-width:560px){#cmDlg{width:100vw;height:100dvh;max-width:100vw;max-height:100dvh;border-radius:0;border:0}}
@media(prefers-reduced-motion:no-preference){.cmM{animation:cmIn .25s ease}@keyframes cmIn{from{opacity:0;transform:translateY(6px)}}}`;
function badge(){const b=$("cmBadge");if(!b)return;b.textContent=state.unread>99?"99+":state.unread;b.style.display=state.unread?"grid":"none"}
const ago=t=>{const s=Math.max(0,(Date.now()-t)/1000);return s<60?"now":s<3600?Math.floor(s/60)+"m":new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
const txt=t=>esc(t).replace(/@[\w.]+/g,m=>`<span class="at">${m}</span>`);
function bodyHtml(b,m){
  if(typeof b==="string")return `<div class="cmT">${txt(b)}</div>`;
  if(b.poll){const tot=b.v.reduce((a,c)=>a+c,0);return `<div class="cmCard cmPoll"><b>📊 ${esc(b.q)}</b>${b.o.map((o,i)=>`<button data-poll="${m.id}" data-i="${i}"><i style="width:${Math.round(b.v[i]/tot*100)}%"></i><span>${esc(o)}</span><span>${Math.round(b.v[i]/tot*100)}%</span></button>`).join("")}<div class="cmN" style="margin-top:6px"><small>${tot} votes</small></div></div>`}
  const L=b.side==="Long",res=b.res==null?"":`<div class="r ${b.res>=0?"w":"l"}">${b.res>=0?"Closed +":"Stopped "}${b.res.toFixed(1)}%</div>`;
  return `<div class="cmCard"><div class="t"><span>${b.sym}/USD</span><span class="s ${L?"L":"S"}">${b.side}</span></div><div class="g"><span>Entry<b>${fp(b.e)}</b></span><span>Target<b>${fp(b.tg)}</b></span><span>Stop<b>${fp(b.st)}</b></span></div>${res}</div>`}
function render(stick){
  const log=$("cmLog");if(!log)return;
  const near=log.scrollHeight-log.scrollTop-log.clientHeight<90,list=state.msgs[state.room].slice(-60);
  log.innerHTML=list.map(m=>{const p=m.p;if(m.sys)return `<div class="cmN" style="text-align:center;opacity:.7"><small>${esc(m.body)}</small></div>`;
    return `<div class="cmM${p.me?" me":""}"><div class="cmA" style="background:${p.c}">${esc(p.n[0].toUpperCase())}</div><div style="min-width:0"><div class="cmN">${esc(p.n)}<small>${ago(m.ts)}</small></div>${bodyHtml(m.body,m)}${Object.keys(m.rx).length?`<div class="cmRx">${Object.entries(m.rx).map(([e,k])=>`<button data-m="${m.id}" data-e="${e}">${e} ${k}</button>`).join("")}</div>`:""}</div></div>`}).join("")+'<button class="cmNew" id="cmNew">New messages ↓</button>';
  const all=state.msgs[state.room];
  log.querySelectorAll(".cmRx button").forEach(b=>b.onclick=()=>{const m=all.find(x=>x.id==+b.dataset.m);if(m){m.rx[b.dataset.e]=(m.rx[b.dataset.e]||0)+1;render()}});
  log.querySelectorAll("[data-poll]").forEach(b=>b.onclick=()=>{const m=all.find(x=>x.id==+b.dataset.poll);if(m&&!state.voted[m.id]){state.voted[m.id]=1;m.body.v[+b.dataset.i]++;render()}});
  $("cmNew").onclick=()=>{log.scrollTop=log.scrollHeight;$("cmNew").style.display="none"};
  if(stick||near)log.scrollTop=log.scrollHeight;else $("cmNew").style.display="block";
  $("cmTy").textContent=state.typing?state.typing+" is typing…":"";$("cmOn").innerHTML=`<i></i>${state.online} simulated online`}
function setRoom(id){state.room=id;state.unread=0;badge();document.querySelectorAll(".cmRooms button").forEach(b=>b.classList.toggle("on",b.dataset.r===id));render(true)}
function botSay(room,p,t,delay){setTimeout(()=>{if(state.open&&room===state.room){state.typing=p.n;render(true)}setTimeout(()=>{state.typing=null;add(room,p,t)},ri(900,2000))},delay)}
function userSay(){
  const i=$("cmIn"),t=i.value.trim().slice(0,300);if(!t)return;i.value="";add(state.room,ME,t);const room=state.room;
  let ans=null;for(const [re,o] of REPLY){if(re.test(t)){ans=pick(o).replace("__BTC__",fp(px("BTC")));break}}
  ans=ans||(Math.random()<.75?pick(GENERIC):null);
  if(ans){botSay(room,who(room==="new"||/\?/.test(t)?"vet":"chat"),mention(ME)+" "+ans,ri(1200,3200));if(Math.random()<.4)botSay(room,who("chat"),pick(["agreed 👍","same here","good point @"+ME.n]),ri(5000,8000))}}
function greet(){if(state.greeted)return;state.greeted=true;setTimeout(()=>botSay("general",who("chat"),"welcome "+mention(ME)+" 👋 glad you joined",0),1500);setTimeout(()=>botSay("general",who("vet"),mention(ME)+" the New to crypto room is great if you want to ask questions, nobody judges 🙂",0),5500)}
function build(){
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const btn=document.createElement("button");btn.id="cmBtn";btn.type="button";btn.setAttribute("aria-label","Open community chat");
  btn.innerHTML='<span aria-hidden="true">💬</span> Community <span class="b" id="cmBadge"></span>';document.body.appendChild(btn);
  const d=document.createElement("dialog");d.id="cmDlg";d.setAttribute("aria-label","Traders lounge");
  d.innerHTML=`<div class="cmH"><div><b>Traders Lounge</b><div class="cmOn" id="cmOn"></div></div><button class="cmX" id="cmX" aria-label="Close">✕</button></div>
  <div class="cmRooms">${ROOMS.map(r=>`<button data-r="${r.id}" class="${r.id===state.room?"on":""}"># ${r.name}</button>`).join("")}</div>
  ${PREVIEW?'<div class="cmBan"><b>Preview.</b> The members and conversations in this room are simulated (not real users) while the community is being set up.</div>':""}
  <div id="cmLog" role="log" aria-live="polite" aria-label="Messages"></div><div class="cmTy" id="cmTy"></div>
  <div class="cmF"><input id="cmIn" placeholder="Message the room" maxlength="300" autocomplete="off" aria-label="Your message"><button id="cmSend" type="button">Send</button></div>
  <div class="cmDis">Not financial advice. Trading and borrowing carry risk. Never share your seed phrase or passwords.</div>`;
  document.body.appendChild(d);
  try{const e=document.getElementById("uEmail"),h=(e&&e.textContent||"").split("@")[0].replace(/[^\w.]/g,"").slice(0,16);if(h)ME.n=h}catch(_){}
  btn.onclick=()=>{state.open=true;state.unread=0;badge();d.showModal();render(true);greet();setTimeout(()=>$("cmIn").focus(),60)};
  d.addEventListener("close",()=>{state.open=false});$("cmX").onclick=()=>d.close();
  d.querySelectorAll(".cmRooms button").forEach(b=>b.onclick=()=>setRoom(b.dataset.r));
  $("cmSend").onclick=userSay;$("cmIn").addEventListener("keydown",e=>{if(e.key==="Enter")userSay()});
  setInterval(()=>{state.online=Math.max(100,Math.min(260,state.online+ri(-4,4)));if(state.open&&$("cmOn"))$("cmOn").innerHTML=`<i></i>${state.online} simulated online`},5000);
  setInterval(()=>{if(!state.open)return;const polls=state.msgs[state.room].filter(m=>m.body&&m.body.poll);if(polls.length){const m=pick(polls);m.body.v[ri(0,m.body.v.length-1)]+=ri(1,2);render()}},6000)}
function start(){seed();build();schedule();setTimeout(()=>run("general"),4000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
