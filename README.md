# MVP

Prerequisites:

Ensure Node is installed.
	To install, go to https://nodejs.org/en/download/ and click on the download link.

Before running for the first time, open a command prompt and run the command:
	> npm install

	This will install the dependencies listed in the package.json files

To Run:
1. Open a command prompt and navigate to the directory the files are in.

2. Run the command:
	> mongod --dbpath 'full-directory-to/data'

	--or-- 

	> mongo "mongodb+srv://cluster0-hiyas.mongodb.net/test" --username mjr5736

3. To launch, run the command:
	> npm start

4. Open your browser of choice and navigate to http://localhost:3000 to view the map and tweet locations being plotted.

5. For additional information about the markers being plotted, open a console window in the browser. The text and location of incoming tweets are displayed in the console.

	Opening the console: https://kb.mailster.co/how-can-i-open-the-browsers-console/
