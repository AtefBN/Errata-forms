$(document).ready(function() {

var issueModel = Backbone.Model.extend({
        urlRoot: 'https://test-errata-api.es-doc.org/1/issue/create',
        sync: function(method, model, options) {
          options.headers = {
            'Content-type': 'application/json',
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
          if (attrs.description.length < 10) {
            this.errorModel.clear();
            this.errorModel.set({Description: "Description length requirement"});
            if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                return "Description must be longer than 10 characters.";
          } 
          if (attrs.datasets.length <1){
            this.errorModel.clear();
            this.errorModel.set({datasets: "Dataset list can't be empty"});
            if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                return "Dataset list for the issue can't be empty.";   
          }
          
          //Test Materials and urls regex
          if (attrs.materials.length>0 || attrs.urls.length>0 || attrs.datasets.length>0){
            if (attrs.datasets.length > 0){
              var datasetValid = true;
              var datasetArray = String(attrs.datasets).split(',').map(item=>item.trim());
              var datasetPattern = /\w#\w|\w\.v\w/i;
              if (!checkRegex(datasetArray, datasetPattern)){
                datasetValid = false;
                this.errorModel.clear();
                this.errorModel.set({datasets: "Dataset format invalid"});
                if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                    return "Dataset format invalid needs to be dataset-id#version.";
              }
            }
            if (attrs.materials.length>0){
              var materialsValid = true;
              var materialsArray = String(attrs.materials).split(',').map(item=>item.trim());
              var materialsPattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
              if (!checkRegex(materialsArray, materialsPattern)){
                urlsValid = false;
                this.errorModel.clear();
                this.errorModel.set({urls: "URLs item is invalid"});
                if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                  return "One of the urls provided has invalid format.";
              }  
            }
            if (attrs.urls.length>0){
              var urlsValid = true;
              var urlsArray = String(attrs.urls).split(',').map(item=>item.trim());
              var urlsPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
              if (!checkRegex(urlsArray, urlsPattern)){
                urlsValid = false;
                this.errorModel.clear();
                this.errorModel.set({urls: "URLs item is invalid"});
                if (!_.isEmpty(_.compact(this.errorModel.toJSON())))
                  return "One of the urls provided has invalid format.";
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
      urls: "http://www.google.com", 
      materials: "https://test-errata.es-doc.org/media/img/materials/material-01.png,https://test-errata.es-doc.org/media/img/materials/material-02.png", 
      project: "cmip6",
      severity: "low", 
      datasets: "dataset-id1#version,dataset-id2#version"
    },
    {
      validate:true
    }
);

$("#jsonPreview").text('Your issue preview will go here.');


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
  },
  {
    id: 'submitButton',
    name: 'formSubmitButton',
    control: 'button'
  }
  ]
}).render();

// Creating an auxiliary issueData model to avoid triggering extra unneeded change event.
issueData.on('change', function(){
      var submit = myForm.fields.get("submitButton");
      jsonIssue = issueData.clone();
      jsonIssue.set('datasets', splitListAndClean(jsonIssue.get('datasets'), ','));
      jsonIssue.set('materials', splitListAndClean(jsonIssue.get('materials'), ','));
      jsonIssue.set('urls', splitListAndClean(jsonIssue.get('urls'), ','));
      if (myForm.model.isValid()){
        var additionalText = 'Validation successful';
        isValid = true;
        submit.set({status:"success", message: "Success!"});
      }
      else {
        var additionalText = 'Validation failed: '+myForm.model.validationError;
        submit.set({status:"error", message: myForm.model.validationError});
        isValid = false;
      }
      $("#jsonPreview").text(JSON.stringify(jsonIssue, null, 2) + '\n' + additionalText);
});

$('#form-errata .formSubmitButton').on("click",function(e){
  issueData.set('datasets' , jsonIssue.get('datasets'));
  issueData.set('materials', jsonIssue.get('materials'));
  issueData.set('urls', jsonIssue.get('urls'));
  issueData.on('invalid', function(model, error){
  })
  issueData.save();
  console.log('Successfully requested issue creation...');
});
});
