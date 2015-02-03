NWSL Data Visualizations Site ⚽
=========

Graphs/data visualizations relating to the [National Women's Soccer League](http://www.nwslsoccer.com/index.html), running on Angular, D3, and Express.

Dependencies
----
Node (which includes npm), Bower, and SASS.

Setup/Use
-------
1. Run `npm install`
2. Run `bower install`
3. Run the webserver in one terminal tab `node app/server.js` and open up `localhost:3000`.
4. Run `gulp watch` in another terminal tab to run JS Lint and compile CSS.
5. To create a build of your app for deployment, run `gulp build`. This will create a /dist folder containing your app.
6. You can then test the build using `node dist/server.js`.

The basic organization and dev environment for this project is based on my own [Gulp-Angular-Skeleton](https://github.com/hannaliebl/gulp-angular-skeleton).
