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





Sam's Curl command for sending document/pictures from yesterday.

curl -X POST -H 'Authorization: token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmZiMGEyMzhmNDAyZjhhNjAwZDM1ZTMiLCJlbWFpbCI6InBAZ21haWwuY29tIiwib2NjdXBhdGlvbiI6IndlYi1kZXNpZ24iLCJpYXQiOjE0NTkyOTI3Mzl9.PMeEMHsvaI0hi7irk0Bq1IycrKy6fz0jImeIUn8KY18' --data '{"name":"Sending Picture","body":"DELETE", "category":"pics", "description":"need a logo for my site", "deadline": "1-26-2016", "payment_range":500}' localhost:3000/api/gigs/56faba21038f946e5829cbfd/submissions


curl for gigs/:id/submissions
56fc0ab06808017a04c8ca54



curl -X POST -H 'Authorization: token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmZjMzE0MWU2ZDk5NjA0MWU0OWQzNGQiLCJlbWFpbCI6InBvb3AyQGdtYWlsLmNvbSIsIm9jY3VwYXRpb24iOiJ3ZWItZGVzaWduIiwiaWF0IjoxNDU5Mzc1MDI5fQ.URNwRWmBi9EwtlPnc4vzt5JR_Z30a5mLpjbEoOVLDDU' --data '{"name":"Any name", "body":"New Submission with Hugo", "path":"/../img/picture.png"}' localhost:3000/api/gigs/56faba21038f946e5829cbfd/submissions

curl -X POST -H 'Authorization: token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmZjMzE0MWU2ZDk5NjA0MWU0OWQzNGQiLCJlbWFpbCI6InBvb3AyQGdtYWlsLmNvbSIsIm9jY3VwYXRpb24iOiJ3ZWItZGVzaWduIiwiaWF0IjoxNDU5Mzc1MDI5fQ.URNwRWmBi9EwtlPnc4vzt5JR_Z30a5mLpjbEoOVLDDU' --data '{"name":"5fc submission", "body":"New Submission with Hugo", "path":"/../img/picture.png"}' localhost:3000/api/gigs/56fc31a4e6d996041e49d34e/submissions


56fc31a4e6d996041e49d34e
