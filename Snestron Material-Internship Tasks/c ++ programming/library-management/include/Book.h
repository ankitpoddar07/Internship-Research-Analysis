#ifndef BOOK_H
#define BOOK_H

#include <string>

class Book {
private:
    std::string title;
    std::string author;
    std::string isbn;
    bool isIssued;

public:
    Book(std::string title, std::string author, std::string isbn);

    std::string getTitle() const;
    std::string getAuthor() const;
    std::string getISBN() const;
    bool getStatus() const;

    void issue();
    void returnBook();
};

#endif