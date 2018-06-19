# member-system

To get started working on this repository, clone it from GitHub
~~~
git clone https://github.com/Team846/member-system.git
~~~

After cloning, your going to want to be able to see the changes you make.
We will use Python for that. Run either of the following commands:
~~~
python2 -m SimpleHTTPServer
python3 -m http.server
~~~

Now, you should be able to navigate to <a>http://localhost:80</a>, and see
the website running in your browser. The python server will automatically
serve update files on a new request, unlike serve, or other servers.

From here on out, just branch out.
~~~
git branch my-feature
git checkout my-feature
~~~

And when you're ready, push
~~~
git add . # Register any new files with Git
git commit -m "Describe your changes here"
git push
~~~
