FROM ubuntu:18.04

RUN apt-get update -y
RUN apt-get install -y golang

COPY . /app
WORKDIR /app/src


RUN go build -o ./out/src .

EXPOSE 8081

CMD ["./out/src"]