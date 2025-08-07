#ifndef DATE_H
#define DATE_H

#include <string>

class Date {
private:
    int day, month, year;

public:
    Date(int d, int m, int y);
    std::string toString() const;
};

#endif