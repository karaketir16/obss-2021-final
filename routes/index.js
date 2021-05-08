const express = require('express');
const router = express.Router();
const axios = require("axios")
/* GET home page. */
router.get('/api/v1/echo/:queryText', function(req, res, next) {
  res.send(req.params['queryText']);
});

router.get('/api/v1/issuetypes', function(req, res, next) {
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

router.get('/api/v1/issues/subtasks', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log(req.query.jiraUrl)
  axios.get(req.query.jiraUrl + "rest/api/2/project/" + req.query.projectId).then(jira => {
    // let not_subtask = []
    for(let i = 0; i < jira.data.length; i++){
      if( ! jira.data[i]["subtask"]){
        console.log(jira.data);
        not_subtask.push(jira.data[i]);
      }
    }
    // res.json(not_subtask);
    res.json(jira.data);
  });
});



module.exports = router;
