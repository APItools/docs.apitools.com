PROJECT := $(subst @,,$(notdir $(shell pwd)))
RUN = docker run --rm
NAME = $(PROJECT)-build

all: clean build test

test: run

run:
	$(RUN) --name $(NAME) $(PROJECT) $(CMD)

deploy: CMD = deploy:production
deploy: run

pull:
	- docker pull quay.io/3scale/ruby:2.0

bash:
	$(RUN) -t -i  --entrypoint /bin/bash $(PROJECT)

build: pull
	docker build -t $(PROJECT) .

clean:
	- docker rm --force $(NAME)
