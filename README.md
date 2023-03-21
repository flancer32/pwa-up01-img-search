# Image Search PWA

PWA to upload images to server and to search Google with images titles as a keys.

## Web Server (Apache 2)

Install:

```shell
$ sudo apt install apache2
$ sudo a2enmod headers proxy proxy_http proxy_http2
$ sudo snap install certbot --classic
```

Configure:

```apacheconf
<VirtualHost *:80>
    ServerName domain.com
    # use it to request SSL certificate with certbot
#    DocumentRoot /var/www/html
#    <Directory /var/www/html/>
#        AllowOverride All
#        Require all granted
#    </Directory>

    # Redirect all to HTTPS
    RewriteEngine on
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName domain.com

    LogLevel warn
    ErrorLog  /var/log/apache2/domain_error.log
    CustomLog /var/log/apache2/domain_access.log combined

    Header set Access-Control-Allow-Origin "*"

    SSLCertificateFile /etc/letsencrypt/live/domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/domain.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    # Redirect all requests to HTTP2 server.
    RewriteEngine  on
    RewriteRule    "^/(.*)$"  "h2c://localhost:8080/$1"  [P]
</VirtualHost>
```

## RDBMS

Create database and user for PostgreSQL:

```shell
$ sudo apt install postgresql postgresql-contrib
$ sudo -u postgres psql
...
postgres=# create user ${user} password '${password}';
postgres=# create database ${db} owner ${user};
\q
```