// Load in puppeteer
const puppeteer = require('puppeteer');

//this wrapper means 'immediately execute this code
void (async () => {
    // Wrapper to catch errrors
    try {

        // Create a new Browser instance
        const browser = await puppeteer.launch();

        // Create a page insdie the browser
        const page = await browser.newPage();

        // Navigate to a website
        await page.goto('https://scrapethissite.com/pages/forms');
       
        // Take a screenshot, then save it to a folder/file
        await page.screenshot({
            path: './screenshots/page1.png'
        });

        // Generate a PDF of the page and save it to a folder/file
        await page.pdf({
            path:'./pdfs/page1.pdf'
        });        


        /** GETTING DATA **/
        // evaluate() lets us run JS in the browser/communicate back data
        const teams = await page.evaluate( () => {

            // Helper function so we can reuse the code
            // Grab the td and text; remove the trailing whitespace
            const grabFromRow = (row, classname) => row
                .querySelector(`td.${classname}`)
                .innerText
                .trim()

            // Selector (ie. the rows we want to target)
            const TEAM_ROW_SELECTOR = 'tr.team';

            // Create an array to store our data Objects in
            const data = [];

            // Get all the Team Rows 
            const teamRows = document.querySelectorAll(TEAM_ROW_SELECTOR);
            
            // Create Objects from each teamRow
            for (const row of teamRows ) {
                data.push( {
                    name: grabFromRow(row, 'name'),
                    year: grabFromRow(row, 'year'),
                    wins: grabFromRow(row, 'wins'),
                    losses: grabFromRow(row, 'losses'),
                });
            }

            // Finally, return the data
            return data; 
        });
        // Loggin to illustrate the concept
        //NOTE: JSON.stringify and params/arguments
        console.log(teams);
        console.log( JSON.stringify(teams, null, 2) );

        //BONUS - Save as a file
        const fs = require('fs');
        fs.writeFile(
            './json/teams.json',
            JSON.stringify(teams, null, 2),            // addtional params for nice formatting
            (err) => err ? console.error('Data not written', err) : console.log('Did it!!')
        )





        // OR could do it this way (**NOTE: subfolders must be already created**)
        // const targetSite = 'https://f45challenge.com/';
        // const screenshotDir = './screenshots/f45Test/challenge-home.png';
        // const pdfDir = './pdfs/f45test/challenge-home.pdf';
        // console.log('doin more stuff.......');

        // await page.goto(targetSite);
        // await page.screenshot({path: `${screenshotDir}` });
        // await page.pdf({path: `${pdfDir}` });


        // Close the browser
        await browser.close();

    } catch {
        // Catch any errors and log it
        console.log(error);
    }
})()