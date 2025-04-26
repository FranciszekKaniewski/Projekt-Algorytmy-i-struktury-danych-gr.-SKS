OUT_NAME := ./exe/main

INCLUDES := includes
CROW := includes
CROW_MIDDLEWARES := includes

H_FILES_DIR := src/headers
CPP_FILES := $(wildcard src/*.cpp)
MAIN_CPP_FILE := main.cpp


build:
	@mkdir -p exe
	g++ -I $(H_FILES_DIR) -I $(CROW) -I $(CROW_MIDDLEWARES) -I $(INCLUDES) -o $(OUT_NAME) $(CPP_FILES) $(MAIN_CPP_FILE)

run:
	./exe/main

bar:
	@$(MAKE) build
	@$(MAKE) run

docker:
	docker build -t my-crow-app .
	docker run -it --rm --name Projekt-Algorytmy -p 3000:3000 -p 5173:5173 my-crow-app sh -c "make bar"