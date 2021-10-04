# Speed Running Website

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Configuration](#configuring-the-app)
- [Running](#running-the-app)
- [To-Do](#to-do)

## General Info

![unknown](https://user-images.githubusercontent.com/64388455/135778318-b14aaa3e-0327-4ffe-8c2b-c04bb45ced65.png)

This project is a Speed Running Website. You can post you're speed runs, and if they are verified by an ADMIN then it will be posted for the world to see. 

<p align="center">
  <img src="https://user-images.githubusercontent.com/64388455/135778330-4074afd8-92a4-4cde-a44c-b4fa9ec26987.png" />
</p>

If there is a game that you love speedrunning but cannot find it, then you can make a request to have that game up for the world to see.

## Technologies

Project is created with:

- Node JS
- MongoDB
- EJS

## Setup

- #### Node installation on Windows

Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If Node is installed run the following commands.

    $ git clone https://github.com/Zaid-Web-Applications-Personal/Speed-Running-Site.git
    $ cd Speed-Running-Website
    $ npm install

## Configuring The App

Add a `.env` file to the project and a `SESSION_SECRET`, `ADMIN`, and `MONGO`. `SESSION_SECRET` can be random and the same for `ADMIN`. For `MONGO` get the url for your database.

## Running The App

    $ npm run start

## To-Do

- [x] Add Admins Pages.
- [x] Update Styling.
- [ ] Add Comments.
