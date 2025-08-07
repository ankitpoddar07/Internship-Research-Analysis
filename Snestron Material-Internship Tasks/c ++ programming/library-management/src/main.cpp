#include <iostream>
#include "Library.h"
#include "Date.h"

int main() {
    Library lib;

    lib.addBook(Book("C++ Basics", "Bjarne Stroustrup", "123"));
    lib.addBook(Book("Data Structures", "Mark Allen", "456"));
    lib.addUser(User("Alice", "U1"));

    lib.showBooks();

    lib.issueBook("123");
    lib.showBooks();

    lib.returnBook("123");
    lib.showBooks();

    Date today(24, 7, 2025);
    std::cout << "Today's date: " << today.toString() << std::endl;

    return 0;
}