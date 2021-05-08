const express = require('express');
const router = express.Router();
const axios = require("axios")
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


module.exports = router;
