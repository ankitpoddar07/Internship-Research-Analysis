#ifndef LIBRARY_H
#define LIBRARY_H

#include <vector>
#include "Book.h"
#include "User.h"

class Library {
private:
    std::vector<Book> books;
    std::vector<User> users;

public:
    void addBook(const Book &book);
    void addUser(const User &user);
    void issueBook(const std::string &isbn);
    void returnBook(const std::string &isbn);
    void showBooks() const;
};

#endif