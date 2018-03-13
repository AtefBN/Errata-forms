$(document).ready(function() {
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


  var oauth_token = getUrlParameter('token');
  var username = getUrlParameter('username');
  var currentdate = new Date(); 
  var datetime = currentdate.getFullYear()+ "-"
                + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + " " 
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  var issueData = new Backbone.Model({
      uid: generateUUID(), 
      title: 'Template title',
      status: "new", 
      description: 'Template description',
      urls: "http://www.google.com", 
      materials: "https://image.freepik.com/free-photo/cute-cat-picture_1122-449.jpg", 
      project: "",
      severity: "", 
      datasets: "dataset-id#version"
  });
  $("#jsonPreview").text(JSON.stringify(issueData.toJSON(), null, 2));
  var projectAttributes = new Backbone.Model();
  var jsonFacets = {
        "default": [
          {name: "default_attr", label: "Specify project.", 
          control: "input", disabled: true, required: true}
        ],
       "cmip6": [
          {name: "institute", label: "Institute Id", control: "input", required: true},
          {name: "source_id", label: "Source Id", control: "input", required: true},
          {name: "experiment", label: "Experiment Id", control: "input", required: true},
          {name: "variable", label: "Variable Id", control: "input", required: true}
        ],
       "cmip5": [
          {name: "institute",label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
       "cordex": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "rcm_name", label: "RCM Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "geomip": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "lucid": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "pmip3": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "tamip": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "euclipse": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "cordex-adjust": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "rcm_model", label: "RCM Name", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "input4mips": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "source", label: "Source", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "obs4mips": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "source", label: "Source", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "isimip-ft": [
          {name: "sector", label: "Sector", control: "input", required: true},
          {name: "impact_model", label: "Impact Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "primavera": [
          {name: "institute", label: "Institute", control: "input", required: true},
          {name: "model", label: "Model", control: "input", required: true},
          {name: "experiment", label: "Experiment", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ],
        "cc4e": [
          {name: "workPackage", label: "Work Package", control: "input", required: true},
          {name: "product", label: "Product", control: "input", required: true},
          {name: "source_data_id", label: "Source", control: "input", required: true},
          {name: "variable", label: "Variable", control: "input", required: true}
        ]
      };
   myform = new Backform.Form({
    el: $("#form-errata"),
    model: issueData,
    fields: [
    {
      name: "uid",
      label: "UUID",
      control: "input",
      disabled: "disabled",
      required: true
    },
    {
      name: "title",
      label: "Title",
      control: "input",
      required: true
    }, 
    {
      name: "project",
      label: "Project",
      control: "select",
      options:[{label: "--Select project--", value: "default"},
               {label: "CMIP6", value: "cmip6"},
               {label: "CMIP5", value: "cmip5"},
               {label: "CORDEX", value: "cordex"},
               {label: "GEOMIP", value: "geomip"},
               {label: "LUCID", value: "lucid"},
               {label: "PMIP3", value: "pmip3"},
               {label: "TAMIP", value: "tamip"},
               {label: "EUCLIPSE", value: "euclipse"},
               {label: "CODEX-ADJUST", value: "cordex-adjust"},
               {label: "INPUT4MIPS", value: "input4mips"},
               {label: "OBS4MIPS", value: "obs4mips"},
               {label: "ISIMIP-FT", value: "isimip-ft"},
               {label: "PRIMAVERA", value: "primavera"},
               {label: "CC4E", value: "cc4e"}],
      required: true,
    },
    {
      name: "description",
      label: "Description",
      control: "textarea",
      required: true
    },
    {
      name: "status",
      label: "Status",
      disabled: "disabled",
      control: "input",
      required: true
    },
    {
      name: "severity",
      label: "Severity",
      control: "select",
      options:[{label: "--Select severity--", value: "default"}, 
               {label: "High", value: "high"}, 
               {label:"Medium", value: "medium"},
               {label: "Low", value: "low"},
               {label: "Critical", value: "critical"}
               ],
      required: true
    },
    {
      name: "urls",
      label: "URLS",
      control: "input",
      value: "",
      required: false
    },
    {
      name: "materials",
      label: "Materials",
      control: "input",
      value: "",
      required: false
    },
    {
      name: "datasets",
      label: "Dataset-IDs",
      control: "textarea",
      required: true,
      helpMessage: "Paste the affected dataset list seperate by a comma"
    },

    ],
  }).render();
// Some properties are project specific and are rendered when user chooses the project. 
// it updates on change. 
  function clean(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '' || jQuery.isEmptyObject(obj[propName])) {
        delete obj[propName];
      }
    }
  }


  function reformatJson(obj){
    var propNames = Object.getOwnPropertyNames(obj.facets);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      obj.facets[propName] = obj.facets[propName].split(',');
    }
  }

  // var errataFacets = new Backbone.Model();
  // var additionalFormChanged = false;
  var globalJsonIssue = null;
  issueData.on('refresh', function(){
      jsonIssue = issueData.toJSON();
      clean(jsonIssue);
      jsonIssue.datasets = jsonIssue.datasets.split(',');
      //Optional fields to be treated like so.
      jsonIssue.materials = jsonIssue.materials.split(',');
      jsonIssue.urls = jsonIssue.urls.split(','); 
      globalJsonIssue = jsonIssue;
      $("#jsonPreview").text(JSON.stringify(jsonIssue, null, 2));
  });

issueData.on('change', function(){
      jsonIssue = issueData.toJSON();
      clean(jsonIssue);
      jsonIssue.datasets = jsonIssue.datasets.split(',');
      //Optional fields to be treated like so.
      jsonIssue.materials = jsonIssue.materials.split(',');
      jsonIssue.urls = jsonIssue.urls.split(','); 
      globalJsonIssue = jsonIssue;
      $("#jsonPreview").text(JSON.stringify(jsonIssue, null, 2));
  });

$('#submitButton').on('click',function(){
jsonData = globalJsonIssue;
//here send request to errata ws
      console.log('using oauth token')
      var errata_form_request = new XMLHttpRequest();
      var errata_ws = "http://localhost:5001/1/issue/create";
      var data = jsonData;
      errata_form_request.open("POST", errata_ws, true);
      //Send the proper header information along with the request
      errata_form_request.setRequestHeader("Content-type", "application/json");
      // errata_form_request.setRequestHeader("Content-length", data.length);
      errata_form_request.setRequestHeader("Connection", "keep-alive");
      if(typeof oauth_token === undefined){
        alert('Token expired please authenticate.');
      }
      errata_form_request.setRequestHeader("Authorization", "Basic "+btoa(oauth_token+':'+username));
      errata_form_request.onreadystatechange = function() {//Call a function when the state changes.
        if(errata_form_request.readyState == 4 && errata_form_request.status == 200) {
          alert("Success, issue can be viewed on  https://test-errata.es-doc.org/viewer.html?uid="+jsonData['uid']);
        }
        else if(errata_form_request.status == 401){
          alert("User authentication failed.");
        }
        else if(errata_form_request.status == 403){
          alert("User authorization failed, if you think this is a mistake, contact es-doc errata admins.");
        }
        else if(errata_form_request.status == 404){
          alert("Servers down.");
        }
      }
      jsonData = data;
      console.log(JSON.stringify(jsonData));
      errata_form_request.send(JSON.stringify(data));

      return false;
    });
});