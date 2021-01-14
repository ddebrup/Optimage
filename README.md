## Team Name - Coders Legacy

### Project Overview
----------------------------------

On researching the given problem statement for developing an optimization algorithm for efficient storage and retrieval of compressed images , and looking towards developing solutions to tackling the job, we drew a conclusion that the need was to build a system that could accept images and put up a medium to allow necessary modifications, to aid the process of storing and retrieving them later. On digging a bit deeper into the statement, we generalized that we were actually required to make a portal consisting of different image manipulation techniques, which could be utilized to fulfill the expected requirements.



### Solution Description
----------------------------------
We, therefore, set to develop a solution tailored to meet the needs of the conclusions drawn by exploring the statement, which could further provide some other extensible features aimed at improving the interaction between the user and the interface in a way to decrease the general problems faced while handling the image files at the best possible way.

We managed to provide a smart application hosted on the Web, housing a horde of features aimed at minimizing the issues encountered while manipulating the provided image files, all wrapped up into a simple and easy to use user interface.

Our solution is built with the sole motive of providing an easy and light-medium for the users to compress, modify, store, and retrieve their images with the lightest of efforts and highest precision possible at our end.

Optimage is therefore a smart web application with an easy to use interface for image modifications and optimizations, housing storage, and retrieval features.

#### Architecture Diagram

![Architecture](Documentation/architecture.png)

#### Technical Description

Optimage is an end to end connected solution app well integrated with the current technologies of the industry. On the frontend, we use a bundle of HTML, CSS, Javascript frameworks, paralleled with libraries such as JQuery and frameworks such as Bootstrap. We use the NodeJS environment in the backend and npm services as the javascript package manager. Some libraries and packages used in the algorithms are OpenCV, SciPy, Pillow, SKImage, Matplotlib, Sci-Kit Learn. Our product has been deployed in the Amazon AWS cloud for smooth and easy operation. 

##### Setup Instructions

The codebase consists of two servers -- NodeJS server and Flask server (ML server)<br>
Databases -- Mongo Atlas and S3 Bucket<br>
To run the code :-
1. Change directory to site-server and run "npm install" and after node_modules are insatlled run "npm start" which will start the node server
2. Change directory to api-server and run "pip3 -r install req.txt" after this run "python3 app.py"

You can now open the application at localhost:3000


### Team Members
----------------------------------

Aditya Bhardwaj - b518005@iiit-bh.ac.in - UI/ UX Design, Documentation, Project Design <br>
Aditya Gupta - b518006@iiit-bh.ac.in - NodeJS backend development, Flask API development & Stress Testing, UI/ UX development & Integration <br>
Debrup Dutta - b518020@iiit-bh.ac.in - UI/ UX Design & development, Project Research & Scripting, Documentation <br>
Subham Sharma - b518054@iiit-bh.ac.in - Machine Learning & Compression algorithms, Debugging, Testing & Documentation, Project Concept & Research


