FROM php:8.5-apache

RUN apt-get update && apt-get install -y git unzip libzip-dev \
    && docker-php-ext-install mysqli zip \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite headers

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/override.conf \
    && a2enconf override

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html