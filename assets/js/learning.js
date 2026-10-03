(function(){
"use strict";

function applyEduFilters(page){
  if(!page)return;

  var selectedGrade=page.getAttribute("data-selected-grade")||"all";
  var selectedType=page.getAttribute("data-selected-type")||"all";
  var grades=page.querySelectorAll(".edu-grade");

  for(var i=0;i<grades.length;i++){
    var gradeSection=grades[i];
    var gradeId=gradeSection.getAttribute("id")||"";
    var gradeValue=gradeId.indexOf("grade-")===0
      ? gradeId.substring(6)
      : gradeId;

    var gradeMatch=
      selectedGrade==="all" ||
      gradeValue===selectedGrade;

    var materialSections=
      gradeSection.querySelectorAll(".edu-material-section");

    var hasMatchingType=false;

    for(var j=0;j<materialSections.length;j++){
      var typeMatch=
        selectedType==="all" ||
        materialSections[j].getAttribute("data-type")===selectedType;

      materialSections[j].classList.toggle(
        "hidden-by-filter",
        !typeMatch
      );

      if(typeMatch){
        hasMatchingType=true;
      }
    }

gradeSection.style.display = (gradeMatch && hasMatchingType) ? "" : "none";
  }
}


function createGradeFilters(page){
  if(!page)return;

  if(page.querySelector("[data-edu-grade-filter]")){
    return;
  }

  var typeNav=page.querySelector("[data-edu-filter]");

  if(!typeNav)return;

  var grades=page.querySelectorAll(".edu-grade");

  if(!grades.length)return;


  var gradeLabel=document.createElement("div");

  gradeLabel.className="eyebrow";
  gradeLabel.textContent="Ընտրել դասարանը";


  var gradeNav=document.createElement("div");

  gradeNav.className="edu-kind-nav";
  gradeNav.setAttribute("data-edu-grade-filter","");


  var allButton=document.createElement("button");

  allButton.type="button";
  allButton.className="active";
  allButton.setAttribute("data-edu-grade","all");
  allButton.textContent="Բոլորը";

  gradeNav.appendChild(allButton);


  for(var i=0;i<grades.length;i++){

    var gradeId=grades[i].getAttribute("id")||"";

    var gradeValue=
      gradeId.indexOf("grade-")===0
        ? gradeId.substring(6)
        : gradeId;

    if(!gradeValue)continue;


    var button=document.createElement("button");

    button.type="button";
    button.setAttribute(
      "data-edu-grade",
      gradeValue
    );

    button.textContent=
      gradeValue+"-րդ";

    gradeNav.appendChild(button);
  }


  var typeLabel=document.createElement("div");

  typeLabel.className="eyebrow";
  typeLabel.textContent="Ընտրել նյութի տեսակը";


  typeNav.parentNode.insertBefore(
    gradeLabel,
    typeNav
  );

  typeNav.parentNode.insertBefore(
    gradeNav,
    typeNav
  );

  typeNav.parentNode.insertBefore(
    typeLabel,
    typeNav
  );


  page.setAttribute(
    "data-selected-grade",
    "all"
  );

  page.setAttribute(
    "data-selected-type",
    "all"
  );
}


var pages=
  document.querySelectorAll(".edu-hub-page");


for(var p=0;p<pages.length;p++){

  createGradeFilters(pages[p]);

  applyEduFilters(pages[p]);
}


document.addEventListener(
  "click",
  function(e){


    var gradeFilter=
      e.target.closest
        ? e.target.closest("[data-edu-grade]")
        : null;


    if(
      gradeFilter &&
      gradeFilter.closest("[data-edu-grade-filter]")
    ){

      var gradePage=
        gradeFilter.closest(".edu-hub-page");

      if(!gradePage)return;


      gradePage.setAttribute(
        "data-selected-grade",
        gradeFilter.getAttribute("data-edu-grade")
      );


      var gradeButtons=
        gradePage.querySelectorAll(
          "[data-edu-grade-filter] [data-edu-grade]"
        );


      for(var g=0;g<gradeButtons.length;g++){

        gradeButtons[g].classList.remove(
          "active"
        );
      }


      gradeFilter.classList.add("active");


      applyEduFilters(gradePage);

      return;
    }



    var filter=
      e.target.closest
        ? e.target.closest("[data-edu-type]")
        : null;


    if(
      filter &&
      filter.closest("[data-edu-filter]")
    ){

      var page=
        filter.closest(".edu-hub-page");

      if(!page)return;


      page.setAttribute(
        "data-selected-type",
        filter.getAttribute("data-edu-type")
      );


      var buttons=
        page.querySelectorAll(
          "[data-edu-filter] [data-edu-type]"
        );


      for(var i=0;i<buttons.length;i++){

        buttons[i].classList.remove(
          "active"
        );
      }


      filter.classList.add("active");


      applyEduFilters(page);

      return;
    }



    var check=
      e.target.closest
        ? e.target.closest(".edu-quiz-check")
        : null;


    if(check){

      var card=
        check.closest(".edu-quiz");

      if(!card)return;


      var chosen=
        card.querySelector(
          "input[type=radio]:checked"
        );


      var result=
        card.querySelector(
          ".edu-quiz-result"
        );


      if(!chosen){

        result.textContent=
          "Ընտրիր պատասխան։";

        return;
      }


      var ok=
        chosen.value===
        card.getAttribute("data-answer");


      result.textContent=
        ok
          ? "Ճիշտ է ✓"
          : "Սխալ է։ Փորձիր կրկին։";
    }

  }
);

})();