CXX = g++
CXXFLAGS = -std=c++11 -Iinclude

SRC = src/main.cpp src/Book.cpp src/User.cpp src/Library.cpp src/Date.cpp
OBJ = $(SRC:.cpp=.o)
TARGET = library_app

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	rm -f src/*.o $(TARGET)