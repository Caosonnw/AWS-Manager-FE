FROM nginx
WORKDIR /usr/share/nginx/html

COPY . .

# docker build . -t img-aws-management-fe

# docker run -d -p 3000:80 --name cons-aws-management img-aws-management-fe