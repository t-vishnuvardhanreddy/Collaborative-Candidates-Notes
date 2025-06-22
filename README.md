-> Collaborative Candidate Notes:

	A real-time collaborative platform for managing candidate notes efficiently in a hiring environment. This tool empowers recruiters and hiring teams.
	Built to streamline communication, this platform brings recruitment workflow into one place with real-time sync, clarity, and control.


---------------------------------------------------------------------------------------------------------------

-> Key Features:

-->  Authentication-
 	Secure user **sign-up and login** using name, email, and password.
 	JWT-based route protection — unauthenticated users are redirected to login.
  
-->  Dashboard-
   	Authenticated users land on a "dashboard".
	"Candidate List": Create and view dummy candidates with name and email.
	"Mentions Panel": See real-time @mentions addressed to the logged-in user.

-->  Candidate Notes
	 Clicking a candidate opens a dedicated notes view.
	 Real-time messaging interface powered by Using "Socket.IO.
	 @username tagging with autocomplete.
	 Mentions automatically notify the tagged user.

-->  Real-Time Communication
	 Notes are broadcasted to all users viewing the candidate's notes page as well as adding the Candidate.
	 Mentions trigger Using A toast notification.
  	 An entry in the dashboard notifications card.

-->  Global Notifications Card
	 Lists all messages where the current user was tagged.
	 Clicking a notification scrolls to and highlights the specific note.

-------------------------------------------------------------------------------------------------

-> Tech Stack:

--> Frontend: "React","Tailwind CSS". It is Fast, Flexible UI utility styling.
--> Backend : "Node.js" + "Express.js".  Lightweight REST & WebSocket handling.
--> Datebase: "PostgreSQL". Reliable relational Storage.
--> Authentication: "JWT (bcryot + Express.js). Secure, stateless auth.
--> Realtime: "Socket.IO" . Bi-directional Communication.
     

---------------------------------------------------------------------------------------------------	

-> Execution:

--> Frontend: cd frontend.
	      npm run dev.
	      Runs under: "http://localhost:3000".

--> Backend: cd backend.
	     node server.js.
	     Runs under" "http://localhost:5000".



---------------------------------------------------------------------------------------------------

->SETUP:

--> git clone https://github.com/t-vishnuvardhanreddy/Collaborative-Candidates-Notes.git
--> cd Collaborative-Candidates-Notes
--> git checkout master
--> dir
--> cd frontend 
--> npm install
--> npm start.

Server running at "http://localhost:3000"


--> cd backend
--> npm install
--> node server.js

Server running at "http://localhost:5000"


Web URL: https://github.com/t-vishnuvardhanreddy/Collaborative-Candidates-Notes/tree/master.


Authorized by T. VISHNUVARDHAN REDDY.
Purpose: Algohire Hiring Hackathon.
Deployed on 22 jun 2025.

-----------------------------------------------------------------------------------------------

