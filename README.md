The project is a standalone application built with nodejs and react frontend engine.
The database used for this project is sqlite3 for simplicity.

# Running the project

1. Download Latest version of Nodejs at https://nodejs.org/en/download
2. Choose Windows Installer .msi
3. after installing node, open a command prompt
4. navigate to nodeproject folder (cd nodeproject)
5. run the backend project using node index.js

6. open a new command prompt Window
7. navigate to frontendproject (cd frontendproject\src)
8. run the react frontend engine starts on port 3001 with (set PORT=3001 && npm start)
9. The application should be running at this point and you should start entering data.

#Table Schema in sQlite

CREATE TABLE "customer" (
	"id"	INTEGER,
	"name"	TEXT,
	"email"	TEXT,
	"company_name"	TEXT,
	"phone"	TEXT,
	"profile_picture_url"	TEXT,
	"contract_start_date"	TEXT,
	"contract_expire_date"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)