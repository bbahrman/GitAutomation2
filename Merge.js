/**
 * Created by ben on 5/10/17.
 */
var nodeGit = require('nodegit');
var path = require('path');
var fs = require('fs');

var url = "https://github.com/bbahrman/GitValidation.git";
var local = './tempRepo';
var cloneOpts = {};

fullMerge();
/**
 * Clone a remote repository
 * This function should be used only when the repository being accessed does not exist locally
 */
function cloneRepo() {
    nodeGit.Clone(url,local, cloneOpts).then(function (repo) {
        console.log("Cloned " + path.basename(url) + " to " + repo.workdir());
    }).catch(function (err) {
        return err;
    });
}

function checkoutBranch(branch) {
    nodeGit.Repository.open(path).then(function(repo) {
       return repo.getCurrentBranch().then(function(ref) {
           console.log("On " + ref.shortHand() + " " + ref.target());
           console.log("Checking out master");
       })
    });
}

/**
 * Create release branch
 *
 * Creates new branch with one of the following formats:
 * * Release_[ENV]_[Feature]
 * * Release_[Tag]
 *
 * @param baseBranch base branch, can be feature or master
 * @param [environment] the environment branch the release will be merged into
 * @param [tag] tag for production release
 */
function createRelease(baseBranch, environment, tag) {
    // check out base branch
    repo.checkoutBranch(baseBranch,null).then(function () {
        repo.createBranch('Release_' + environment + '_' + baseBranch, 'HEAD', false).then(function (reference) {
           return reference;
        });
    });
}


function fullMerge(feature, environment) {
    nodeGit.Repository.open(local).then(function (repo) {

        repo.fetchAll(null,callback);
        // // create release branch
        var release = createRelease(feature, environment);
        //
        // // merge environment into release
        // var conflicts = merge(release, environment);
        //
        // if (!conflicts) {
        //     // if no true conflicts (conflicts between changes on feature and environment) merge release into environment
        //     merge(environment, release);
        // } else {
        //     // if there are conflicts exit without merging
        // }
    }).catch(function (err) {
        console.log('Error encountered ' + err + '\nAttempting to resolve');
        cloneRepo().then(function () {
            fullMerge(feature, environment);
        });
    });
}

