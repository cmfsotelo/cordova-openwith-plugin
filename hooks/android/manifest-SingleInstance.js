
var fs = require('fs');
var path = require('path');

function replacerLaunchMode(match, p1, p2, p3, offset, string){
    var newLaunchMode = "launchMode=\"singleInstance\"";
    return [p1,newLaunchMode,p3].join("");
}

function replacerLegacyStorage(match, p1, p2, offset, string){
    if(p2.includes("icon")){
      return [p1," android:requestLegacyExternalStorage=\"true\" ",p2].join("");
    }else{
      return [p1,p2].join("");
    }
  }

module.exports = function (context) {

    console.log("Start changing Manifest!");
    var Q = context.requireCordovaModule("q");
    var deferral = new Q.defer();

    var projectRoot = context.opts.cordova.project ? context.opts.cordova.project.root : context.opts.projectRoot;
    var manifestPath = path.join(projectRoot,"platforms","android","app","src","main","AndroidManifest.xml");
    var manifest = fs.readFileSync(manifestPath, "utf8");

    var regexLaunchMode = /(<\?xml[.|\s|\S]*<activity[.|\s|\S]*)(launchMode="\w*")([\s|\S]*manifest>)/gm;
    manifest = manifest.replace(regexLaunchMode,replacerLaunchMode);

    //Traditional Storage
    var regexLegacyStorage = /(<\?xml [\s|\S]*<application) (android:[\s|\S]*<\/manifest>)/gm;
    manifest = manifest.replace(regexLegacyStorage,replacerLegacyStorage);
    //end Traditional Storage

    
    fs.writeFileSync(manifestPath, manifest);
    console.log("Finished changing Manifest!");
    deferral.resolve();

    return deferral.promise;
}