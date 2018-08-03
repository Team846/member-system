# Lynbrook Robotics Member System

### Developing
To start the development server, run either of the following
 commands. Note that you will need Node.js to develop.
~~~
npm start
yarn start
~~~

### Deploying

To build & bundle the app, run one of the following commands:
~~~
npm run build
yarn build
~~~

You will then be able to push the generated code to the 
`gh-pages` branch, so that it can be served by GitHub Pages

## Notes
1. We use the ES6 arrow function syntax so that the functions will
 be automatically binded to the class.

2. Nested classes refer to the parent class inside arrow
 functions. However, in a normally declared function, like
 render(), you will get the expected behavior.
 
3. If your code does not use the arrow function syntax, you
 will have to remember to bind it in your JSX.