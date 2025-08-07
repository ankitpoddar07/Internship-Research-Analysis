#include "User.h"

User::User(std::string name, std::string id) : name(name), id(id) {}

std::string User::getName() const { return name; }
std::string User::getId() const { return id; }