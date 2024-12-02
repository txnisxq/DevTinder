

# auth-Router
1> POST api => signup
2> POST api => login
3> POST api => logout


# profile-Router
4> GET api => "/profile/view"  for getting my        profile data . 
5> PATCH api => "/profile/edit"  for updating my profile data.
6> PATCH api => "/profile/changePassword".


# connection-Request-Router
7> POST api => /request/send/interested/:userId (right-swipe).
8> POST api => /request/send/ignored/:userId
(left-swipe).
9> POST api => /request/review/accept/:requestId
10> POST api => /request/review/reject/:requestId



# userRouter
11> GET => /user/connections
12> GET => /user/requests/received
13> GET => /user/feed (this api gives u the profile of other users in my homepage/feed)