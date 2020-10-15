# ssl-server
Generic HTTPS server based on Express.


Install with `cd src; yarn add express;cd ..`.

Prepare with `cd keys;openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt; cd ..`

Install with `cd src; node server.js`.


