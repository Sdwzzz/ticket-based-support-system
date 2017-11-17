# askElf
Q/A support system for geme related doubts

>> if you stuck in any of your intresting game levels or you want some
 cheat sheet for your favourite game. here you get answer for all your gamming related questions.


### FIRST CLONE THE REPO USING THIS COMMAND

>> https://github.com/coolarun/ticket-based-support-system.git

===================================

### CHANGE MONGODB URL

>> go to the config folder there you have database.js file. open that file
in that file change the dbUrl to your mongodb url

===================================

### THEN PERFOM FOLLOWING COMMAND STEP BY STEP(ON TERMINAL)

>> npm install 

>> node server.js

===================================

### THAT'S IT YOUR APP IS NOW RUNNING ON THE PORT 3000

>> go to - http://localhost:3000
  now you can see the running app

===================================

### IMPORTANT API END POINTS

```
1. api/signup (POST)
end point for  sign up 
body-parameters: userName, email, password, gender,interestedGames

```

```
2. api/login (POST)
end point for login  
body-parameters : email, password
```

```
3. api/logout (GET)
end point for logout
```

```
4. api/profile/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
gieves all the recent questions.
jwt token is required to access this end point, you can send token in any one of the following format
url query, cookies 
```

``` 
5. api/vote (POST)
end point for post the vote for question and answers
body-parameter : vote (value: "up" or "down")
                 give (value: "question" or "answer")
                 voteId (value: "the id of the question or answer you wanted to vote for")

```

```
6. api/statusupdate (POST)
end point for update the status of the question
body-parameter : status (value: "open" or "closed")
                 questionId (value: "the id of the question or answer you wanted update the status ")

```

```
7. api/newanswer (POST)
end point for  post the answer for the questions
body-parameter : answer (value: "answer for that question")
                 questionId (value: "the id of the question you want to answer")

```

```
8. api/getuserquestion/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
end point for get all the user asked questions


```

```
9. api/statusbaseduserquestion/:status/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
status (value: "open" or "closed");
end point for get all the user asked questions based on the status


```

```
10. api/useranswer/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
end point for get all the user answered questions 


```


```
11. api/statusbaseduseranswer/:status/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
status (value: "open" or "closed");
end point for get all the user answered questions based on the status


```

```
12. api/statusbasedquestion/:status/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
status (value: "open" or "closed");
end point for get all the questions based on the status


```

```
13. api/questiondetail/:id (GET)
id (value:'id of that question')
end point for get full details of the particular question


```

```
14. api/deletequestion (POST)
body-parameters : questionId (value:"id of that question")
end point for delete the particular question


```


```
15. api/deleteanswer (POST)
body-parameters : answerId (value:"id of that question")
end point for delete the particular answer


```

```
16. api/askquestion (POST)
body-parameters : title (value:'short title of that question')
                  question (value:'elobrate detail of that question')
                  game (value:'type of game related question is this')
end point for post new questions


```





===================================
