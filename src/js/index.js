const url = 'http://localhost:8002/'
let xhr = new XMLHttpRequest();

// set the dimensions and margins of the graph
const width = 500,
  height = 210,
  margin = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'tweets_dataviz'
const svg = d3.select("#tweets_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

// Create dummy data
const data = { positive: positiveTweets, negative: negativeTweets }

// set the color scale
const color = d3.scaleOrdinal()
  .domain(["Tweets utilisant le #LGBT positivement.", "Tweets utilisant le #LGBT négativement."])
  .range(d3.schemeGreys);

// Compute the position of each group on the pie:
const pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(d => d[1])
const data_ready = pie(Object.entries(data))

// The arc generator
const arc = d3.arc()
  .innerRadius(radius * 0.9)         // This is the size of the donut hole
  .outerRadius(radius * 1)

// Another arc that won't be drawn. Just for labels positioning
const outerArc = d3.arc()
  .innerRadius(radius * 1)
  .outerRadius(radius * 1)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .join('path')
  .attr('d', arc)
  .attr('fill', "#FFF")
  .attr("stroke", "#1C1C1C")
  .style("stroke-width", "3px")
  .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .join('polyline')
  .attr("stroke", "#FFF")
  .style("fill", "none")
  .attr("stroke-width", 2)
  .attr('points', function (d) {
    const posA = arc.centroid(d) // line insertion in the slice
    const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
    const posC = outerArc.centroid(d); // Label position = almost the same as posB
    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC]
  })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .join('text')
  .text(d => d.data[0])
  .attr('transform', function (d) {
    const pos = outerArc.centroid(d);
    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    return `translate(${pos})`;
  })
  .style('text-anchor', function (d) {
    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    return (midangle < Math.PI ? 'start' : 'end')
  })
  .style("fill", "#FFF")

let timeoutPopup;
let feedbackPopup;

function toggleFeedbackModal() {
  const feedbackPopup = document.querySelector('.feedback_popup')

  feedbackPopup.classList.toggle("popup_active");

}

function timeoutFeedbackModal() {
  feedbackPopup = setTimeout(toggleFeedbackModal, 5000)
}

function toggleShareModal() {
  const copiedPopup = document.querySelector('.copied_popup')

  copiedPopup.classList.toggle("popup_active");

}

function timeoutModal() {
  timeoutPopup = setTimeout(toggleShareModal, 5000)
}

function post(json) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", '/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.setRequestHeader('jsonData', json);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.response);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {

  //Share button
  let share_button = document.querySelector(".partager")
  let share_link = share_button.getAttribute('value')

  let feedbackButtons = document.querySelectorAll('.pictoR')
  let writtenFeedback = document.querySelector('#story')
  let sendFeedbackButton = document.querySelector('.submit_feedback')
  let feedback = {}

  feedbackButtons.forEach(button => {

    button.addEventListener("click", function () {
      feedback.feeling = button.children[1].classList[1]
    })

  })

  sendFeedbackButton.addEventListener('click', function () {
    feedback.feedback = writtenFeedback.value
    feedback = JSON.stringify(feedback)

    console.log(feedback)

    post(feedback)
    toggleFeedbackModal()
    timeoutFeedbackModal()
  })

  share_button.addEventListener('click', function () {

    navigator.clipboard.writeText(share_link).then(function () {
      console.log(share_link)
      toggleShareModal()
      timeoutModal()
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  })

})
let menuButton = document.getElementById("menu");
let menuItem = document.querySelector(".menuSection");
menuButton.addEventListener("click", () => {

  if (menuItem.classList.contains("menuOpen")) {
    menuItem.classList.remove("menuOpen");
    menuItem.style.display = "none";
  } else {
    menuItem.classList.add("menuOpen");
    menuItem.style.display = "flex";
  }


})
let def1 = document.getElementById("outing");
let d1 = document.getElementById("defouting");
def1.addEventListener("click", () => {
  if (getComputedStyle(d1).display != "none") {
    d1.style.display = "none";
  } else {
    d1.style.display = "flex";
  }
})
let def2 = document.getElementById("megenre");
let d2 = document.getElementById("defmegenre");
def2.addEventListener("click", () => {
  if (getComputedStyle(d2).display != "none") {
    d2.style.display = "none";
  } else {
    d2.style.display = "flex";
  }
})
let def3 = document.getElementById("therapie");
let d3 = document.getElementById("deftherapie");
def3.addEventListener("click", () => {
  if (getComputedStyle(d3).display != "none") {
    d3.style.display = "none";
  } else {
    d3.style.display = "flex";
  }
})
let def4 = document.getElementById("cis");
let d4 = document.getElementById("defcis");
def4.addEventListener("click", () => {
  if (getComputedStyle(d4).display != "none") {
    d4.style.display = "none";
  } else {
    d4.style.display = "flex";
  }
})
let def5 = document.getElementById("constitutionnel");
let d5 = document.getElementById("defconstitutionnel");
def5.addEventListener("click", () => {
  if (getComputedStyle(d5).display != "none") {
    d5.style.display = "none";
  } else {
    d5.style.display = "flex";
  }
})
let def6 = document.getElementById("pride");
let d6 = document.getElementById("defpride");
def6.addEventListener("click", () => {
  if (getComputedStyle(d6).display != "none") {
    d6.style.display = "none";
  } else {
    d6.style.display = "flex";
  }
})
let def7 = document.getElementById("comingout");
let d7 = document.getElementById("defcomingout");
def7.addEventListener("click", () => {
  if (getComputedStyle(d7).display != "none") {
    d7.style.display = "none";
  } else {
    d7.style.display = "flex";
  }
})
let def8 = document.getElementById("transition");
let d8 = document.getElementById("deftransition");
def8.addEventListener("click", () => {
  if (getComputedStyle(d8).display != "none") {
    d8.style.display = "none";
  } else {
    d8.style.display = "flex";
  }
})
let def9 = document.getElementById("trans");
let d9 = document.getElementById("deftrans");
def9.addEventListener("click", () => {
  if (getComputedStyle(d9).display != "none") {
    d9.style.display = "none";
  } else {
    d9.style.display = "flex";
  }
})
let stopButton = document.getElementById("stopButton");
let slides = document.querySelector(".Slides");
let slide = document.querySelector(".Slide");
stopButton.addEventListener("click", () => {
  if (slide.classList.contains("blur")) {
    slide.classList.remove("blur");
  } else {
    slide.classList.add("blur");
  }

});