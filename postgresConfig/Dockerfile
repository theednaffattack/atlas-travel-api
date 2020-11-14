FROM kartoza/postgis:12.0
# FROM kartoza/postgis:11.0-2.5

ADD secret/cert.pem /etc/ssl/certs/ssl_cert.pem
ADD secret/key.pem /etc/ssl/private/ssl_key.pem

RUN chmod 400 /etc/ssl/private/ssl_key.pem