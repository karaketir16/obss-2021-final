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

router.get('/api/v1/issues/subtasks', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log(req.query.jiraUrl)
  let jira = await axios.get(req.query.jiraUrl + "rest/api/2/project/" + req.query.projectId);
  // let jira = await axios.get(req.query.jiraUrl + "rest/api/2/project/" + req.query.projectId + "/components");
  // let issues = await axios.get(req.query.jiraUrl + "rest/api/2/component/" + jira.data.id +"/relatedIssueCounts");
  // /rest/api/2/component/{id}/relatedIssueCounts
  // console.log(jira.data);
  let subtask = []
  for(let i = 0; i < jira.data.issueTypes.length; i++){
    if( jira.data.issueTypes[i]["subtask"]){
      // console.log(jira.data.issueTypes);
      console.log(jira.data);
      let issue = await axios.get(req.query.jiraUrl + "rest/api/2/issue/" + jira.data.issueTypes[i].id);
      subtask.push(issue.data);
    }
  }
    // res.json(not_subtask);
  res.json(subtask);

});



module.exports = router;
