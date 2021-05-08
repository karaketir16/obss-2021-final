const express = require('express');
const router = express.Router();
const axios = require("axios")
const moment = require("moment")
/* GET home page. */
router.get('/api/v1/echo/:queryText', function (req, res, next) {
    res.send(req.params['queryText']);
});

router.get('/api/v1/issuetypes', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    axios.get(req.query.jiraUrl + "rest/api/2/issuetype").then(jira => {
        // let not_subtask = []
        // for(let i = 0; i < jira.data.length; i++){
        //   if( ! jira.data[i]["subtask"]){
        //     console.log(jira.data);
        //     not_subtask.push(jira.data[i]);
        //   }
        // }
        // res.json(not_subtask);
        res.json(jira.data);
    });
});

router.get('/api/v1/issues/subtasks', async function (req, res, next) {

    let jira = await axios.get(req.query.jiraUrl + "rest/api/2/search", {params: {
        jql:"project=" + req.query.projectId, maxResults:999999
    }})

    // console.log(jira.data)
    // return null;

    let subtask = []

    for (let i = 0; i < jira.data.issues.length; i++) {
        if (jira.data.issues[i].fields.issuetype.subtask) {
            subtask.push(jira.data.issues[i])
        }
    }
    // res.json(not_subtask);
    res.json({issues: subtask});

});

router.post('/api/v1/users/find-top-n-users', async function (req, res, next) {

    let projects = req.body
    console.log(req.body);

    let all_issues = [];
    for (const project of projects){
        let jira = await axios.get(req.query.jiraUrl + "rest/api/2/search", {params: {
                jql:"project=" + project, maxResults:999999
        }})
        all_issues.push(...jira.data.issues);
    }
    let users = {

    };

    // console.log(all_issues);

    for (const issue of all_issues){
        let user = issue.fields.assignee;
        if(user){
            if(users[user.key] === undefined){
                users[user.key] = user;
                users[user.key].issueCount = 1;
            } else {
                users[user.key].issueCount += 1;
            }
        }
    }

    // console.log(users)
    let user_list = []
    for (const key in users){
        user_list.push(users[key]);
    }
    user_list.sort((a,b)=> {
        if (a.issueCount === b.issueCount){
            return a.name > b.name ? 1 : -1;
        }
        return a.issueCount < b.issueCount ? 1 : -1;
    })
    // console.log(user_list)
    let ans = user_list.slice(0, req.query.topn);

    res.json(ans);
});
// http://localhost:8080/api/v1/projects/find-min-n-issues?jiraUrl={jiraUrl}&minn={minn}&topm={topm}
router.post('/api/v1/projects/find-min-n-issues', async function (req, res, next) {

    let minn = req.query.minn ? req.query.minn : 5;
    let topm = req.query.topm ? req.query.topm : 10;

    let users = req.body;

    // console.log(users)
    if(users.length > 0){
        console.log(users)
        let all_issues = [];
        for (const user of users){
            let jira = await axios.get(req.query.jiraUrl + "rest/api/2/search", {params: {
                    jql:"assignee=" + user, maxResults:999999
                }})
            all_issues.push(...jira.data.issues);
        }

        let projects = {};

        // console.log(all_issues);

        for (const issue of all_issues){
            let project = issue.fields.project;
            if(project){
                if(projects[project.key] === undefined){
                    projects[project.key] = project;
                    projects[project.key].issueCount = 1;
                } else {
                    projects[project.key].issueCount += 1;
                }
            }
        }

        // console.log(users)
        let project_list = []
        for (const key in projects){
            if(projects[key].issueCount >= minn){
                project_list.push(projects[key]);
            }
        }
        project_list.sort((a,b)=> {
            if (a.issueCount === b.issueCount){
                return a.name > b.name ? 1 : -1;
            }
            return a.issueCount < b.issueCount ? 1 : -1;
        })
        // console.log(user_list)
        let ans = project_list.slice(0, topm);

        res.json(ans);
    } else {
        res.status(500);
        res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":500,"errors":"usersnotfound"});
    }


});


module.exports = router;
