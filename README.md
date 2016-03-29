# snap-gig
A web app where users can post freelance gigs. Users who are not gig managers are then able to submit files to specific gigs. Submissions are judged by the gig manager and winning submissions are selected, notifying the submission owner.

# dev quick curl commands
make user:
curl -X POST --data '{"username":"testname2", "password":"123456", "email":"poop2@gmail.com", "occupation":"web-design"}' localhost:3000/public/user

login with user above: (gets you a token)
curl -X POST -u testname2:123456 localhost:3000/login/login

GET to /api/gigs: (to show all gigs)
curl -X GET -H 'Authorization: token INSERT YOUR_TOKEN_HERE' localhost:3000/api/gigs

POST to /api/gigs: (to post a gig)
curl -X POST -H 'Authorization: token INSERT YOUR_TOKEN_HERE' --data '{"name":"logo", "category":"pics", "description":"need a logo for my site", "deadline": "1-26-2016", "payment_range":500}' localhost:3000/api/gigs

POST to /api/gigs/:id/submissions (to post a submission to a specific id)
curl -X POST -H 'Authorization: token INSERT YOUR_TOKEN_HERE' --data '{"name":"logo", "category":"pics", "description":"need a logo for my site", "deadline": "1-26-2016", "payment_range":500}' localhost:3000/api/gigs/:SPECIFIC_ID/submissions
