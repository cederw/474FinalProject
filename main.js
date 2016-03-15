var width = 600,
    height = 800,
    centered;

var projection = d3.geo.albers()
    .center([0, 47.6097])
    .rotate([122.3331, 0])
    .parallels([50, 60])
    .scale(1200 * 5 * 30)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");



d3.select('#slider-range').call(d3.slider().scale(d3.time.scale()
    .domain([new Date(2009,1,1), new Date(2016,1,1)]))
    .axis( d3.svg.axis() ).snap(true).value([new Date(2010,1,1),new Date(2016,1,1)])
    .on("slide", function(evt, value) {
      //value[ 0 ]
      console.log(value[0]+value[1]);
      //value[ 1 ]
    }));

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var tooltip = d3.select('.chart').append('div')
    .attr('class', 'hidden tooltip');

//load the map
d3.json("Neighborhoods.json", function(error, neigh) {
  if (error) {
  	return console.error(error);
  }
  console.log(neigh);
  g.append("g")
    .selectAll(".collection")
      .data(topojson.feature(neigh, neigh.objects.collection).features)
    .enter().append("path")
      .attr("class", function(d) {
        if(d.properties.S_HOOD){
          return "collection " + d.properties.S_HOOD.replace(/\s/g, '');
        } else {
          return "collection " + "none";
        }
         
      })
      .attr("d", path)
      .on("click", clicked)
      .on("mousemove", function(d) {
        if(d.properties.S_HOOD == "OOO") {
          return;
        }

        var mouse = d3.mouse(svg.node()).map(function(d) {
          return parseInt(d);
        });
        tooltip.classed('hidden', false)
          .attr('style', 'left:' + (mouse[0] + 880) + 'px; top:' + (mouse[1] + 40) + 'px')
          .html(d.properties.S_HOOD);
      }).on("mouseout", function() {
        tooltip.classed('hidden', true); 
      });

     
  g.append("g")
  .selectAll(".subunit-label")
    .data(topojson.feature(neigh, neigh.objects.collection).features)
  .enter().append("text")
    .attr("class", function(d) { if(d.properties.S_HOOD == "OOO") {return "collection-bad";} else {return "collection-label " + d.properties.S_HOOD;}})
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dy", ".35em");
});

arrays = loadCrimes(svg);
arrays2 = loadPermits(svg);
landPermits = loadLandPermits(svg);
culture = loadCulture(svg);

console.log(arrays);
console.log(arrays2);

function loadCrimes() {
	crimes = [];
    d3.csv("crimes2.csv", function(data) {
        data.forEach(function(d) {
            var str = d["Neighborhood"].replace(/\s+/g, '');
            crimes.push({ "Crime": d["Crime"], "Latitude": d["Latitude"], "Longitude": d["Longitude"], "Year" : d["Year"], "Neighborhood" : str});
        });  
        //gradientsCrime(2012,crimes)
    });
    return crimes;
}

function loadPermits() {
  permits = [];
    d3.csv("permits.csv", function(data) {
        data.forEach(function(d) {
            var str = d["Neighborhood"].replace(/\s+/g, '');
            var date = "20"+d["Issue Date"].substring(d["Issue Date"].length-2, d["Issue Date"].length)
            permits.push({ "Permit Type": d["Permit Type"], "Value": d["Value"], "Year": date, 
              "Status": d["Status"], "Latitude": d["Latitude"], "Longitude": d["Longitude"], "Neighborhood" : str});
        });
        console.log(permits)
        gradientsPermits(2013,permits)
    });
    return permits;
}

function gradientsCrime(num, array) {
  neighborhoods = [];
  console.log("HUEHUEHUE")
  console.log(array)
  for(i = 0; i < array.length;i++) {
    if(parseInt(arrays[i].Year) == num)  
      if(neighborhoods[arrays[i].Neighborhood] == undefined) {
        neighborhoods[arrays[i].Neighborhood] = 1;
      }
      else {
        neighborhoods[arrays[i].Neighborhood] = neighborhoods[arrays[i].Neighborhood] + 1;
      }
  }
  for(var key in neighborhoods) {
    if(neighborhoods[key] < 5) {
      try {
        d3.select("."+key).style("fill","rgb(200, 200, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(neighborhoods[key] >= 5 && neighborhoods[key] < 10) {
      try {
        d3.select("."+key).style("fill","rgb(150, 150, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(neighborhoods[key] >= 10 && neighborhoods[key] < 20) {
      try {
        d3.select("."+key).style("fill","rgb(100, 100, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }  
    else if(neighborhoods[key] >= 20 && neighborhoods[key] < 30) {
      try {
        d3.select("."+key).style("fill","rgb(50, 50, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(neighborhoods[key] >= 30) {
      try {
        d3.select("."+key).style("fill","rgb(0, 0, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }   
  }
}

function gradientsPermits(num, array) {
  permits = [];
  console.log(array);
  for(i = 0; i < array.length;i++) {
    if(arrays[i] != undefined) {
      if(parseInt(arrays[i].Year) == num) {  
        if(permits[arrays[i].Neighborhood] == undefined) {
          permits[arrays[i].Neighborhood] = 1;
        }
        else {
          permits[arrays[i].Neighborhood] = permits[arrays[i].Neighborhood] + 1;
        }
      }
    }
  }
  console.log(permits);
  for(var key in permits) {
    if(permits[key] < 5) {
      try {
        d3.select("."+key).style("fill","rgb(200, 200, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(permits[key] >= 5 && permits[key] < 10) {
      try {
        d3.select("."+key).style("fill","rgb(150, 150, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(permits[key] >= 10 && permits[key] < 20) {
      try {
        d3.select("."+key).style("fill","rgb(100, 100, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }  
    else if(permits[key] >= 20 && permits[key] < 30) {
      try {
        d3.select("."+key).style("fill","rgb(50, 50, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }
    else if(permits[key] >= 30) {
      try {
        d3.select("."+key).style("fill","rgb(0, 0, 255)");
      }
      catch(err) {
        console.log("hi")
      }
    }   
  }
}

function loadLandPermits(svg) {
  lpermits = [];
    d3.tsv("data/Land_Use_Permits.txt", function(data) {
        data.forEach(function(d) {
            lpermits.push({ "Address": d["Address"], "Applicant Name": d["Applicant Name"], "Neighborhood Calculated": d["Neighborhood Calculated"], 
              "Issue Date": d["Issue Date"], "Latitude": d["Latitude"], "Longitude": d["Longitude"], "Application Date" : d["Application Date"]});
        });
        console.log(lpermits)
    });
    return lpermits;
}

function loadCulture(svg) {
  cpermits = [];
    d3.tsv("data/Seattle_Cultural_Space_Inventory-3.txt", function(data) {
        data.forEach(function(d) {
            cpermits.push({ "Name": d["Name"], "Constiuents": d["Constiuents"], "Location": d["Location"], "Neighborhood": d["Neighborhood"],  "Year Occupied": d["Year Occupied"],
              "Own or Rent": d["Own or Rent"], "Parking Spaces": d["Parking Spaces"], "Square Feet": d["Square Feet"], "Type" : d["Type"]});
        });
        console.log(cpermits)
    });
    return cpermits;
}

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}