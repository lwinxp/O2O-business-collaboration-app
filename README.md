# o2o-business-collaboration-app

## Setup Steps
1. docker pull immaterium/it5007_a0211264u_lim-xuan-ping:0.04 
(from https://hub.docker.com/repository/docker/immaterium/it5007_a0211264u_lim-xuan-ping, look for tag v0.04)

2. docker run -p 3000:3000 -p 8000:8000 -dit --privileged immaterium/it5007_a0211264u_lim-xuan-ping:v0.04 /sbin/init
(it is unsafe to run as --privileged container)

3. docker ps -a
(check name of container_started)

3. docker exec -it < container_started > /bin/bash

4. in container with mongodb, in home directory, run
git clone https://github.com/lwinxp/o2o-business-collaboration-app.git 
project root directory created

5. Attach VSCode to the container that you have cloned the repo to, and open project root directory on VSCode (install VSCode docker extension for this)

6. open window 1, from project root directory, run cd api
npm install

7. open window 2, from project root directory, run cd ui
npm install

8. In api/scripts/init.mongo.js, change the email addresses which are marked with comment “replace with your own email 1” and “replace with your own email 2”, to your own Google emails, so that you will be able to view them with your Google login. 2 Google emails are needed.

9. in api folder (window 1), run mongo omni scripts/init.mongo.js

10. in api folder (window 1), run npm start

11. browser open graphQL interface to confirm that it is running localhost:3000/graphql

12. in ui folder (window 2), run
npx webpack -w --config webpack.serverHMR.js
then ctrl+c to end process

13. in ui folder (window 2), run
npm run dev-all 
(please give a moment for bundle and compilation to complete)

14. browser open localhost:8000, confirm frontend showing, login button for google account login

## Testing Steps

15. To test “happy path” transaction of the application, do not use seeded data, instead

**With Google account 1**
a. Create 1 offline profile in “Your Offline Profiles” with all fields filled
b. The new offline profile should be viewable in “Browse Offline Profiles”

**Switch to Google account 2**
a. The new offline profile should be viewable in “Browse Offline Profiles”
b. The new offline profile should show a Create Storage Collaboration button
c. Create 1 Storage Collaboration with all fields filled and submit

**Switch to Google account 1**
a. The new Storage Collaboration should be viewable in “Your Storage Collaborations”
b. The new Storage Collaboration should show Accept and Reject buttons
c. Accept the Storage Collaboration
d. The new offline profile will reflect new available storage and cold storage volumes after accounting for the new Storage Collaboration
(For seeking field, always select Storage option)

Note:
- If Google log in modal button is not active, refresh page, ensure URL is localhost:8000 - If logo display is unclear, navigate to another URL link and refresh the page
- If any fields become unclear after an action, refresh the page
