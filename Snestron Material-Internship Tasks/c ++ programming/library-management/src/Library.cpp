#include "Library.h"
#include <iostream>

void Library::addBook(const Book &book) {
    books.push_back(book);
}

void Library::addUser(const User &user) {
    users.push_back(user);
}

void Library::issueBook(const std::string &isbn) {
    for (auto &book : books) {
        if (book.getISBN() == isbn) {
            if (!book.getStatus()) {
                book.issue();
                std::cout << "Book issued.\n";
            } else {
                std::cout << "Book already issued.\n";
            }
            return;
        }
    }
    std::cout << "Book not found.\n";
}

void Library::returnBook(const std::string &isbn) {
    for (auto &book : books) {
        if (book.getISBN() == isbn) {
            if (book.getStatus()) {
                book.returnBook();
                std::cout << "Book returned.\n";
            } else {
                std::cout << "Book was not issued.\n";
            }
            return;
        }
    }
    std::cout << "Book not found.\n";
}

void Library::showBooks() const {
    for (const auto &book : books) {
        std::cout << "Title: " << book.getTitle()
                  << ", Author: " << book.getAuthor()
                  << ", ISBN: " << book.getISBN()
                  << ", Status: " << (book.getStatus() ? "Issued" : "Available") << "\n";
    }
}