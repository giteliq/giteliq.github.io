(function(){
"use strict";

const input=document.getElementById("searchInput");
const box=document.getElementById("searchResults");
const button=document.getElementById("searchButton");

const INDEX=window.GITELIQ_SEARCH_INDEX||[];
const AUTHORS=window.GITELIQ_AUTHORS||[];

function esc(v){
  return String(v??"").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function norm(v){
  return String(v||"")
    .toLocaleLowerCase("hy-AM")
    .replaceAll("է","ե")
    .replace(/[՝՛՜։…«»“”„’‘"'()[\]{}<>/\\|—–\-_.:;,?!]+/g," ")
    .replace(/\s+/g," ")
    .trim();
}

for(const r of INDEX){
  r._nTitle=norm(r.title);
  r._nAuthor=norm(r.author);
  r._nText=norm(r.text);
}
for(const a of AUTHORS){
  a._nTitle=norm(a.title);
}

function snippet(text,query){
  const source=String(text||"").replace(/\s+/g," ").trim();
  const normalized=norm(source);
  const q=norm(query.replace(/^[«"]|[»"]$/g,""));

  let pos=normalized.indexOf(q);
  if(pos<0){
    for(const w of q.split(" ").filter(Boolean)){
      pos=normalized.indexOf(w);
      if(pos>=0)break;
    }
  }
  if(pos<0)pos=0;

  const start=Math.max(0,pos-95);
  const end=Math.min(source.length,pos+220);
  return (start?"…":"")+source.slice(start,end)+(end<source.length?"…":"");
}

function findResults(query){
  const raw=query.trim();
  const exact=/^[«"].*[»"]$/.test(raw);
  const phrase=norm(raw.replace(/^[«"]|[»"]$/g,""));
  const words=phrase.split(" ").filter(Boolean);

  if(!words.length)return [];

  const authorHits=AUTHORS.filter(a=>{
    return exact
      ? a._nTitle.includes(phrase)
      : words.every(w=>a._nTitle.includes(w));
  }).map(a=>({
    type:"Հեղինակ",
    title:a.title,
    author:"",
    page_url:a.url,
    work_url:a.url,
    text:"",
    score:a._nTitle===phrase?300:180
  }));

  const hits=[];
  for(const x of INDEX){
    const hay=x._nTitle+" "+x._nAuthor+" "+x._nText;
    const ok=exact
      ? hay.includes(phrase)
      : words.every(w=>hay.includes(w));

    if(!ok)continue;

    let score=20;
    if(x._nTitle===phrase)score+=160;
    else if(x._nTitle.includes(phrase))score+=100;

    if(x._nAuthor===phrase)score+=140;
    else if(x._nAuthor.includes(phrase))score+=75;

    if(x._nText.includes(phrase))score+=30;
    hits.push({...x,score});
  }

  // Group chapters under one logical work, but link to best matching chapter.
  const grouped=new Map();
  for(const x of hits){
    const key=x.work_url||x.page_url;
    const old=grouped.get(key);
    if(!old||x.score>old.score){
      grouped.set(key,x);
    }
  }

  return [...authorHits,...grouped.values()]
    .sort((a,b)=>b.score-a.score)
    .slice(0,40);
}

function run(){
  if(!input||!box)return;

  const query=input.value.trim();
  if(!query){
    box.classList.remove("open");
    return;
  }

  const results=findResults(query);
  box.classList.add("open");

  box.innerHTML=
    '<div class="search-summary">Գտնվել է '+results.length+' արդյունք</div>'+
    (results.length
      ? results.map(x=>
        '<a class="search-result" href="'+esc(x.page_url)+'">'+
          '<div class="result-type">'+esc(x.type||"Նյութ")+'</div>'+
          '<div class="result-title">'+esc(x.title)+'</div>'+
          (x.author?'<div class="result-author">'+esc(x.author)+'</div>':'')+
          (x.text?'<div class="result-snippet">'+esc(snippet(x.text,query))+'</div>':'')+
        '</a>'
      ).join("")
      : '<div class="search-result"><div class="result-title">Արդյունք չի գտնվել</div><div class="result-snippet">Փորձիր մեկ այլ բառ կամ ավելի կարճ արտահայտություն։</div></div>'
    );
}

if(button)button.addEventListener("click",run);

if(input){
  input.addEventListener("keydown",e=>{
    if(e.key==="Enter")run();
  });

  let timer;
  input.addEventListener("input",()=>{
    clearTimeout(timer);
    if(input.value.trim().length<2){
      box.classList.remove("open");
      return;
    }
    timer=setTimeout(run,120);
  });
}

})();