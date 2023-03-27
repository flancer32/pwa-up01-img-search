# Image Search PWA

PWA to upload images to server and to search Google with images titles as a keys.

## Web Server (Apache 2)

### Install

```shell
$ sudo apt install apache2
$ sudo a2enmod headers proxy proxy_http proxy_http2
$ sudo snap install certbot --classic
```

### Configure

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

    SSLCertificateFile /etc/letsencrypt/live/domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/domain.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    # Redirect all requests to HTTP2 server.
    RewriteEngine  on
    RewriteRule    "^/(.*)$"  "h2c://localhost:8080/$1"  [P]
</VirtualHost>
```

## RDBMS

### Install PostgreSQL

```shell
$ sudo apt install postgresql postgresql-contrib
```

### Configure PostgreSQL

Create new database and user:

```shell
$ sudo apt install postgresql postgresql-contrib
$ sudo -u postgres psql
...
postgres=# create user ${user} password '${password}';
postgres=# create database ${db} owner ${user};
\q
```

## Configure App

Local configuration for the app is place in `./cfg/local.json`. Just copy `./cfg/init.json` to `./cfg/local.json` and
edit configuration options:

```json
{
  "@teqfw/db": {
    "client": "pg",
    "connection": {
      "host": "127.0.0.1",
      "user": "...",
      "password": "...",
      "database": "..."
    }
  },
  "@teqfw/web": {
    "server": {
      "port": 8080
    }
  }
}
```

## App Service

Create service description (`/home/${user}/sys/pwa-${name}.service`):

```
[Unit]
Description=App Name PWA.
After=network.target

[Service]
Type=simple
Restart=always
User=${user}
PIDFile=/run/pwa-${name}.pid
WorkingDirectory=/home/${user}/inst/${name}
ExecStart=/usr/bin/node /home/${user}/inst/${name}/bin/tequila.mjs web-server-start
ExecStop=/usr/bin/node /home/${user}/inst/${name}/bin/tequila.mjs web-server-stop
StandardOutput=append:/home/${user}/log/${name}/out.log
StandardError=append:/home/${user}/log/${name}/out.log

[Install]
WantedBy=multi-user.target
```

... and make a link to the file from `/etc/systemd/system/`:

```shell
$ cd /etc/systemd/system/
$ sudo ln -s /home/${user}/sys/pwa-${name}.service
```

... then reload daemon and setup service loading on startup:

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl enable pwa-${name}
```

To start/stop the service:

```shell
$ sudo systemctl start pwa-${name}
$ sudo systemctl stop pwa-${name}
```

Create this file (`/etc/sudoers.d/${user}`) to allow service restart for user `${user}` as `sudo` without password:

```
${user} ALL=(ALL) NOPASSWD: /bin/systemctl start pwa-${name}.service
${user} ALL=(ALL) NOPASSWD: /bin/systemctl stop pwa-${name}.service
```

### Log rotation

To rotate `/home/${user}/log/${name}/out.log` file create log rotate configuration in  `/etc/logrotate.d/pwa-${name}`:

```
/home/${user}/log/${name}/out.log {
    copy
    dateext
    dateformat _%Y%m%d_%s
    missingok
    su ${user} ${user}
    olddir /home/${user}/log/${name}/old
    createolddir 770 ${user} ${user}
    rotate 30
    size 100M
    postrotate
        systemctl restart pwa-${name}
    endscript
}
```

## CLI commands

Remove image from RDB & filesystem (by backendID, by UUID, all):

```shell
$ ./bin/tequila.mjs app-image-remove -b <bid>
$ ./bin/tequila.mjs app-image-remove -u <uuid>
$ ./bin/tequila.mjs app-image-remove --all
```