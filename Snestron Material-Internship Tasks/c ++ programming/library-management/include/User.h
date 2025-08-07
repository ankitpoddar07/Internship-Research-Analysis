#ifndef USER_H
#define USER_H

#include <string>

class User {
private:
    std::string name;
    std::string id;

public:
    User(std::string name, std::string id);
    std::string getName() const;
    std::string getId() const;
};

#endif