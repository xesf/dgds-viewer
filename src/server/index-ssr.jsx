/* eslint-disable react/no-danger */
const React = require('react');

module.exports = () => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <link rel="shortcut icon" href="favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <link rel="manifest" href="manifest.json" />
            <link rel="shortcut icon" href="favicon.ico" />
            <title>Dynamix Game Development System Viewer</title>
            <link
                rel="stylesheet"
                href="http://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
            />
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root" />
            <script type="text/javascript" src="bundle.js" />
        </body>
    </html>
);
