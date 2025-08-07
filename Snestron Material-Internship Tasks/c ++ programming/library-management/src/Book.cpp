#include "Book.h"

Book::Book(std::string title, std::string author, std::string isbn)
    : title(title), author(author), isbn(isbn), isIssued(false) {}

std::string Book::getTitle() const { return title; }
std::string Book::getAuthor() const { return author; }
std::string Book::getISBN() const { return isbn; }
bool Book::getStatus() const { return isIssued; }

void Book::issue() { isIssued = true; }
void Book::returnBook() { isIssued = false; }