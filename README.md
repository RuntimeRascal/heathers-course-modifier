# heathers-course-modifier
> A `node js` **cli** program to add timer functionality to a `scorm` archive file  

Using the cli
---  
- clone the source code by executing `git clone https://github.com/simpert/heathers-course-modifier.git`  
- open the repo in [VS Code](https://code.visualstudio.com/#)
- install the packages by executing `npm install`
- build the javascript by executing `npm run build`
- create a file called `.env` in the repos folder root (same folder as the `package.json` file) and place the defaults you would like to use in the file
    ``` shell
    COURSE_DIR_PATH=C:\my-courses-directory
    DEFAULT_IDLE_TIME=600000
    DEFAULT_COUNTDOWN_TIME=10
    DEFAULT_COURSE_TOTAL_TIME=10800
    ```
- place any courses you would like to modify (course zip files) either in the directory you specified above in `COURSE_DIR_PATH` or you can leave that blank and instead place courses in the [courses](./courses) directory.
- execute the cli by pressing `F5` or executing `npm run start`
- hit `enter` when promted for **course idle time** to use your specified default
- hit `enter` when promted for **course count down** to use your specified default
- hit `enter` when promted for **ourse duration** to use your specified default
- use the arrow keys to select the course you want to modify *(the list will be all the contents of the courses directory)* then press `enter`
- wait for the course to be modified and archived back up. the terminal will tell you where it placed the modified zip.



This script does the following *(not an exhaustive list)*
---  

1. Prompts for the arguments.   
    > each argument has a default value specified in parenthesis and to use it just hit `enter`.
    > the defaults can be set in the [environment file](./.env)
    - **course idle time** *used to determine reset function calls in `index.html body event handlers`*
    - **course count down** *used to display text in the popups*
    - **course duration** *used to display in the text in the popups*
    - **course to modify** *the name of teh course file/archive*

2. Ensures `working` directory. Create directory to extract course archive to if needed and ensures that the directory is empty

3. Extracts the course archive to the working directory.

4. Writes [custom javascript code](./content/custom-index-code.js) and [styles css file](./content/custom-index-styles.css) to the courses `scormcontent/lib` directory

5. Reads contents of course `scormcontents/index.html` file and parses into a `JSDOM` instance for manipulations
    - adds event handlers to `body` tag with arguments from prompted times
    - inserts contents of [popups html](./contents/popups.html) file after updating time text
    - inserts `<script>` tag which points to [custom javascript code](./content/custom-index-code.js)
    - inserts `<style>` tag which points to [styles css file](./content/custom-index-styles.css)
    - gets contents of existing `<script>` tag and applies following code mods
        - currentTimeArrayCodeMod
        - isTimeCompletedCodeMod
        - completeOutCodeMod
        - exitFunctionCodeMod
        - finishFunctionCodeMod
        - rootCodeMod

6. Persist the manipulated `scormcontents/index.html` file

7. Reads contents of course `scormdriver/indexAPI.html` file and parses into a `JSDOM` instance for manipulations
    - gets contents of existing `<script>` tag and applies following code mods
        - declare variable `getCourseCurrentTimeLMS` at begining of script
        - replace `LoadContent` function declaration block body

8. Persist the manipulated `scormdriver/indexAPI.html` file

9. Reads contents of course `scormdriver/scormdriver.js` file and apply following code mods
    - scorm2004GetCourseCurrentTimeFuncCodeMod
    - scormGetCourseCurrentTimeFuncCodeMod
    - aiccGetCourseCurrentTimeFuncCodeMod
    - noneGetCourseCurrentTimeFuncCodeMod
    - tcapiGetCourseCurrentTimeFuncCodeMod
    - cmi5GetCourseCurrentTimeFuncCodeMod
    - lmsStandardApiFuncCodeMod
    - getCourseCurrentTimeFuncCodeMod
    - concedeControlCodeMod

10. Persist the manipulated `scormdriver/scormdriver.js` file

11. Archive *(zip)* the modified course and persist into the `modified-courses` directory within the determined course folder *(determined course folder is the folder the original course was found in. Either [courses](./courses) or a directory determined by setting `COURSE_DIR_PATH` in [environment file](./.env))*
