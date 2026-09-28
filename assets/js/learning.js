(function(){
"use strict";
document.addEventListener("click",function(e){
  var filter=e.target.closest?e.target.closest("[data-edu-type]"):null;
  if(filter&&filter.closest("[data-edu-filter]")){
    var page=filter.closest(".edu-hub-page");
    if(!page)return;
    var type=filter.getAttribute("data-edu-type");
    var buttons=page.querySelectorAll("[data-edu-filter] [data-edu-type]");
    for(var i=0;i<buttons.length;i++)buttons[i].classList.remove("active");
    filter.classList.add("active");
    var sections=page.querySelectorAll(".edu-material-section");
    for(var j=0;j<sections.length;j++){
      var show=type==="all"||sections[j].getAttribute("data-type")===type;
      sections[j].classList.toggle("hidden-by-filter",!show);
    }
    return;
  }
  var check=e.target.closest?e.target.closest(".edu-quiz-check"):null;
  if(check){
    var card=check.closest(".edu-quiz");
    if(!card)return;
    var chosen=card.querySelector("input[type=radio]:checked");
    var result=card.querySelector(".edu-quiz-result");
    if(!chosen){result.textContent="Ընտրիր պատասխան։";return;}
    var ok=chosen.value===card.getAttribute("data-answer");
    result.textContent=ok?"Ճիշտ է ✓":"Սխալ է։ Փորձիր կրկին։";
  }
});
})();