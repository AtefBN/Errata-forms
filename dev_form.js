$(document).ready(function() {
  

var issueModel = Backbone.Model.extend({
        urlRoot: 'http://localhost:5001/1/issue/create',
        sync: function(method, model, options) {
          options.headers = {
            'Content-type': 'application/json',
            'Connection': 'keep-alive',
            'Authorization': "Basic "+btoa(oauth_token+':'+username)
          };
          return Backbone.sync('create', model, options);
        },
        validate: function(attrs, options) {
          if (attrs.title.length < 5) {
            this.errorModel.clear();
            this.errorModel.set({Title: "Title length requirement"});
            if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                return "Title must be longer than 5 characters.";
          }
          else if (attrs.description.length < 10) {
            this.errorModel.clear();
            this.errorModel.set({Description: "Description length requirement"});
            if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                return "Description must be longer than 10 characters.";
          } 
          else if (attrs.datasets.length <1){
            this.errorModel.clear();
            this.errorModel.set({datasets: "Dataset list can't be empty"});
            if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                return "Dataset list for the issue can't be empty.";   
          }
          
          //Test Materials and urls regex
          else if (attrs.materials.length>0 || attrs.urls.length>0 || attrs.datasets.length>0){
            if (attrs.datasets.length > 0){
              console.log('datasets validation');
              var datasetArray = attrs.datasets.split(',');
              var datasetPattern = /\w#\w|\w\.v\w/i;
              for (var i in datasetArray){
                var datasetValid = datasetPattern.test(datasetArray[i]);
                console.log(datasetValid, datasetArray[i]);
              }
            }
            if (attrs.materials.length>0){
              console.log('materials validation');
              var materialsArray = attrs.materials.split(',');
              var materialsPattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
              for (var i in materialsArray){
                var materialsValid = materialsPattern.test(materialsArray[i]);
              }  
            }
            if (attrs.urls.length>0){
              console.log('urls validation');
              var urlsArray = attrs.urls.split(',');
              var urlsPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
              for (var j in urlsArray){
                var urlsValid = urlsPattern.test(urlsArray[j]);
              }
            }
        }
      }
});


var issueData = new issueModel({
      uid: generateUUID(), 
      title: 'Template title',
      status: "new", 
      description: 'Template description',
      urls: "http://www.url1.com,http://www.url2.com", 
      materials: "http://www.materials.com/1.jpeg,https://www.materials.com/2.png", 
      project: "cmip6",
      severity: "low", 
      datasets: "dataset-id1#version,dataset-id2#version"
    },
    {
      validate:true
    }
);


$("#jsonPreview").text(JSON.stringify(issueData.toJSON(), null, 2));

myForm = new Backform.Form({
  el: "#form-errata",
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
    control: "textarea",
    value: "",
    required: false
  },
  {
    name: "materials",
    label: "Materials",
    control: "textarea",
    value: "",
    required: false
  },
  {
    name: "datasets",
    label: "Dataset-IDs",
    control: "textarea",
    required: true,
    helpMessage: "Paste the affected dataset list seperate by a comma"
  }
  ]
}).render();

// Creating an auxiliary issueData model to avoid triggering extra unneeded change event.
issueData.on('change', function(){
      // jsonIssue = issueData.toJSON();
      jsonIssue = issueData.clone();
      jsonIssue.set('datasets', String(jsonIssue.get('datasets')).split(','));
      jsonIssue.set('materials', String(jsonIssue.get('materials')).split(','));
      jsonIssue.set('urls', String(jsonIssue.get('urls')).split(','));
      if (myForm.model.isValid()){
        var additionalText = 'Validation successful';
        isValid = true;
      }
      else {
        var additionalText = 'Validation failed: '+myForm.model.validationError;
        isValid = false;
      }
      $("#jsonPreview").text(JSON.stringify(jsonIssue, null, 2) + '\n' + additionalText);
});


// $("#form-errata").on("change", function(e){
//   var submit = myForm.fields.get("submitButton");
//   if (myForm.model.isValid())
//     submit.set({status:"success", message:"success"});
//   else
//     submit.set({status:"error", message:myForm.model.validationError});
// });

myForm.$el.on("submit",function(e){
  console.log('down here');
  // issueData.set('datasets' , jsonIssue.get('datasets'));
  // issueData.set('materials', jsonIssue.get('materials'));
  // issueData.set('urls', jsonIssue.get('urls'));
  // issueData.on('invalid', function(model, error){
  // })
  // issueData.save();

  console.log('Successfully requested issue creation...');
});
// issueData.save();
// console.log('success!');
});
