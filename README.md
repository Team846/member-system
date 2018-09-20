# Member System

## Using
To use this system, visit [Lynbrook Robotics Member System](https://lynbrookrobotics.com/member-system)

## Contributing
To contribute to this codebase, you need to have Node.js and NPM installed.

After cloning the repository, run `npm install` to install development dependencies from `package.json`. These will be 
locally installed in `node_modules`.

### Starting the development server
This will start a server on port 3000, and open your default web browser to the correct address.
~~~
npm run start
~~~

### Building the project
This will optimize our code, and create a static `build` folder. You can use this to test our project. We are currently
pushing this folder to the `gh-pages` branch to deploy, but will set up a CI tool (Travis) to automate builds soon.
~~~
npm run build
~~~

### Running tests
This will run all `*.test.js` files in the `src` folder and generate a report.
~~~
npm run test
~~~