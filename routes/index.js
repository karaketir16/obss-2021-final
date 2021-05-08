const express = require('express');
const router = express.Router();
const axios = require("axios")
const moment = require("moment")
/* GET home page. */

router.post('/api/v1/echo/:queryText', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'POST' not supported"});
})
router.put('/api/v1/echo/:queryText', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'PUT' not supported"});
})
router.get('/api/v1/echo/:queryText', function (req, res, next) {
    res.send(req.params['queryText']);
});

function jiraURLnot(url){
    if(url === undefined || url === ""){
        return {"timestamp":moment().format("YYYY-MM-DD"),"status":400,"errors":"Required String parameter 'jiraUrl' is not present"}
    } else {
        return false
    }
}

async function jiraNotAvailable(url){
    try{
        let jira = await axios.get(url + "rest/api/2/status");
    } catch (e) {
        return {"timestamp":moment().format("YYYY-MM-DD"),"status":500,"errors":"Jira is not available"}
    }
    return false;
}

router.post('/api/v1/issuetypes', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'POST' not supported"});
})
router.put('/api/v1/issuetypes', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'PUT' not supported"});
})
router.get('/api/v1/issuetypes', async function (req, res, next) {
    // res.render('index', { title: 'Express' });
    let x = jiraURLnot(req.query.jiraUrl);
    if(x){
        res.status(x.status);
        res.json(x);
        return;
    }
    x = await jiraNotAvailable(req.query.jiraUrl);
    if(x){
        console.log(x)
        res.status(x.status);
        res.json(x);
        return;
    }

    let jira = await axios.get(req.query.jiraUrl + "rest/api/2/issuetype")

    res.json(jira.data);

});

router.post('/api/v1/issues/subtasks', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'POST' not supported"});
})
router.put('/api/v1/issues/subtasks', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'PUT' not supported"});
})
router.get('/api/v1/issues/subtasks', async function (req, res, next) {
    let x = jiraURLnot(req.query.jiraUrl);
    if(x){
        res.status(x.status);
        res.json(x);
        return;
    }
    x = await jiraNotAvailable(req.query.jiraUrl);
    if(x){
        console.log(x)
        res.status(x.status);
        res.json(x);
        return;
    }

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

router.get('/api/v1/users/find-top-n-users', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'GET' not supported"});
})
router.put('/api/v1/users/find-top-n-users', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'PUT' not supported"});
})
router.post('/api/v1/users/find-top-n-users', async function (req, res, next) {
    let x = jiraURLnot(req.query.jiraUrl);
    if(x){
        res.status(x.status);
        res.json(x);
        return;
    }
    x = await jiraNotAvailable(req.query.jiraUrl);
    if(x){
        console.log(x)
        res.status(x.status);
        res.json(x);
        return;
    }

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

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// http://localhost:8080/api/v1/projects/find-min-n-issues?jiraUrl={jiraUrl}&minn={minn}&topm={topm}
router.get('/api/v1/projects/find-min-n-issues', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'GET' not supported"});
})
router.put('/api/v1/projects/find-min-n-issues', async function (req, res, next) {
    res.status(405);
    res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":405,"errors":"Request method 'PUT' not supported"});
})
router.post('/api/v1/projects/find-min-n-issues', async function (req, res, next) {
    let x = jiraURLnot(req.query.jiraUrl);
    if(x){
        res.status(x.status);
        res.json(x);
        return;
    }
    x = await jiraNotAvailable(req.query.jiraUrl);
    if(x){
        console.log(x)
        res.status(x.status);
        res.json(x);
        return;
    }

    let minn = req.query.minn ? req.query.minn : 5;
    let topm = req.query.topm ? req.query.topm : 10;

    let users = req.body;

    console.log(users);
    console.log(users.length);
    console.log(users === []);

    if( (!isEmpty(users)) && users.length > 0){
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
    } else if (users.length !== undefined){
        res.status(500);
        res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":500,"errors":"users not found"});
    } else{
        res.status(400);
        res.json({"timestamp":moment().format("YYYY-MM-DD"),"status":400,"errors":"Required request body is missing"});
    }


});


module.exports = router;
