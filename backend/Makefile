OUT_NAME := ./exe/main

INCLUDES := includes
CROW := includes
CROW_MIDDLEWARES := includes

H_FILES_DIR := src/headers
CPP_FILES := $(wildcard src/*.cpp)
MAIN_CPP_FILE := main.cpp

# ============ APP
build:
	@mkdir -p exe
	g++ -I $(H_FILES_DIR) -I $(CROW) -I $(CROW_MIDDLEWARES) -I $(INCLUDES) -o $(OUT_NAME) $(CPP_FILES) $(MAIN_CPP_FILE)

run:
	./exe/main

bar:
	@$(MAKE) build
	@$(MAKE) run

# ============ TESTS

HEADERS_TESTS_FILES := tests/headers
TESTS_CPP_FILES := $(wildcard tests/*.cpp)
TESTS_OUT_NAME := ./exe/tests

build-tests:
	@mkdir -p exe
	g++ -I $(H_FILES_DIR) -I $(CROW) -I $(CROW_MIDDLEWARES) -I $(INCLUDES) -o $(TESTS_OUT_NAME) $(TESTS_CPP_FILES) $(CPP_FILES)

run-tests:
	./exe/tests

bar-tests:
	@$(MAKE) build-tests
	@$(MAKE) run-tests