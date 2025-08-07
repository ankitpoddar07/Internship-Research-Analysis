#include "Date.h"
#include <sstream>

Date::Date(int d, int m, int y) : day(d), month(m), year(y) {}

std::string Date::toString() const {
    std::ostringstream oss;
    oss << day << "/" << month << "/" << year;
    return oss.str();
}