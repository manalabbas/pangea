# Pangea

**Pangea** is a web application with a simple map interface, visualized using the [Mapbox API](https://docs.mapbox.com/mapbox-gl-js/api/), where users can select a location on the map and observe the recents news and trends in that area. The interactive display not only informs users of trends on a global scale by utilizing the [Twitter API](https://developer.twitter.com/en/docs/api-reference-index), but also fosters a learning environment that promotes cultural awareness and a knowledge of geography, world demographics and foreign affairs.

## Inspiration
In 2016, the [Global Literacy Survey](https://www.cfr.org/global-literacy-survey) revealed significant gaps between the knowledge young adults currently hold about today’s world, and what they should know to successfully navigate in it.
* 1,203 college-aged adults who attend or have attended a 2- or 4-year college in the United States were asked 75 questions about geography, recent foreign affairs, and economics
* 86% said they consider themselves at or above average in terms of knowledge about global affairs
* The average score on the survey was 55%, a failing grade by most educational standards

Given our increasingly interconnected world, geographic literacy and geopolitical understanding are more important than ever. Luckily, this information is at our fingertips. In fact, with **Pangea**, the world is, more or less, in the palm of your hands.

## Set Up

#### Required Dependencies
Install [`node.js`](https://nodejs.org/en/download/) and [`MySQL`](https://dev.mysql.com/downloads/mysql/) on environment, as well as the [`express`](https://github.com/expressjs/express), [`twitter`](https://github.com/desmondmorris/node-twitter) and [`mysql`](https://github.com/mysqljs/mysql) modules.

    $ npm install express
    $ npm install twitter
    $ npm install mysql

#### OAuth 1.0a
The Twitter developer platform uses the OAuth 1.0a method to act on behalf of a Twitter account. Each API request must be signed by passing several keys and tokens, generated in your [Twitter developer app](https://apps.twitter.com/app/new)’s details page. Once acquired, use your keys to configure the `twitterkey.json` file.
```js
{
  "consumer_key": "FILL IN",
  "consumer_secret": "FILL IN",
  "access_token_key": "FILL IN",
  "access_token_secret": "FILL IN"
}
```

#### Initialize MySQL Database
Once the MySQL client is running, create a database named "pangea" by typing the following commands at the mysql> prompt.

    mysql> CREATE DATABASE pangea;
    mysql> USE pangea;

Configure the `mysqlkey.json` file.
```js
{
  "host": "FILL IN",
  "user": "FILL IN",
  "password": "FILL IN"
} 
```

#### Start

    $ node server.js
Request index.html from the node server by visiting [`http://localhost:8080/index.html`](http://localhost:8080/index.html).
